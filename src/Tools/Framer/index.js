import React, {useState, useEffect} from 'react';
import Styles from './Styles';
import { View } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import { Appbar, IconButton, Text, Button } from 'react-native-paper';
import { CvImage, CvInvoke, Core, CvScalar } from 'react-native-opencv3';
import { launchImageLibrary } from 'react-native-image-picker';



function pickImage(setImage){
  launchImageLibrary({mediaType: 'photo', quality: 1, includeBase64: false}, (response)=>{
    if(response.assets && response.assets.length > 0){
      response.assets[0].updatesAmount = 0;
      setImage(response.assets[0]);
    }
  });
}

async function saveImage(uri){
  await CameraRoll.saveToCameraRoll(uri).then(()=>{
    console.log("Image saved.");
  })
  .catch((error)=>{
    console.log(error);
  })
}

function generateFrame(image, ratio, multiplier){
  let { width, height } = image;
  if(width && width > 0 && height && height > 0){
    let frameAux = {}; 
    let finalHeight, finalWidth;

    if(width/height >= ratio){
      finalHeight = (width/ratio) * multiplier;
      finalWidth = width * multiplier;
    }
    else{
      finalWidth = (height*ratio) * multiplier;
      finalHeight = height * multiplier;
    }

    frameAux.top = frameAux.bottom = (finalHeight-height)/2;
    frameAux.left = frameAux.right = (finalWidth-width)/2;
  
    return frameAux;
  }
  return {top:0, bottom:0, right:0, left:0};
}


const Framer = () =>{
  
  const [ frame, setFrame ] = useState({top: 0, bottom: 0, left: 0, right: 0});
  const [ ratio, setRatio ] = useState(1)
  const [ image, setImage ] = useState({uri: ''});
  const [ multiplier, setMultiplier ] = useState(1);
  const ratios = [
    {value: 1/1, name:"1:1"}, 
    {value:16/9, name:"16:9"}, 
    {value: 4/5, name:"4:5"}, 
    {value: 5/4, name:"5:4"}
  ];

  const imageComponent = image.uri? (
    <CvInvoke func='copyMakeBorder' params={{"p1":"srcMat","p2":"dstMat", "p3": frame.top, "p4": frame.bottom, "p5": frame.left, "p6": frame.right, "p7": Core.BORDER_CONSTANT, "p8": new CvScalar(255,255,255)}}>
          <CvImage 
            source={image}
            key={Date.now()}
            style={{resizeMode: 'contain', flex: 1}}
          >
          </CvImage>
    </CvInvoke>

  ) : (<></>);

  useEffect(()=>{
    let imageAux = image;
    imageAux.updatesAmount++;
    setImage(imageAux);
  }, [frame]);


  return(
    
    <View style={Styles.container}>

      <Appbar.Header>
        <Appbar.Action
          icon="image-plus"
          onPress={()=>{pickImage(setImage)}}
        />
        <Appbar.Content title="Framer"/>
        <Appbar.Action
          icon="content-save"
          onPress={async ()=>{await saveImage(image.uri)}}
        />
      </Appbar.Header>

      <View style={Styles.body}>
        {imageComponent}
      </View>

      <View style={Styles.footer}> 
        <View style={Styles.ratiosContainer}>
          {
            ratios.map((r, index)=>(
              <Button 
                key={index}
                mode="contained"
                color= {ratio == r.value? "black":"white"}
                style={Styles.ratioButton}
                
                onPress={()=>{
                  setFrame(generateFrame(image, r.value, multiplier));
                  setRatio(r.value);
                }}
              >
                {r.name}
              </Button>
            ))
          }
        </View>

        <View style={Styles.borderWidthContainer}>
          <IconButton 
            icon="minus"
            size={40} 
            onPress={()=>{
              let multiplierAux = (multiplier-0.05) > 1? (multiplier-0.05) : 1;
              setFrame(generateFrame(image, ratio, multiplierAux));  
              setMultiplier(multiplierAux);
            }}
            style={{margin: 5, flex: 2}}
          >
          </IconButton>
          <View style={{flex: 8, alignItems: 'center', justifyContent: 'center'}}>
            <Text>{multiplier.toFixed(2)}</Text>
            <Text>Margin width</Text>
          </View>
          <IconButton 
            icon="plus"
            size={40}
            onPress={()=>{
              let multiplierAux = multiplier+0.05;
              setFrame(generateFrame(image, ratio, multiplierAux));  
              setMultiplier(multiplierAux);
            }}
            style={{flex: 2, margin: 5 }}
          >
          </IconButton>
        </View>

      </View>
    </View>
  );
}

export default Framer;