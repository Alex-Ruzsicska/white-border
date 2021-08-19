import React, {useState, useEffect} from 'react';
import Styles from './Styles';
import { View } from 'react-native';
import { Appbar, TextInput, ToggleButton, IconButton, Text } from 'react-native-paper';
import { CvImage, CvInvoke, Core } from 'react-native-opencv3';
import { launchImageLibrary } from 'react-native-image-picker';



function pickImage(setImage){
  launchImageLibrary({mediaType: 'photo', quality: 1, includeBase64: false}, (response)=>{
    if(response.assets && response.assets.length > 0){
      response.assets[0].updatesAmount = 0;
      setImage(response.assets[0]);
    }
  });
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
  
    console.log(frameAux);
    return frameAux;
  }
  return {top:0, bottom:0, right:0, left:0};
}


const Framer = () =>{
  
  const [ frame, setFrame ] = useState({top: 0, bottom: 0, left: 0, right: 0});
  const [ ratio, setRatio ] = useState(1)
  const [ image, setImage ] = useState({uri: ''});
  const [ multiplier, setMultiplier ] = useState(1);
  const ratios = [1/1, 16/9, 4/5, 5/4];

  const imageComponent = image.uri? (
    <CvInvoke func='copyMakeBorder' params={{"p1":"srcMat","p2":"dstMat", "p3": frame.top, "p4": frame.bottom, "p5": frame.left, "p6": frame.right, "p7": Core.BORDER_CONSTANT}}>
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
      </Appbar.Header>

      <View style={Styles.body}>
        {imageComponent}
      </View>

      <View style={Styles.footer}> 
        <View style={Styles.ratiosContainer}>
          <ToggleButton.Row
            style={{flex:1, padding: 5}}
            onValueChange={(value) => {
              setRatio(value);
              setFrame(generateFrame(image, value, multiplier));
            }}
            value={ratio}
          >
            {ratios.map((ratio, index)=>(
              <ToggleButton value={ratio} icon="bluetooth" style={{flex: 1, height:'100%', borderRadius: 0, backgroundColor: "green", margin: 1}} key={index} color="blue"/>
            ))}
          </ToggleButton.Row>
        </View>

        <View style={Styles.borderWidthContainer}>
          <IconButton 
            icon="minus"
            size={40} 
            onPress={()=>{
              setFrame(generateFrame(image, ratio, multiplier-0.05));  
              setMultiplier(multiplier-0.05);
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
              setFrame(generateFrame(image, ratio, multiplier+0.05));  
              setMultiplier(multiplier+0.05);
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