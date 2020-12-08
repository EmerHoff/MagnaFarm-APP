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
import MapView, {Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
export default class AbrirPropriedade extends React.Component {
  state = {
    id_propriedade: '',
    talhoes: [],
    error: '',
    centroPropriedade: {
      latitude: -24.8565,
      longitude: -53.31,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0422,
    },
    mapaPropriedade: 'https://padilharquitetura.com.br/wp-content/uploads/2019/03/MapaIsodeclividadesFadecitSite-1.jpg',
    limitesPropriedade: [
      [-24.8465,-53.3165],
      [-24.8675, -53.30]
    ]
  }

  componentDidMount() {
    //this.loadMapa();
    this.listarTalhoes();
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

    const response = await api.get('/mapa/propriedade/' + id_propriedade);
    const { latitude, longitude, latitudeDelta, longitudeDelta, enderecoMapa } = response.data;

    this.state.centroPropriedade.latitude = latitude;
    this.state.centroPropriedade.latitude = longitude;
    this.state.mapaPropriedade = enderecoMapa;
    this.state.limitesPropriedade = [[], []];
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

    const response = await api.get('/talhao/listar/' + id_propriedade);

    const { talhoes } = response.data;
    this.setState({talhoes});
  }

  setarTalhao = async (id) => {
    await AsyncStorage.setItem('@open_talhao', id.toString());
    this.props.navigation.navigate('AbrirTalhao');
  }

  renderItem = ({item}) => (
    
    <View style={styles.talhaoContainer}>
      <Text style={styles.talhaoNome}>{item.nome}</Text>
      <Text style={styles.talhaoArea}>Área: {item.area.toString()} hectares</Text>
      <TouchableOpacity
        style={styles.botaoVisualizar}
        onPress={() => {
          this.setarTalhao(item.id)
        }}>
        <Text style={styles.botaoText}>Visualizar</Text>
      </TouchableOpacity>
    </View>
  );

  /*
          <View style={styles.listaContainer}>
            <FlatList
              data={this.state.talhoes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
          </View>
          {this.state.error.length !== 0 && (
            <Text style={styles.errorText}>{this.state.error}</Text>
          )}
  */

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
        <View style={styles.listaContainer}>
            <FlatList
              data={this.state.talhoes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={this.renderItem}
            />
        </View>
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
    top: 10,
    left: 10,
    right: 10,
    bottom: '25%',
    padding: 20
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