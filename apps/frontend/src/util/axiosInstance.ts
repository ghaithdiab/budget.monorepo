import { BACKEND_URL } from '@/lib/constants';
import axios from 'axios'; 

const axiosInstance = axios.create({ 
baseURL: BACKEND_URL,
headers:{
  'Content-Type': 'application/json'
} 
})




// //Request Interceptor 
// api.interceptors.request.use( config => { 
//   // Add any request modifications here 
//    return config; 
//   }, error => { return Promise.reject(error); } );
   
  
  
//   // Response Interceptor
  //  api.interceptors.response.use( response => response, error =>{
  //   if (axios.isAxiosError(error)) {
  //      if (error.response){
  //       const status = error.response.status;
  //       console.log(status);
  //       switch (status) {
  //         case 400: error.message = 'Bad Request: Please check the request data.'; break;
  //         case 401: error.message = 'Unauthorized: Please login to continue.'; break;
  //         case 403: error.message = 'Forbidden: You do not have access to this resource.'; break;
  //         case 404: error.message = 'Not Found: The requested resource could not be found.'; break;
  //         case 500: error.message = 'Internal Server Error: Something went wrong on our end.'; break;
  //         case 409: error.message = 'conflit'
  //         default: error.message = `Unexpected Error: ${error.response.statusText}`;
  //       }
  //     } else {
  //       error.message = 'Network Error: Please check your internet connection.';
  //     } 
  //   } else { 
  //     error.message = 'An unexpected error occurred. Please try again later.';
  //   } 
  //   return Promise.reject(error); 
  // } );


  
  
export default axiosInstance;