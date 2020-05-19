/*
*
*/
import { exchangeRate }     from '../lib/index' ;
//
exchangeRate.getRateDolarHoy({conversion:'USD_ARS'})
    .then((resD)=>{
        console.log('...resD: ',resD) ;
        return exchangeRate.getRateOficial() ;
    })
    .then((res2)=>{
        console.log('......res2: ',res2) ;
    })
    .catch((err)=>{
        console.log('...ERROR: ',err) ;
    }) ;
//