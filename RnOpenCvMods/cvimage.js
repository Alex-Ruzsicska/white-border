/** 01/28/2019
 * OpenCV 3.4.5 minified + Face module ported to react-native
 * https://github.com/adamgf/react-native-opencv3
 *
 * @format
 * @flow
 * @author Adam Freeman, adamgf@gmail.com
 */
 import { NativeModules } from 'react-native';
 import React, {Component} from 'react';
 import { Platform, Image } from 'react-native';
 const  { RNOpencv3 } = NativeModules;
 
 var RNFS = require('react-native-fs')
 
 export class CvImage extends Component {
 
   constructor(props) {
     super(props)
     this.state = { 'destFile' : '' }
   }

   generateDestinationUri(image){
    let uri = image.uri.slice(7);
    let fileExtension = uri.slice(uri.length-4, uri.length);
    uri = uri.slice(0, uri.length-4);
  
    return uri + `(${image.updatesAmount})` + fileExtension;
  }
 
   componentDidMount = () => {
    const assetSource = this.props.source
    let sourceFile = ''
    let srcMat, dstMat

    if(assetSource && assetSource.uri && assetSource.uri.length > 0){
        sourceFile =  Platform.OS === 'ios' ? assetSource.uri : assetSource.uri.slice(7)
    }

    RNOpencv3.Mat().then((res) => {
        dstMat = res
        RNOpencv3.imageToMat(sourceFile).then((res) => {
        srcMat = res
   

            const { cvinvoke } = this.props
            if (cvinvoke) {
            for (let i=0;i < cvinvoke.paramsArr.length;i++) {
                let params = cvinvoke.paramsArr[i]
                for (let j=0;j < Object.keys(params).length;j++) {
                const pnum = 'p' + (j + 1).toString()
                if (params[pnum] && params[pnum] === 'srcMat') {
                    params[pnum] = srcMat
                }
                if (params[pnum] && params[pnum] === 'dstMat') {
                    params[pnum] = dstMat
                }
                }
            }
            RNOpencv3.invokeMethods(cvinvoke)
            }
            
            RNOpencv3.matToImage(dstMat, this.generateDestinationUri(assetSource))
            .then((image) => {
                RNOpencv3.deleteMat(srcMat)
                RNOpencv3.deleteMat(dstMat)
                const { width, height, uri } = image

                if (uri && uri.length > 0) {
                    this.setState({ destFile : uri })
                }
                else {
                    console.error('Error getting image information.')
                }
            })
            .catch((err) => {
                console.error("matToImage: ", err)
            })
        })
        .catch((err) => {
        console.error(err)
        })
        })
        .catch((err) => {
            console.error(err)
        })
   
   }
 
   render() {
     let imageFilePath = this.props.source.uri;
     if (this.state.destFile.length > 0) {
       const prependFilename = Platform.OS === 'ios' ? '' : 'file://'
       imageFilePath = prependFilename + this.state.destFile
     }
     return(
        <Image {...this.props} source={{uri:`${imageFilePath}`}} key={Date.now()}/>
     )
   }
 }