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

export default class AbrirNDVI extends React.Component {
  state = {
    error: '',
    id_talhao: '',
    centroPropriedade: {
      latitude: -15.415102320112714,
      longitude: -54.818083435998041,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0422,
    },
    mapaTalhao: {
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
    nomeTalhao: '',
    dataNDVI: '30-01-2021',
    boundsTalhao: [
      [0, 0],
      [0, 0]
    ],
    imagemOverlay: '',
    typeMap: 'NDVI',
  };

  componentDidMount() {
    this.loadTalhao();
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
          latitudeDelta: 0.00822,
          longitudeDelta: 0.0202,
        },
      });
    }
  }

  loadTalhao = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');
    const id_talhao = await AsyncStorage.getItem('@open_talhao');
    const dataNDVI = await AsyncStorage.getItem('@ndvi_data');

    this.imagemTalhao(id_usuario, id_propriedade, id_talhao, dataNDVI);

    this.setState({dataNDVI: dataNDVI.split('-')[2] + '-' + dataNDVI.split('-')[1] + '-' + dataNDVI.split('-')[0]});

    if (!id_propriedade || !id_usuario || !id_talhao) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade/usuário/talhão, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    this.setState({id_talhao: id_talhao});

    const data = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_th' + id_talhao + '_field_' + id_talhao + '_json.txt');

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

    this.setState({mapaTalhao: geojson});

    const dataInfo = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_th' + id_talhao + '_field_' + id_talhao + '_json_intel.txt');
    const formated = await this.replaceFieldInfo(dataInfo);
    this.atualizaCoordenadas(formated);
    this.informacoesTalhao(formated);
  };

  imagemTalhao = async (id_usuario, id_propriedade, id_talhao, dataNDVI) => {
    dataNDVI = this.replaceAll(dataNDVI, '-', '');
    this.setState({imagemOverlay: 'file://' + RNFS.DocumentDirectoryPath + '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_' + '0001_NDVI.png'});
  }

  alternarMapas = async () => {
    if (this.state.typeMap === 'NDVI') {
      this.setState({typeMap: 'RGB'});
      this.setState({imagemOverlay: this.state.imagemOverlay.replace('NDVI.png', 'RGB.png')});
    } else {
      this.setState({typeMap: 'NDVI'});
      this.setState({imagemOverlay: this.state.imagemOverlay.replace('RGB.png', 'NDVI.png')});
    }
  }

  informacoesTalhao = async (dataInfo) => {
    const jsonIntel = JSON.parse(this.replaceAll(dataInfo.toString(), "'", "\""));
    jsonIntel.farm_name = this.replaceAll(jsonIntel.farm_name, 'Talh�o', 'Talhão');
    this.setState({nomeTalhao: jsonIntel.farm_name});

    //Bounds
    this.setState({boundsTalhao: [
      [parseFloat(jsonIntel.corners_map[3]), parseFloat(jsonIntel.corners_map[0])],
      [parseFloat(jsonIntel.corners_map[1]), parseFloat(jsonIntel.corners_map[2])]
    ]});
  };

  replaceFieldInfo = async (value) => {
    if (value.includes('\'S2_tile\': "[') && value.includes(']",')) {
        const firstPart = value.split('\'S2_tile\': "[')[0];
        const secondPart = value.split('\'S2_tile\': "[')[1].split(']",')[1];

        value = firstPart + secondPart;
    }

    if (value.includes('\'corners_map\': [')) {
        const firstPart = value.split('\'corners_map\': [')[0];
        const corners = value.split('\'corners_map\': [')[1].split(']')[0];
        const secondPart = value.split('\'corners_map\': [')[1].split(']')[1];

        value = firstPart + '\"corners_map\": [\"' + this.replaceAll(corners.toString(), ', ', '\", "') + '\"]' + secondPart;
    }

    return value;
  }

  lerArquivo = async (caminho) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    const data = await RNFS.readFile(path + caminho, 'utf8');
    return data;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>{this.state.nomeTalhao}</Text>
        <Text style={styles.data}>{this.state.dataNDVI}</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          region={this.state.centroPropriedade}
          showsMyLocationButton={true}
          showsUserLocation={true}
          mapType={'satellite'}>
          
          <Overlay
            image={{uri: this.state.imagemOverlay}}
            bounds={this.state.boundsTalhao}
          />
        </MapView>

        <TouchableOpacity style={styles.botaoAcao}>
          <Text style={styles.botaoText} 
            onPress={this.alternarMapas}>Alternar NDVI/RGB</Text>
        </TouchableOpacity>

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
    top: '14%',
    left: '5%',
    right: '5%',
    bottom: '25%',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    position: 'absolute',
    top: '2%',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  data: {
    position: 'absolute',
    top: '9%',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  botaoAcao: {
    width: '40%',
    backgroundColor: '#73cf32',
    borderRadius: 5,
    height: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '10%',
    position: 'absolute',
    top: '72%',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ebf3e8',
  },
  infoTitulo: {
    position: 'absolute',
    top: '85%',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#ebf3e8',
  },
  botaoText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: {
    position: 'absolute',
    top: '85%',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  infoCultivo: {
    position: 'absolute',
    top: '88%',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  infoDataPlantio: {
    position: 'absolute',
    top: '91%',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#ebf3e8',
    marginBottom: 40,
  },
  infoDiasPlantio: {
    position: 'absolute',
    top: '94%',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#ebf3e8',
    marginBottom: 40,
  },
});
