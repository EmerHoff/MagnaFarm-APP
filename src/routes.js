import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Cadastro from './pages/Cadastro';
import BemVindo from './pages/BemVindo';
import Propriedade from './pages/Propriedade';
import NovaPropriedade from './pages/NovaPropriedade';
import AbrirPropriedade from './pages/AbrirPropriedade';
import AbrirTalhao from './pages/AbrirTalhao';

const Stack = createStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BemVindo"
          component={BemVindo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{
            title: 'Início',
            headerLeft: null,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerStyle: {
              backgroundColor: '#2f703f',
            },
            headerTintColor: '#FFF',
          }}
        />
        <Stack.Screen
          name="Propriedade"
          component={Propriedade}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NovaPropriedade"
          component={NovaPropriedade}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AbrirPropriedade"
          component={AbrirPropriedade}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AbrirTalhao"
          component={AbrirTalhao}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
