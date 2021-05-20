import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:6565',
});

export default http;
