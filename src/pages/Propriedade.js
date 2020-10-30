import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class Propriedade extends React.Component {
    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.logo}>Propriedades</Text>
            
            <View style={styles.listaContainer}>
              <View style={styles.propriedadeContainer}>
                <Text style={styles.propriedadeNome}>Fazenda Piquirizinho</Text>
                <Text style={styles.propriedadeArea}>Área: 34,7 hectares</Text>
                <Text style={styles.propriedadeArea}>Comunidade Barreiro, Lote 10</Text>
              </View>

              <View style={styles.propriedadeContainer}>
                <Text style={styles.propriedadeNome}>Fazenda Cachoeira</Text>
                <Text style={styles.propriedadeArea}>Distrito Rio Verde</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.botaoAdicionar}
              onPress={() => {
                this.props.navigation.navigate('NovaPropriedade');
              }}>
              <Text style={styles.botaoText}>Adicionar Propriedade</Text>
            </TouchableOpacity>
            
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
      marginBottom: 40,
      padding: 10,
    },
    botaoAdicionar: {
      width: '80%',
      backgroundColor: '#73cf32',
      borderRadius: 5,
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
      borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 5,
    },
    propriedadeContainer: {
      width: '100%',
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#656a6e',
      borderRadius: 5,
      padding: 20,
      marginBottom: 10,
    },
    propriedadeNome: {
      fontSize: 18,
      fontWeight: "bold",
      color: '#333'
    },
    propriedadeArea: {
      fontSize: 16,
      marginTop: 5,
      color: '#666',
      lineHeight: 24,
    },
    botaoEditar: {
      height: 30,
      width: '50%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#333',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });  