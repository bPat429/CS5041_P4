import { StyleSheet } from "react-native";

// Styles for components; similar to CSS but camelcase instead of using hyphen. Also, omit px and just use number.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100%',
        overflow: 'hidden'
    },
    home_container: {
        backgroundImage: 'linear-gradient(to right bottom, #eda4ce, #ffa6bb, #ffaca7, #ffb795, #ffc588, #efd28d, #dfdd99, #cfe7aa, #c7eec6, #cbf2de, #daf3ee, #f0f4f4)', 
        flex: 1, 
        height: "100%",
        overflow: "hidden"
    },
    content_container: {
        backgroundImage: 'linear-gradient(to right bottom, #eda4ce, #ffa6bb, #ffaca7, #ffb795, #ffc588, #efd28d, #dfdd99, #cfe7aa, #c7eec6, #cbf2de, #daf3ee, #f0f4f4)', 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    logout_container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    username_text: {
        fontSize: 20
    },
    button_accountKey:{
        margin: 20, 
        width: '50%', 
        marginVertical: 10, 
        justifyContent: 'center',
         backgroundColor:'#FD7AC5'
    },
    button_accountPlus:{
        margin: 80, 
        width: '50%', 
        marginVertical: 10, 
        justifyContent: 'center',
         backgroundColor:'#FFED86'
    },
    login_container:{
        margin: 20, 
        width: '50%',
        marginVertical: 10, 
        justifyContent: 'center'
    },
    login_buttonCon:{
        margin: 20, 
        width: '50%',
         marginVertical: 10, 
        justifyContent: 'center'
    }
});

export default styles;