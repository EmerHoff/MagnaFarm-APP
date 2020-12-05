import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {Overlay, PROVIDER_GOOGLE} from 'react-native-maps';

export default class AbrirPropriedade extends React.Component {
  state = {
    id_propriedade: '',
    centroPropriedade: {
      latitude: -24.8565,
      longitude: -53.31,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0421,
    },
    mapaPropriedade: 'https://padilharquitetura.com.br/wp-content/uploads/2019/03/MapaIsodeclividadesFadecitSite-1.jpg',
    limitesPropriedade: [
      [-24.8465,-53.3165],
      [-24.8675, -53.30]
    ]
  }

  componentDidMount() {
    this.getPropriedade();
  }

  getPropriedade = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    console.log(id_propriedade);
    console.log('get id');
  }

  listarTalhoes = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const response = await api.get('/talhao/listar/' + id_propriedade);

    const { talhoes } = response.data.talhoes;
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={ styles.map }
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          initialRegion={this.state.centroPropriedade}
          mapType={'satellite'}
        >
        <Overlay
          image={this.state.mapaPropriedade}
          bounds={this.state.limitesPropriedade}
        />
        </MapView>
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapaSquare: {
    padding: 20
  },
  menuText: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#194314',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#ebf3e8',
  },
  forgot: {
    color: '#ebf3e8',
    padding: 10,
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#ce2029',
    fontSize: 13,
    marginTop: 15,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: -20,
    width: '80%',
  },
});