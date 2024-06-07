import axios from "axios";

const dhcAPI = axios.create({
  baseURL:'http://localhost:8000/',
  headers:{
    'Content-Type': 'application/json',
  },
});

dhcAPI.interceptors.request.use((config) => {
  const userString = localStorage.getItem("user");
  if (userString != null) {
    const user = JSON.parse(userString);
    if (user && user.token) { // Verificar si 'user' y 'user.token' son no nulos
      config.headers.Authorization = `Token ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const get = async (endpoint:string) => {
  try {
    const response = await dhcAPI.get(endpoint);
    return response.data;
  } catch (error) {
    formatAxiosError(error)
  }
};

export const post = async (endpoint:string,data:any) => {
  try {
    const response = await dhcAPI.post(endpoint,data);
    return response.data;
  } catch (error) {
    formatAxiosError(error)
  }
}

export const postUpload = async (endpoint:string,data:any) => {
  try {
    const response = await axios.post(endpoint,data,{ headers: {} });
    return response.data;
  } catch (error) {
    formatAxiosError(error)
  }
}

export const put = async (endpoint:string,data:any) => {
  try {
    const response = await dhcAPI.put(endpoint,data);
    return response.data;
  } catch (error) {
    formatAxiosError(error)
  }
}

export const formatAxiosError = (error: any): any =>  {
  if (error.response) {
    // La respuesta fue hecha y el servidor respondió con un código de estado
    // que esta fuera del rango de 2xx
    console.log(error.response.data);
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
    // http.ClientRequest en node.js
    console.log(error.request);
  } else {
    // Algo paso al preparar la petición que lanzo un Error
    console.log('Error', error.message);
  }
}