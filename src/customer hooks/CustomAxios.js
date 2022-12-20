import axios from 'axios';
import Cookies from "js-cookie";

    const CustomAxios = async ({METHOD=null, values=null, uri=null}) => {
        try {
            if(!METHOD || !uri) {
                throw new Error('Pass the right arguments')
            }
            
            if(METHOD.toUpperCase() == 'GET') {
                const res = await axios.get(`${"https://topnotchbackend.herokuapp.com"}${uri}`, {
                    headers: {
                        userinfo:Cookies.get('userToken')
                    }
                });

                return res.data;
            }
    
            else if (METHOD.toUpperCase() == 'POST' && values) {
                const res = await axios.post(`${"https://topnotchbackend.herokuapp.com"}${uri}`, {values}, {
                    headers: {
                        userinfo:Cookies.get('userToken')
                    }, 
                })

                return res.data;

            }
    
            else if (METHOD.toUpperCase() == 'PATCH' || METHOD.toUpperCase() == 'PUT' && values) {
                const res = await axios.patch(`${"https://topnotchbackend.herokuapp.com"}${uri}`,{values}, {
                    headers: {
                        userinfo:Cookies.get('userToken')
                    }
                })

                return res.data;
            } 
            else if (METHOD.toUpperCase() == 'DELETE') {
                const res = await axios.delete(`${"https://topnotchbackend.herokuapp.com"}${uri}`, {
                    headers: {
                        userinfo:Cookies.get('userToken')
                    }
                })

                return res.data;

            } else {
                throw new Error('METHOD DOESNT EXIST')
            }
        } catch (error) {
            console.error(error.message)
        } finally {
        }
    }

export default CustomAxios