import axios from 'axios';
// import Qs from 'qs';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const REQUEST_TIME_OUT = 60000;

const BASE_URL = `https://dummy.restapiexample.com/api/v1`; //Update your baseUrl here

const client = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIME_OUT,
});

// client.interceptors.request.use(
//   async config => {
//     const requestConfig = config;
//     let token = await AsyncStorage.getItem('Token');
//     let authToken = JSON.parse(token);
//     let myToken = `Bearer ${authToken}`;
//     if (myToken) {
//       requestConfig.headers = {
//         Authorization: myToken,
//         'Content-Type': 'multipart/form-data',
//         // 'application/json',
//       };
//     }
//     requestConfig.paramsSerializer = params => {
//       return Qs.stringify(params, {
//         arrayFormat: 'brackets',
//         encode: false,
//       });
//     };

//     return requestConfig;
//   },
//   err => {
//     return Promise.reject(err);
//   },
// );

export {BASE_URL, client};
