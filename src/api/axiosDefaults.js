import axios from "axios";

// Configuration for axios
axios.defaults.baseURL = "https://tribehub-drf.herokuapp.com/";
// axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials = true;