/*
*
*/
import { PARAMETROS, opcionesPOST, obj2qryString }       from '../utils/parametros' ;
import ls                                                from 'local-storage'    ;
export { PARAMETROS } ;
//
export const api = ( options ) => {
    //
    let BACKEND_URL = typeof __URL_BACKEND__!="undefined" ? String(__URL_BACKEND__).trim() : "https://www.waiboc.com:3001" ;
    if ( options.backEndServer && options.backEndServer!=false ){
        BACKEND_URL = String(options.backEndServer).trim() ;
    }
    //console.log('....API:: BACKEND_URL: ',BACKEND_URL,' options: ',options) ;
    //
    const getChatbotInfo = (argQry) => {
        return new Promise(function(respOk,respRech){
            try {
                //
                let getOpt  = {...opcionesPOST} ;
                getOpt.method = 'GET' ;
                delete  getOpt.body ;
                //
                // let tempUrlBackend = String(__URL_BACKEND__).trim() + '/chatbot/chatlog' + obj2qryString(argQry)+'&campos=conversation,unsubscribe' ;
                let tempUrlBackend = BACKEND_URL + PARAMETROS.BACKEND.API_SESSION + '?idChatbot='+argQry.idChatbot+'&idConversation='+argQry.idConversation ;
                //
                fetch( tempUrlBackend , getOpt )
                        .then(function(response){
                            if (response.status>=200 & response.status<=400) {
                                return response.json() ;
                            } else {
                                throw new Error("ERROR: getChatbotInfo. Http Status: "+response.status+'.') ;
                            }
                        }.bind(this))
                        .then(function(respBots ){
                            // console.log('...respBots: ',respBots) ;
                            respOk(respBots) ;
                        }.bind(this))
                        .catch((respRechaz ) => { respRech(respRechaz) ; }) ;
                //
            } catch(errFH){
                respRech(errFH) ;
            }
        }) ;
    } ;
    //
    const fetchChatlog = (argQry) => {
        return new Promise(function(respOk,respRech){
            try {
                //
                let getOpt  = {...opcionesPOST} ;
                getOpt.method = 'GET' ;
                delete  getOpt.body ;
                //
                let tempUrlBackend = BACKEND_URL + '/chatbot/chatlog' + obj2qryString(argQry)+'&campos=conversation,unsubscribe' ;
                //
                fetch( tempUrlBackend ,getOpt)
                        .then(function(response){
                            if (response.status>=200 & response.status<=400) {
                                return response.json() ;
                            } else {
                                throw new Error("ERROR: GET chatlog. Http Status: "+response.status+'.') ;
                            }
                        }.bind(this))
                        .then(function(respNlp   ){
                            if ( Array.isArray(respNlp.result) ){ respNlp.result=respNlp.result[0]; }
                            respOk(respNlp.result.conversation) ;
                        }.bind(this))
                        .catch((respRechaz ) => { respRech(respRechaz) ; }) ;
                //
            } catch(errFH){
                respRech(errFH) ;
            }
        }) ;
    } ;
    //
    const getIdConversation = (argFlagChatbot=true,argFlagNewConversation=false) => {
        return new Promise(function(respData,respRech){
            try {
                let idConversation = (argFlagNewConversation==true) ? false : ( ls( PARAMETROS.SESSION.ID_CONVERSATION ) || false ) ;
                // console.log('....getIdCon:: idConversation: ',idConversation) ;
                if ( idConversation ){
                    if ( argFlagChatbot==true ){
                        fetchChatlog( {_id:idConversation} )
                            .then((respLog)=>{
                                respData({id:idConversation, chatLog:respLog}) ;
                            })
                            .catch(respRech) ;
                    } else {
                        respData({id:idConversation}) ;
                    }
                } else {
                    if ( argFlagChatbot==true ){
                        fetchChatbot( {input: {text:''}} )
                            .then((respCB)=>{
                                idConversation = respCB._id ;
                                ls( PARAMETROS.SESSION.ID_CONVERSATION, idConversation ) ;
                                respData({id:idConversation,chatLog:[]}) ;
                            })
                            .catch(respRech) ;
                    } else {
                        respData({id: false}) ;
                    }
                }
            } catch(errGIC){
                console.dir(errGIC) ;
                respRech(errGIC) ;
            }
        }) ;
    } ;
    //
    const fetchChatbot = (argOpt) => {
        return new Promise(function(respOk,respRech){
            try {
                //
                let postOpt  = {...opcionesPOST} ;
                postOpt.body = JSON.stringify( argOpt ) ;
                //
                let tempUrlBackend =  BACKEND_URL + '/chatbot/mensaje' ;
                // console.log('...tempUrlBackend: '+tempUrlBackend+';') ;
                fetch( tempUrlBackend ,postOpt)
                        .then(function(response){
                            if (response.status>=200 & response.status<=400) {
                                return response.json() ;
                            } else {
                                throw new Error("ERROR: fetchChatbot. Http Status: "+response.status+'.') ;
                            }
                        }.bind(this))
                        .then(function(respNlp   ){
                            respOk(respNlp) ;
                        }.bind(this))
                        .catch((respRechaz ) => { respRech(respRechaz) ; }) ;
                //
            } catch(errFC){
                console.dir(errFC) ;
                respRech(errFC) ;
            }
        }) ;
    } ;
    //
    return {
        getChatbotInfo: getChatbotInfo,
        fetchChatlog: fetchChatlog,
        getIdConversation: getIdConversation,
        fetchChatbot: fetchChatbot,
        PARAMETROS: PARAMETROS
    } ;
} ;
//