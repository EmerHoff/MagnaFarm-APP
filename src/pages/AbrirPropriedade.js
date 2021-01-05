import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';

import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {Callout, Geojson, Marker, Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
import RNFS from "react-native-fs";

const mapaGeojson = {};
export default class AbrirPropriedade extends React.Component {
  state = {
    id_propriedade: '',
    talhoes: '',
    error: '',
    centroPropriedade: {
      latitude: -15.4251733049364,
      longitude: -54.8167397853051,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0422,
    },
    limitesPropriedade: [
      [-24.8465,-53.3165],
      [-24.8675, -53.30]
    ],
    mapaPropriedade: {
      "type":"FeatureCollection",
      "name":"default",
      "crs":{
          "type":"name",
          "properties":{
            "name":"urn:ogc:def:crs:OGC:1.3:CRS84"
          }
      },
      "features":[
        {
          "type":"Feature",
          "properties":{
              "Name":null,
              "description":null,
              "gridcode":1.0
          },
        }
      ]
    },
  }

  componentDidMount() {
    this.loadMapa();
    this.listarTalhoes();
  }

  saveFile = async (content, name) => {
    const path = RNFS.DocumentDirectoryPath + '/magnafarm/';

    // write the file
    RNFS.writeFile(path + name, content, 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN: ' + name);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  atualizaCoordenadas(geojson) {
    var string = JSON.stringify(geojson);
    var objectValue = JSON.parse(string);
    var coordinates = objectValue['features'][0]['geometry']['coordinates'][0][0][0];

    if (coordinates) {
      this.setState({ centroPropriedade: {
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0422,
        }
      });
      console.log(coordinates);
    }
  }

  loadMapa = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');

    if (!id_propriedade) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    const response = await api.post('/arquivo/geojson', {
      caminho: "./storage/geojson_teste.txt",
    });

    const geojson = response.data;
    this.setState({ mapaPropriedade: geojson });
    this.saveFile(geojson, 'prop_' + id_propriedade + '_mapa.txt');
    //this.atualizaCoordenadas(geojson);
  }

  listarTalhoes = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');

    if (!id_propriedade) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    const response = await api.post('/arquivo/geojson', {
      caminho: "./storage/geojson_teste2.txt",
    });

    const geojson = response.data;
    this.setState({ talhoes: geojson });
  }

  setarTalhao = async (id) => {
    await AsyncStorage.setItem('@open_talhao', id.toString());
    this.props.navigation.navigate('AbrirTalhao');
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={ styles.map }
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          region={this.state.centroPropriedade}
          showsMyLocationButton={true}
          showsUserLocation={true}
          mapType={'satellite'}
        >

        <Geojson //Mapa da propriedade
          geojson={this.state.mapaPropriedade} 
          strokeColor="white"
          fillColor="red"
          strokeWidth={2}
          zIndex={1}
        />

        <Geojson //Mapa da propriedade
          geojson={this.state.talhoes} 
          strokeColor="black"
          fillColor="green"
          strokeWidth={2}
          zIndex={2}
        />

        <Marker
          coordinate={{ latitude: -24.8465, longitude: -53.3165 }}
          title={'Talhão Fundo'}
          description={'Esse talhão esta localizado no fundo'}
          opacity={0.5}
          //image={require('../icone.jpg')}
        />

        </MapView>
        {this.state.error.length !== 0 && (
          <Text style={styles.errorText}>{this.state.error}</Text>
        )}
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
    padding: 0
  },
  listaContainer: {
    padding: 10,
    backgroundColor: '#2e7d42',
    width: '80%',
    height: '60%',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 5,
    marginTop: 850,
  },
  conteudoTela: {
    top: 1000
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
    color: '#000',
    backgroundColor: '#FFF',
    fontSize: 15,
    marginTop: 500,
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
  talhaoContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#656a6e',
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
  },
  talhaoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  talhaoArea: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
    lineHeight: 24,
  },
  botaoVisualizar: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
  },
  botaoText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  }
});