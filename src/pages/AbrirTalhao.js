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

export default class AbrirTalhao extends React.Component {
  state = {
    id_propriedade: '',
    centroTalhao: {
      latitude: -24.8565,
      longitude: -53.31,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0421,
    },
    mapaTalhao: 'https://padilharquitetura.com.br/wp-content/uploads/2019/03/MapaIsodeclividadesFadecitSite-1.jpg',
    limitesTalhao: [
      [-24.8465,-53.3165],
      [-24.8675, -53.30]
    ]
  }

  componentDidMount() {
    this.getTalhao();
  }

  getTalhao = async () => {
    const id_talhao = await AsyncStorage.getItem('@open_talhao');
    const response = await api.get('/talhao/' + id_talhao);
    const { talhao } = response.data.talhao;
  }

  render() {
    return (
      <View style={styles.container}>
          <MapView
            style={ styles.map }
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            initialRegion={this.state.centroTalhao}
            mapType={'satellite'}
          >
            <Overlay
              image={this.state.mapaTalhao}
              bounds={this.state.limitesTalhao}
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
    bottom: '15%',
    padding: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    justifyContent: 'center',
  }
});