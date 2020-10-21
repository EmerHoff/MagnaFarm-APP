import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './pages/login';
import Inicio from './pages/inicio';

const Stack = createStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Inicio" component={Inicio} options={{ headerLeft: null, headerTitleAlign: "center" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
