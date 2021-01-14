import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {
  Callout,
  Geojson,
  Marker,
  Overlay,
  Polygon,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import RNFS from 'react-native-fs';
import Connection from '../services/connection';
import {useNetInfo} from '@react-native-community/netinfo';

const mapaGeojson = {};
export default class AbrirPropriedade extends React.Component {
  state = {
    id_propriedade: '',
    id_usuario: '',
    talhoes: [],
    error: '',
    centroPropriedade: {
      latitude: -15.415102320112714,
      longitude: -54.818083435998041,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0422,
    },
    mapaPropriedade: {
      'type':'FeatureCollection',
      'name':'default',
      'crs':{
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',,
        },
      },
      'features':[
        {
          'type':'Feature',
          'properties':{
            Name: null,
            description: null,
            gridcode: 1.0,
          },
        },
      ],
    },
  };

  componentDidMount() {
    this.loadMapa();
    this.listarTalhoes();
  }

  replaceAll(str, needle, replacement) {
    return str.split(needle).join(replacement);
  }

  atualizaCoordenadas(dataInfo) {
    const jsonIntel = JSON.parse(this.replaceAll(dataInfo.toString(), "'", "\""));

    if (jsonIntel) {
      this.setState({
        centroPropriedade: {
          latitude: jsonIntel.latitude_centroid,
          longitude: jsonIntel.longitude_centroid,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0422,
        },
      });
    }
  }

  lerArquivo(caminho) {
    const path = RNFS.DocumentDirectoryPath + '/magnafarm/';
    const data = await RNFS.readFile(path + caminho, 'utf8');
    return data;
  }

  loadMapa = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');

    if (!id_propriedade || !id_usuario) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade/usuário, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    const data = lerArquivo(id_usuario + '_prop' + id_propriedade + '_farm_json.txt');

    const geojson = {
      type: 'FeatureCollection',
      name: 'teste',
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
        },
      },
      features: [
        {
          type: 'Feature',
          properties: {
            Name: null,
            description: null,
            gridcode: 1,
          },
          geometry: JSON.parse(data.toString()),
        },
      ],
    };

    this.setState({mapaPropriedade: geojson});

    const dataInfo = lerArquivo(id_usuario + '_prop' + id_propriedade + '_farm_json_intel.txt');
    this.atualizaCoordenadas(dataInfo);
  };

  listarTalhoes = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');

    if (!id_propriedade || !id_usuario) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade/usuário, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    /*const response = await api.post('/arquivo/polyline/talhoes', {
      caminho: id_usuario + '/' + id_propriedade + '/',
    });

    this.setState({talhoes: response.data});*/

    const data = lerArquivo(id_usuario + '_prop' + id_propriedade + '_polyline.txt');
    this.setState({talhoes: JSON.parse(data.toString())});

  };

  setarTalhao = async (id) => {
    await AsyncStorage.setItem('@open_talhao', id.toString());
    this.props.navigation.navigate('AbrirTalhao');
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          region={this.state.centroPropriedade}
          showsMyLocationButton={true}
          showsUserLocation={true}
          mapType={'satellite'}>
          <Geojson //Mapa da propriedade
            geojson={this.state.mapaPropriedade}
            strokeColor="white"
            strokeWidth={2}
            zIndex={2}
          />

          {this.state.talhoes.map((talhao, index) => {
            return (
              <Polygon
                key={index}
                coordinates={talhao.coordenadas}
                strokeColor="red"
                strokeWidth={3}
                zIndex={1}
                tappable={true}
                onPress={() => this.setarTalhao(talhao.talhao)}
              />
            );
          })}
        </MapView>
        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}
      </View>
    );
  }
}


