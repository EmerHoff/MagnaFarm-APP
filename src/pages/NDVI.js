import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import api from '../services/api';
export default class NDVI extends React.Component {
  state = {
    mapas: [],
    error: '',
    loading: false,
  };

  componentDidMount() {
    this.loadMapas();
  }

  replaceAll(str, needle, replacement) {
    return str.split(needle).join(replacement);
  }

  loadMapas = async () => {
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');
    const id_talhao = await AsyncStorage.getItem('@open_talhao');
    const dataPlantio = await AsyncStorage.getItem('@talhao_dataPlantio');

    const dataInfo = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_th' + id_talhao + '_field_' + id_talhao + '_S2_images.txt');

    const jsonIntel = this.replaceAll(dataInfo.toString(), "{", "");
    const splited = jsonIntel.split('], ');

    var mapasJson = [];

    splited.forEach(async (info) => {
      mapasJson.push({
        data: info.split('\'')[1],
        das: parseInt((new Date(info.split('\'')[1]) - new Date(dataPlantio)) / (1000 * 60 * 60 * 24), 10),
        indice: info.split('\'')[3],
        cor: this.hslToHex(info.split('\'')[3])
      });
    });

    this.setState({mapas: mapasJson.sort((a, b) => parseFloat(a.das) - parseFloat(b.das))});
  }

  abrirNDVI = async (item) => {
    this.setState({loading: true});
    const id_propriedade = await AsyncStorage.getItem('@open_propriedade');
    const id_usuario = await AsyncStorage.getItem('@save_id');
    const id_talhao = await AsyncStorage.getItem('@open_talhao');
    await AsyncStorage.setItem('@ndvi_data', item.data);

    console.log('Sincronizando ' + item.data);
    await this.sincronizarImagensTalhao(id_usuario, id_propriedade, id_talhao, item.data);
    this.setState({loading: false});
    this.props.navigation.navigate('AbrirNDVI');
  }

  lerArquivo = async (caminho) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    const data = await RNFS.readFile(path + caminho, 'utf8');
    return data;
  }

  sincronizarImagensTalhao = async (id_usuario, id_propriedade, id_talhao, dataNDVI) => {
    //Arquivos de NDVI e RGB dos talhoes
    dataNDVI = this.replaceAll(dataNDVI, '-', '');

    if (! await RNFS.exists(RNFS.DocumentDirectoryPath + '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_0001_NDVI.png')) {
      const responseNDVI = await api.post(
        '/arquivo/buscar/ndvi',
        {
          caminho: id_usuario + '/' + id_propriedade + '/' + id_talhao  + '/',
          dateNDVI: dataNDVI + '_NDVI'
        },
      );

      if (responseNDVI.data) {
          RNFS.writeFile(
            RNFS.DocumentDirectoryPath + 
            '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_' + responseNDVI.data.nome,
            responseNDVI.data.data, 
            'base64'
          );

          console.log(RNFS.DocumentDirectoryPath + '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_' + responseNDVI.data.nome);
      }
    }

    if (! await RNFS.exists(RNFS.DocumentDirectoryPath + '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_0001_RGB.png')) {
      const responseRGB = await api.post(
        '/arquivo/buscar/rgb',
        {
          caminho: id_usuario + '/' + id_propriedade + '/' + id_talhao  + '/',
          dateNDVI: dataNDVI + '_NDVI'
        },
      );

      if (responseRGB.data) {
          RNFS.writeFile(
            RNFS.DocumentDirectoryPath + 
            '/' + id_usuario + '_prop' + id_propriedade + '_' + id_talhao + '_' + dataNDVI + '_' + responseRGB.data.nome,
            responseRGB.data.data, 
            'base64'
          );
      }
    }
  }

  hslToHex(indiceValue) {
    var h = parseFloat(indiceValue) * 100;
    var s = 100;
    var l = 42;
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  renderItem = ({item}) => (
    <TouchableWithoutFeedback onPress={ () => this.abrirNDVI(item)}>
      <View style={styles.mapasContainer} backgroundColor={item.cor}>
        <Text style={styles.textItemData}>{item.data}</Text>
        <Text style={styles.textItemDAS}>{item.das} DAS</Text>
        <Text style={styles.textItemIndice}>{item.indice}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Lista de NDVI</Text>
        <View style={styles.listaContainer}>
          <FlatList
            data={this.state.mapas}
            keyExtractor={(item, index) => item.data}
            renderItem={this.renderItem}
          />
        </View>

        {this.state.loading === true && (
          <View style={[styles.loading, styles.overlayLoading]}>
              <ActivityIndicator animating={this.state.loading} size="large" color="#00ff00" />
          </View>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c9c54',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#ebf3e8',
    marginTop: '10%',
    padding: 10,
  },
  textoInicial: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#ebf3e8',
    marginBottom: 40,
    width: '80%',
  },
  botaoProsseguir: {
    width: '80%',
    backgroundColor: '#73cf32',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  botaoText: {
    color: '#ebf3e8',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listaContainer: {
    padding: 10,
    backgroundColor: '#2e7d42',
    width: '80%',
    height: '75%',
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 5,
  },
  mapasContainer: {
    width: 280,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#656a6e',
    borderRadius: 5,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
  },
  textItemData: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#3B3B3B',
    lineHeight: 24,
    flex: 1.5,
    justifyContent: 'flex-start'
  },
  textItemDAS: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#3B3B3B',
    lineHeight: 24,
    flex: 1,
    justifyContent: 'flex-start'
  },
  textItemIndice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#3B3B3B',
    lineHeight: 24,
    flex: 0.5,
    justifyContent: 'flex-end'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLoading: {
    backgroundColor: '#000',
    opacity: 0.5,
  }
});
