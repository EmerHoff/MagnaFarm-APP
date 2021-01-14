import NetInfo from '@react-native-community/netinfo';

export default class Connection {
  static async isConnected() {
    const response = await NetInfo.fetch('wifi');
    console.log('wifi: ' + response.isConnected);
    return response.isConnected;
  }
}
