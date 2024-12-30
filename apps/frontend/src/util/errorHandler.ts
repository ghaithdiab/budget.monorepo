import axios from 'axios';

const handleAxiosError = (error: any):string => {
  if (axios.isAxiosError(error)) {
    if (error.response){
     const status = error.response.status;
     switch (status) {
       case 400: return 'Bad Request: Please check the request data.';
       case 401: return 'Unauthorized: Please login to continue.';
       case 403: return 'Forbidden: You do not have access to this resource.';
       case 404: return 'Not Found: The requested resource could not be found.';
       case 500: return 'Internal Server Error: Something went wrong on our end.';
       case 409: return 'Conflict error: The user already exists.';
       default:  return `Unexpected Error: ${error.response.statusText}`;
     }
   } else {
     return  error.message;
   } 
 } else { 
   return 'An unexpected error occurred. Please try again later.';
 } 
};

export default handleAxiosError;
