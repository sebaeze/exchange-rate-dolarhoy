/*
*
*/
import React, { userState }                    from 'react' ;
import { Button, Icon, Tag }                   from 'antd'  ;
import { ImageLoader }                         from '../componentes/image/ImageLoader'   ;
import { TableDynamic }                        from '../componentes/table/TableDynamic'  ;
import { MessageCarousel }                     from '../componentes/messages/MessageCarousel' ;
import { CarouselImagenes }                    from '../componentes/image/CarouselImagenes'   ;
//
const log  = require('debug')('waiboc:parseAnswer') ;
//
const ReactRenderDynamic = (argProps) => {
    const subs = /(^.*)(\$(.*))/.exec(argProps.text);
    // console.log('....subs: ',subs) ;
    let tempText = String(argProps.text).replace(/\n/g, "<br//>") ;
    /*
    return(
        <div>
            {tempText}
        </div>
    ) ;
    */
    return( <div dangerouslySetInnerHTML={{__html: tempText }}></div> ) ;
} ;
//
const parseText     = (argAnswer,tempStyle,argKey,argOnClickOpcion, setInputEditable) => {
    let outDiv = false ;
    try {
        let tempText     = (argAnswer.text ? argAnswer.text : argAnswer.answer) || [""] ; ;
        let arrayAnswers = Array.isArray(tempText)==true ? tempText : new Array( tempText ) ;
        //
        outDiv = <div style={{...tempStyle,marginBottom:'0',width:'100%'}} key={argKey} >
            {
                arrayAnswers.map((eleTT,idxTT)=>{
                    // eleTT = eleTT.replace(/\n/g, "<br//>") ;
                    eleTT = <ReactRenderDynamic text={eleTT} />
                    return( <span key={idxTT} style={{whiteSpace: 'pre-wrap'}}  >{eleTT}</span>)
                })
            }
        </div>  ;
        //
    } catch(errPT){
        console.dir(errPT) ;
        throw errPT ;
    }
    return outDiv ;
}
//
const displayFileAlone = (elemFile,elemIdx) => {
    let outfile = null ;
    try {
        if ( elemFile.type.indexOf('image')!=-1 ){
            outfile =   <div className="waiboc-slide-panel" key={elemIdx} >
                            <ImageLoader  key={elemIdx}
                                        src={elemFile.relativePath}
                                        altImg={elemFile.description||elemFile.name||''}
                                        className="waiboc-slide-imag"
                                        wrapperImgClassName="waiboc-slide-wrapper-imag"
                                        wrapperTextClassName="waiboc-slide-wrapper-text"
                                        loadingClassName="loading" loadedClassName=""
                                        customStyle={{img:{marginTop:'10px'}}}
                                        title={elemFile.name}
                                        alt={elemFile.name}
                            />
                        </div> ;
        } else {
            let styleFile = {color:'green', fontSize:'32px',marginRight:'20px', marginTop:'10px'} ;
            let iconFile  = <Icon type="file" style={styleFile} /> ;
            switch( String(elemFile.type).trim() ){
                case 'application/vnd.ms-excel':       iconFile  = <Icon type="file-excel" style={styleFile} /> ; break ;
                case 'application/pdf':                iconFile  = <Icon type="file-pdf"   style={styleFile} /> ; break ;
                case 'application/vnd.ms-powerpoint':  iconFile  = <Icon type="file-ppt"   style={styleFile} /> ; break ;
                case 'application/zip':                iconFile  = <Icon type="file-zip"   style={styleFile} /> ; break ;
                case 'video/mp4':
                    iconFile = <video loop="" autoPlay="" muted="" style={{marginTop:'10px',minHeight:'100px' }} >
                                    <source src={elemFile.relativePath} type="video/mp4" />
                                </video> ;
                break ;
                default:
                    console.log('....formato desconocido de archivo:: type: '+String(elemFile.type).trim()+' objeto: ',elemFile) ;
                break ;
            }
            outfile = <div key={elemIdx} className="waiboc-slide-panel" >
                        <a href={elemFile.relativePath} target="_blank" >
                            {iconFile}
                            <span className="description" >
                                {elemFile.description||elemFile.name||''}
                            </span>
                        </a>
                    </div> ;
        }
    } catch(errFA){
        console.log('...ERROR: ',errFA) ;
    }
    return  outfile;
} ;

