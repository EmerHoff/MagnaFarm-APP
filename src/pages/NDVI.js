import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
export default class NDVI extends React.Component {
  state = {
    mapas: [],
    error: '',
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

    const dataInfo = await this.lerArquivo(id_usuario + '_prop' + id_propriedade + '_th' + id_talhao + '_field_' + id_talhao + '_S2_images.txt');

    const jsonIntel = this.replaceAll(dataInfo.toString(), "{", "");
    const splited = jsonIntel.split('], ');

    var mapasJson = [];

    splited.forEach(async (info) => {
      console.log(info);
      console.log(info.split('\''));
      console.log('--------------------');
      mapasJson.push({
        data: info.split('\'')[1],
        das: '15',
        indice: info.split('\'')[3],
        cor: '#FF5733'
      });
    });

    this.setState({mapas: mapasJson});
  }

  abrirNDVI(item) {
    console.log('Selected Item :',item.data);
    this.props.navigation.navigate('AbrirNDVI');
  }

  lerArquivo = async (caminho) => {
    const path = RNFS.DocumentDirectoryPath + '/';
    const data = await RNFS.readFile(path + caminho, 'utf8');
    return data;
  }

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

        <View>
          <FlatList style={styles.listaContainer}
            data={this.state.mapas}
            keyExtractor={(item, index) => item.data}
            renderItem={this.renderItem}
          />
        </View>

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
    height: '60%',
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
});
