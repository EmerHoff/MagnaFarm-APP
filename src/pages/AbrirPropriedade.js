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
    labels: [],
    error: '',
    centroPropriedade: {
      latitude: -24.415102320112714,
      longitude: -53.818083435998041,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0422,
    },
    mapaPropriedade: {
      'type':'FeatureCollection',
      'name':'default',
      'crs':{
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
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
    this.adicionarLabels();
  }

  replaceAll(str, needle, replacement) {
    return str.split(needle).join(replacement);
  }

  atualizaCoordenadas(dataInfo) {
    const jsonIntel = JSON.parse(this.replaceAll(dataInfo.toString(), "'", "\""));

    if (jsonIntel) {
      this.setState({
        centroPropriedade: {
          latitude: parseFloat(jsonIntel.latitude_centroid),
          longitude: parseFloat(jsonIntel.longitude_centroid),
          latitudeDelta: 0.0352,
          longitudeDelta: 0.0542,
        },
      });
    }
  }

  lerArquivo = async (caminho) => {
    const path = RNFS.DocumentDirectoryPath + '/';
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

    const data = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_farm_json.txt');

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

    const dataInfo = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_farm_json_intel.txt');
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

    const data = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_polyline.txt');
    this.setState({talhoes: JSON.parse(data.toString())});

  };

  setarTalhao = async (id) => {
    await AsyncStorage.setItem('@open_talhao', id);
    console.log('id talhao: ' + id);
    this.props.navigation.navigate('AbrirTalhao');
  };

  adicionarLabels = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');

    const data = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_polyline.txt');
    const talhoes = JSON.parse(data.toString());

    await talhoes.forEach(async (talhao) => {
      const labels = this.state.labels;
      const dataInfo = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_th' + talhao.talhao + '_field_' + talhao.talhao + '_json_intel.txt');
      const jsonIntel = JSON.parse(this.replaceAll(dataInfo.toString(), "'", "\""));

      labels.push({
        nome: talhao.talhao,
        latitude: jsonIntel.latitude_centroid,
        longitude: jsonIntel.longitude_centroid
      });
      this.setState({labels: labels});
    }); 
  }

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

          {this.state.labels.map((label, index) => {
            return (
              <Marker
                key={index}
                coordinate={{ latitude : parseFloat(label.latitude) , longitude : parseFloat(label.longitude)  }}
              >
                <Text note style={{color:"#FFF", fontSize: 10}}>
                  {label.nome}
                </Text>
            </Marker>
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


