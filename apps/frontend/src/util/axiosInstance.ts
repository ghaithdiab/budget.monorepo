import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios'; 

const axiosInstance = axios.create({ 
baseURL: BACKEND_URL,
headers:{
  'Content-Type': 'application/json'
} 
})

  
export default axiosInstance;