//
const parseFiles    = (argAnswer, argKey) => {
    let outEle = null ;
    try {
        if ( argAnswer.files && argAnswer.files.length>0 ){
            //
            if ( !argAnswer.fileDisplayType ){ argAnswer.fileDisplayType='carousel'; }
            //
            if ( argAnswer.fileDisplayType=='carousel' ){
                let arrayFiles = argAnswer.files.map((elemArch, elemIdx)=>{
                                    let outDisfile = displayFileAlone( elemArch,elemIdx ) ;
                                    return(
                                        <div key={elemIdx} style={{width:'auto',height:'200px'}} >{outDisfile}</div>
                                        ) ;
                                }) || [] ;
                outEle =    <CarouselImagenes
                                settings={{ infinite:true, autoplay: false, autoplaySpeed: 5000,centerMode:false,variableWidth:false}}
                                styleArrows={{background:'none',opacity:'0.2'}}
                                //ref={this.setRefCarousel}
                                arrows={false}
                                data={ arrayFiles }
                            /> ;
            } else {
                outEle = <div key={argKey+"_files"}>
                {
                    argAnswer.files.map((elemArch, elemIdx)=>{
                        let outDisfile = displayFileAlone( elemArch,elemIdx ) ;
                        return outDisfile ;
                    })
                }
            </div> ;
            }
        }
    } catch(errPI){
        console.dir(errPI) ;
        throw errPI ;
    }
    return outEle ;
}
const parseJson     = (argAnswer) => {
    let outEle = false ;
    try {
        outEle = <div style={{marginTop:'5px'}}><TableDynamic jsonData={argAnswer} /></div> ;
    } catch(errPI){
        console.dir(errPI) ;
        throw errPI ;
    }
    return outEle ;
}
const parseOption   = (argAnswer,tempStyle,argKey,argOnClickOpcion,setInputEditable) => {
    let outEle = false ;
    try {
        if ( argAnswer.options && argAnswer.options.length>0 ){
            if ( typeof setInputEditable=="function" ){
                setInputEditable(false,'desde define options: argAnswer.options: '+JSON.stringify(argAnswer.options)) ;
            } else {
                log('...no es funcion, que es?? setInputEditable:: ',setInputEditable) ;
            }
        } else {
            return <div></div> ;
        }
        // <span>{<ReactRenderDynamic text={argAnswer.text} />}</span>
        outEle =    <div >
                        {
                            argAnswer.options.map((elemInner, elemIdx)=>{
                                return (
                                    <Tag    key={elemIdx} style={{marginTop:'5px'}}
                                            onClick={ (argEE)=>{
                                                if ( argEE && argEE.preventDefault ){  argEE.preventDefault() ; }
                                                log('....se ejecuta esta garomba ??') ,
                                                setInputEditable(true,'desde click en tag: '+elemInner.label) ;
                                                argOnClickOpcion(elemInner.value) ;
                                            }}
                                    >
                                        {elemInner.label}
                                    </Tag>
                                )
                            })
                        }
                    </div> ;
    } catch(errPI){
        console.dir(errPI) ;
        throw errPI ;
    }
    return outEle ;
}
const parseCarousel = (argAnswer) => {
    let outEle = false ;
    try {
        outEle = <MessageCarousel  message={argAnswer} /> ;
    } catch(errPI){
        console.dir(errPI) ;
        throw errPI ;
    }
    return outEle ;
}
//
const allParsers = {
    text: parseText ,
    files: parseFiles ,
    json: parseJson ,
    options: parseOption ,
    carousel: parseCarousel
}
//
export const parseAnswer = ( argParams ) => {
    try {
        //
        const { answer, customStyle, onClickOpcion, setInputEditable } = argParams ;
        //
        let arrayOut     = [] ;
        let arrayAnswers = Array.isArray(answer) ? answer : new Array(answer);
        for ( let indArr=0; indArr<arrayAnswers.length; indArr++ ){
            let answerElem = arrayAnswers[ indArr ] ;
            let parser    = allParsers[ answerElem.type ] || false ;
            if ( parser==false ){
                throw new Error('ERROR: Answer type "'+answerElem.type+'" is unknown. Answer:: '+JSON.stringify(answerElem)) ;
            }
            //
            // console.log('\n\n ..(0) parseAnswer:: indArr: ',indArr,' type:: ',answerElem.type,' entity: ',JSON.stringify(answerElem) ) ;
            arrayOut.push(
                <div key={indArr} >
                    <div className="waiboc-widget-message-bot">{ parser( answerElem, customStyle, indArr, onClickOpcion, setInputEditable ) }</div>
                    { parseFiles( answerElem, indArr ) }
                    <div className="waiboc-widget-message-bot">{ parseOption( answerElem, customStyle, indArr, onClickOpcion, setInputEditable ) }</div>
                </div>
            ) ;
        }
        //
        return arrayOut ;
    } catch(errPA){
        console.dir(errPA) ;
        throw errPA ;
    }
}