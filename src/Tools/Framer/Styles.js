import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 2,
    },  
    body: {
        flex: 7,
        backgroundColor: '#f0f0f0',
        padding: 5
    },
    footer: {
        flex: 3,
        backgroundColor: '#f0f0f0',
        padding: 1
    },  
    ratiosContainer: {
        flex: 1,
        flexDirection: 'row'
        // backgroundColor: 'gray',
    },
    borderWidthContainer: {
        flex: 1,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        padding: 5
    },
    ratioButton:{
        flex: 1, 
        borderColor: 'black', 
        borderWidth: 1, 
        margin: 5, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
})