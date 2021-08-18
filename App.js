import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Framer from './src/Tools/Framer';

const App = ()=>{
  return(
   <PaperProvider>
     <Framer></Framer>
   </PaperProvider>
  );
}

export default App;