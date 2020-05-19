/*
*
*/
import request            from 'request' ;
import cheerio            from 'cheerio' ;
//
const URL_RATES = {
    DOLAR_HOY:{
        USD_ARS: "http://www.dolarhoy.com/Usd",
        USD_BRZ: "https://www.dolarhoy.com/cotizacion-real-brasileno",
        USD_CLP: "https://www.dolarhoy.com/cotizacion-peso-chileno",
        USD_UYU: "https://www.dolarhoy.com/cotizacion-peso-uruguayo"
    },
    URL_OFICIAL:{
        USD_ARS: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=ARS&apikey=5KDR08UVXHF7Z6AE` ,
        USD_BRZ: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRZ&apikey=5KDR08UVXHF7Z6AE` ,
        USD_CLP: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CLP&apikey=5KDR08UVXHF7Z6AE` ,
        USD_UYU: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=UYU&apikey=5KDR08UVXHF7Z6AE` 
    }
} ;
//
const getRateDolarHoy = (argOptions) => {
    return new Promise(function(respOk,respRech){
        try {
            //
            let urlDolarhoy = URL_RATES.DOLAR_HOY.USD_ARS ;
            if ( argOptions && argOptions.conversion ){
                if ( typeof URL_RATES.DOLAR_HOY[argOptions.conversion]=="undefined" ){
                    respRech({error:`conversion not found ${argOptions.conversion}`}) ;
                    return false ;
                } else {
                    urlDolarhoy = URL_RATES.DOLAR_HOY[argOptions.conversion] ;
                }
            }
            //
            request( urlDolarhoy , function(error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);
                    let nodedolarOficial      = false ;
                    let dolarOficialPromedio  = false ;
                    $('.container .row .venta span').each(function(index, nodeSearch ) {
                        dolarOficialPromedio = nodeSearch.children[0].data ;
                        if ( dolarOficialPromedio!=false ){
                            dolarOficialPromedio = String(dolarOficialPromedio).replace("$","").replace(" ","").replace(",",".").trim() ;
                            return false ;
                        }
                    });
                    dolarOficialPromedio = parseFloat(String(dolarOficialPromedio).trim()) ;
                    respOk({ rate: dolarOficialPromedio });
                } else {
                    respRech({error: 'Error during search of exchange rate',msg: error }) ;
                }
            });
        } catch(errRDH){
            respRech(errRDH) ;
        }
    }) ;
}
//
const getAlphavantageUSD2ARS = (argOptions) => {
    return new Promise(function(respOk,respRech){
        try {
            //
            let urlOficial = URL_RATES.URL_OFICIAL.USD_ARS ;
            if ( argOptions && argOptions.conversion ){
                if ( typeof URL_RATES.URL_OFICIAL[argOptions.conversion]=="undefined" ){
                    respRech({error:`conversion not found ${argOptions.conversion}`}) ;
                    return false ;
                } else {
                    urlOficial = URL_RATES.URL_OFICIAL[argOptions.conversion] ;
                }
            }
            //
            request({ url: urlOficial , json: true }, function(error, response, body) {
                if (error) {
                    respRech({error: "error during processing",msg:error}) ;
                } else {
                    let objRates = body['Realtime Currency Exchange Rate'] ? body['Realtime Currency Exchange Rate'] : body ;
                    let outTasa = 0.00 ;
                    for ( let key in objRates ){
                        if (  String(key).toUpperCase().indexOf('EXCHANGE RATE')!=-1 ){
                            outTasa = String(objRates[key]).trim() ;
                            outTasa = parseFloat(outTasa) ;
                        }
                    }
                    respOk({ rate: outTasa });
                }
            });
            //
        } catch(errER){
            respRech(errER) ;
        }
    }) ;
}
//
export const exchangeRate = {
    getRateDolarHoy: getRateDolarHoy,
    getRateOficial: getAlphavantageUSD2ARS
} ;
//