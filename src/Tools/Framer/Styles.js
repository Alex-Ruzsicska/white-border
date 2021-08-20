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
        // backgroundColor: 'gray',
    },
    borderWidthContainer: {
        flex: 1,
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        padding: 5
    }
})