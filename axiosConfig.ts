import axios from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("jwt");

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const axiosConfig = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL + '/api'
});

export default axiosConfig