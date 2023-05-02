import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { IconButton } from "react-native-paper";

// import Game from '../screens/Game';
import Highscores from "../screens/Highscores";

import { View } from "react-native";
import styles from "../components/Styles";



// Create the Tab Navigator component
const Tab = createBottomTabNavigator();

export default function TabNavigator() {

    return (
        <View style={styles.container}>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Game') {
                        iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
                    } else if (route.name === 'Highscores') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    }
                    return <IconButton icon={iconName} size={size} iconColor={color} />;
                },
            })}  
        >
            <Tab.Screen name="Highscores" component={Highscores} />
            <Tab.Screen name="Game" component={Highscores} />
        </Tab.Navigator>
        </View>
    )
}