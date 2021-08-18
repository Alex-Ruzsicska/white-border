import React, {useState, useEffect} from 'react';
import Styles from './Styles';
import { View, Text, Button } from 'react-native';
import { Appbar, TextInput, ToggleButton } from 'react-native-paper';
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

function generateFrame(image, ratio){
  let { width, height } = image;
  if(width && width > 0 && height && height > 0){
    let frameAux = {}; 

    if(width/height >= ratio){
      frameAux.top = ((width/ratio)-height)/2;
      frameAux.bottom = frameAux.top;
      frameAux.left = frameAux.right = 0;
    }
    else{
      frameAux.left = ((height*ratio)-width)/2;
      frameAux.right = frameAux.left;
      frameAux.top = frameAux.bottom = 0;
    }
  
    console.log(frameAux);
    return frameAux;
  }
  return {top:0, bottom:0, right:0, left:0};
}


const Framer = () =>{
  
  const [frame, setFrame] = useState({top: 0, bottom: 0, left: 0, right: 0});
  const [ratio, setRatio] = useState(1)
  const [image, setImage] = useState({uri: ''});
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
        <ToggleButton.Row
          style={{flex:1, backgroundColor: "gray"}}
          onValueChange={(value) => {
            setRatio(value);
            setFrame(generateFrame(image, value));
          }}
          value={ratio}
        >
          {ratios.map((ratio, index)=>(
            <ToggleButton value={ratio} icon="bluetooth" style={{flex:1, height:'100%'}} key={index}/>
          ))}
        </ToggleButton.Row>
      </View>
    </View>
  );
}

export default Framer;