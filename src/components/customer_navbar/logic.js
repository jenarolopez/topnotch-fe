import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import deviceType from "../../helpers/DeviceType";
import { useDispatch } from "react-redux";
import { open, close } from "../../redux/feedbackSlice";
import CustomAxios from "../../customer hooks/CustomAxios"
import {useLocation} from 'react-router-dom'
function Logic({ setOpenCart, paws, setPaws, comments, toast, image, groomerPaws, setGroomerPaws }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {pathname} = useLocation()
  const navLinkStyles = ({ isActive }) => {
    return {
      borderBottom: isActive ? "solid 2px gray" : "",
    };
  };

  const handleLogout = () => {
    Cookies.remove("userToken");
    window.location.assign("/customer/login");
  };

  const InfoAndCartClick = () => {
    const currentDevice = deviceType();
    if (currentDevice === "desktop") {
      setOpenCart((prev) => !prev);
    } else {
      navigate(`/customer/cart`);
    }
  };
  const openFeedback = () => {
    dispatch(open());

   
  };
  const closeFeedback = () => {
    dispatch(close());
    if(pathname.includes('/customer/liveStreamChannels/room')) {
      window.location.assign('/customer/liveStreamChannels')
    }
  };
  
  const stars = [1, 2, 3, 4, 5].map((star) => (
    <i className={`fa-solid fa-paw ${paws >= star ? "rated" : ""}`} onClick={() => setPaws(star)}></i>
  ));
  const groomerStars = [1, 2, 3, 4, 5].map((star) => (
    <i className={`fa-solid fa-paw ${groomerPaws >= star ? "rated" : ""}`} onClick={() => setGroomerPaws(star)}></i>
  ));

  const submitFeedback = async () => {
    try {
      if(paws == 0 || !comments || groomerPaws == 0) {
        return toast('fill up the ratings and suggestion to submit your feedback.', {type: 'warning'})
      } 

        let adminId = null
        let appointmentId = null

        if(pathname.includes('/customer/liveStreamChannels/room')){
          const live_data = JSON.parse(window.localStorage.getItem('last_stream_data'))
          adminId = live_data.groomerInfo.adminId
          appointmentId = live_data.roomInfo.appointmentId
        }
        

        const result = await CustomAxios({METHOD:"POST", values: {paws, comments, image, groomerPaws, adminId, appointmentId}, uri:'/api/customer/submitFeedback'})
        const {msg, success} = result; 
        if(!success && msg?.includes('session expired')) {
          window.localStorage.removeItem('last_stream_data');
          return window.location.reload();
        }

        toast('Thank you for your feedback!', {type: 'success'})

        setTimeout(() => {
          window.localStorage.removeItem('last_stream_data');
          dispatch(close())
          if(pathname.includes('/customer/liveStreamChannels/room')) {
            window.location.assign('/customer/liveStreamChannels')
          }
        }, 2500)

        

      } catch (error) {
        console.error(error.message);
    }
  }

  return {
    navLinkStyles,
    handleLogout,
    InfoAndCartClick,
    openFeedback,
    closeFeedback,
    stars,
    submitFeedback,
    groomerStars
  };
}

export default Logic;
