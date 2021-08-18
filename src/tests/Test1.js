import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';
import { CvImage, CvInvoke, Core, RNCv, ColorConv, CvScalar } from 'react-native-opencv3';


const Test1 = () =>{
  const [value, setValue] = useState(20);
  console.log("reload");
  const image = (
    <CvInvoke func='copyMakeBorder' params={{"p1":"srcMat","p2":"dstMat", "p3": 0, "p4": 0, "p5": value, "p6": value, "p7": Core.BORDER_CONSTANT}}>
          <CvImage 
            key={Date.now()}
            destName={value.toString() + ".jpg"}
            source={require("../../mock/images/vertical1.jpg")}
            style={{resizeMode: 'contain', flex: 1}}
          >
          </CvImage>
    </CvInvoke>
  );

  return(
    <View style={{flex: 1}}>
      <View style={{flex:10, backgroundColor:"red", padding: 5}}>
        {image}
        <Text>{value}</Text>
      </View>
      
      <View style={{flex:2, flexDirection:"row"}}>
        <View style={{flex:1}}>
          <Button title="Sum" onPress={()=>{setValue(value+100)}}></Button>
        </View>
        <View style={{flex:1}}>
          <Button title="Subtract" onPress={()=>{setValue(value-100)}}></Button>
        </View>
      </View>

    </View>
  );
}

export default Test1;