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
import MapView, {Callout, Geojson, Marker, Overlay, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import RNFS from "react-native-fs";

export default class AbrirTalhao extends React.Component {
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
    talhaoArea: '',
    talhaoCultivo: 'Nenhuma semeadura declarada',
  }

  componentDidMount() {
    this.loadTalhao();
  }

  atualizaCoordenadas(geojson) {
    var string = JSON.stringify(geojson);
    var objectValue = JSON.parse(string);
    var coordinates = objectValue['features'][0]['geometry']['coordinates'][0][0];

    if (coordinates) {
      this.setState({ centroPropriedade: {
          latitude: coordinates[1],
          longitude: coordinates[0],
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0122,
        }
      });
    }
  }

  loadTalhao = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');
    const id_talhao = await AsyncStorage.getItem('@open_talhao');

    if (!id_propriedade || !id_usuario || !id_talhao) {
      this.setState(
        {
          error:
            'Não encontramos o ID do sua propriedade/usuário/talhão, tente sair e entrar novamente dela!',
        },
        () => false,
      );
    }

    this.setState({ id_talhao: id_talhao });

    const response = await api.post('/arquivo/geojson', {
      caminho: id_usuario + "/" + id_propriedade + "/" + id_talhao + "/field_" + id_talhao + "_json.txt",
    });

    const geojson = response.data;
    this.setState({ mapaTalhao: geojson });
    this.atualizaCoordenadas(geojson);
    this.informacoesTalhao(id_usuario + "/" + id_propriedade + "/" + id_talhao + "/field_" + id_talhao + "_json_intel.txt");
  }

  informacoesTalhao = async (caminho) => {
    const response = await api.post('/arquivo/informacoes/talhao', {
      caminho
    });

    this.setState({talhaoArea: response.data.area_ha + ' ha'});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Talhão {this.state.id_talhao}</Text>
        <MapView
          style={ styles.map }
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          region={this.state.centroPropriedade}
          showsMyLocationButton={true}
          showsUserLocation={true}
          mapType={'satellite'}
        >

        <Geojson //Mapa do talhao
          geojson={this.state.mapaTalhao}
          strokeColor="red"
          fillColor="white"
          strokeWidth={2}
          zIndex={1}
        />

        </MapView>

        <TouchableOpacity
          style={styles.botaoAcao}>
          <Text style={styles.botaoText}>Informar Semeadura</Text>
        </TouchableOpacity>
        <Text style={styles.infoArea}>Área: {this.state.talhaoArea}</Text>
        <Text style={styles.infoCultivo}>Cultivo: {this.state.talhaoCultivo}</Text>

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
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '25%',
    padding: 20
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
  botaoAcao: {
    width: '50%',
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
  }
});