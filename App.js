import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Framer from './src/Tools/Framer';

const theme = {
  ...DefaultTheme,
  roundness: 50,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    accent: 'white',
    text: 'black'
    // surface: '#3498db'
  },
  // dark: true
};

const App = ()=>{
  return(
   <PaperProvider theme={theme}>
     <Framer></Framer>
   </PaperProvider>
  );
}

export default App;