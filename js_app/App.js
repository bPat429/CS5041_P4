import { Provider as PaperProvider } from 'react-native-paper';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import styles from './components/Styles';
import TabNavigator from './navigators/TabNavigator';

export default function App() {

  const linking = {
    prefixes: [],
  };

  return (
    // Need to wrap all components in NavgiationContiainer and PaperProvider to allow these libraries to work
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <PaperProvider>
        <View style={styles.container}>
          <TabNavigator></TabNavigator>
        </View>
      </PaperProvider>
    </NavigationContainer>
  );
}
