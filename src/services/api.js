import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://magna-backend.herokuapp.com',
  //baseURL: 'http://172.16.107.4:3333',
  baseURL: 'https://magnafarmapp.loca.lt',
});

export default api;
