import axios from 'axios';

/**
 * Configuration for REST API
 */

// Configuration for axios
axios.defaults.baseURL = 'https://tribehub-drf.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;

// Axios instances to be used as interceptors
export const axiosReq = axios.create();
export const axiosRes = axios.create();