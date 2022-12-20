import React from "react";
import {
  AppointmentInfoContainer,
  Info,
  InfoRow,
  UpdateBtn,
} from "./components";

import FormateDateLocal from "../../helpers/FormateDateLocal";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Logic from "./logic";
import { ToastContainer, toast } from "react-toastify";
import {useLocation} from 'react-router-dom';
import ConfirmModal from "../modals/admin_modals/confirm/ConfirmModal";
import InformationModal from "../modals/admin_modals/information/InformationModal";

function AppointmentInfo({ data, setData, setLoading }) {
  const { appointment, live_stream_data, customer, admin} = data;

  const { id } = useParams();
  const {pathname} = useLocation()
  const { updateAppointment, completeSchedule, deleteAppointment, updateScheduleByCustomer } = Logic({ appointment, id, setData, toast, setLoading, customer, live_stream_data});

  let [formattedDateNTime, setFormattedDateNTime] = useState(null);
  const [toggleChange, setToggleChange] = useState(false);

  const [openItem, setOpenItem] = useState({
    isOpen: false,
    response: false
  })

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    response: false
  })

  const [returnPolicy, setReturnPolicy] = useState({
    isOpen: false,
    response: false
  })

  const [body, setBody] = useState({
    text: '',
    value: '',
  })

  const [reason, setReason] = useState('')

  useEffect(()=>{
    if(openItem.response) {
      updateAppointment({
        status: body.value,
        reason
      })
    }
  },[openItem.response])


  const confirmAppointment = (response) => {
    setOpenItem({
      isOpen: true,
      response: false
    })
    setBody({
      text: response == 'rejected' ? 'Are you sure you want to CANCEL this appointment?' : 'Are you sure you want to APPROVE this appointment?',
      value: response
    })
  }

const showReturnPolicy = () => {
  setReturnPolicy({
    isOpen: true,
    response: false
  })
}

  

  useEffect(() => {
    setFormattedDateNTime(FormateDateLocal(`${appointment?.date_n_time}`));
  }, []);

  useEffect(()=>{
    if(pathname.includes('customer')){
      if(appointment?.status == 'rejected'){
        setRejectModal({
          isOpen:true,
          response: ''
        })
      }
    }
  },[appointment])


  useEffect(() => {
    setFormattedDateNTime(`${appointment?.date_n_time.replace("T", " ")}`);
  }, [appointment?.date_n_time]);

  return (
    <AppointmentInfoContainer>
      {
        openItem.isOpen && <ConfirmModal openItem={openItem} setOpenItem={setOpenItem} body={body.text} inputLength={reason.trim()} 
        input={
          body.value == 'rejected' ? <textarea onChange={(e)=>{setReason(e.target.value.trim())}} placeholder="Why do you want to cancel this appointment?"/> : false 
        }
        />
      }
      {
        rejectModal.isOpen && <InformationModal body={appointment.reason} title={"Reason for rejection"} openItem={rejectModal} setOpenItem={setRejectModal}/>
      } 
      {
        returnPolicy.isOpen && <InformationModal  title={"RETURN AND EXCHANGE POLICY"} body={""} openItem={returnPolicy} setOpenItem={setReturnPolicy} 
          customButton={<button className="complete"  onClick={() => {
            setReturnPolicy({
              isOpen: false,
              response: false
            })
            confirmAppointment('rejected')
          }}>
          Okay
        </button>}/>
      }
      <h2>Appointment Information</h2>
      <ToastContainer autoClose={1500} />
      {appointment?.status === "pending" && (
        <UpdateBtn>
          <i
            className={`editBtn ${toggleChange ? "fa-solid fa-floppy-disk" : "fa-solid fa-pencil"
              }`}
            onClick={() => setToggleChange((prev) => !prev)}
          ></i>
        </UpdateBtn>
      )}

      <InfoRow>
        <Info>
          <h4>Appointment type</h4>
          <span>{appointment?.appointment_type}</span>
        </Info>
      </InfoRow>

      

      <InfoRow>
        <Info>
          <h4>Date n Time </h4>

          {toggleChange ? (
            <input
              type={"datetime-local"}
              value={formattedDateNTime}
              min={`${FormateDateLocal(new Date().toISOString())}`}
              onChange={(e) =>
                setData((prev) => {
                  const time = e.target.value.split('T')[1];

                  if(time < '08:00' || time > '19:00') {
                    toast('invalid time, we operate only starting 08:00 am until 07:00 pm', {type:"info"})
                    return prev;
                  }

                  return {...prev,
                  appointment: {
                    ...prev.appointment,
                    date_n_time: e.target.value,
                  },
                }
                }
                )
              }
            />
          ) : (
            <span>
              {new Date(formattedDateNTime).toDateString()} at{" "}
              {new Date(formattedDateNTime).toLocaleTimeString()} &nbsp;{" "}
            </span>
          )}
        </Info>
      </InfoRow>
      
      <InfoRow>
        <Info>
          <h4>Groomer</h4>
          <span>{admin?.firstname || '--'} {admin?.lastname || '--'}</span>
        </Info>
      </InfoRow>

      <InfoRow>
        <Info>
          <h4>Additional details</h4>
          <label>{appointment?.additional_details}</label>
        </Info>
      </InfoRow>

      <InfoRow>
        <Info status={`${appointment?.status}`}>
          <h4>Status</h4>
          <p>{appointment?.status}</p>
        </Info>
      </InfoRow>

      {appointment?.status == "rejected" && <InfoRow>
        <Info status={`${appointment?.status}`}>
          <h4>Reason for rejection</h4>
          <p>{appointment?.reason}</p>
        </Info>
      </InfoRow>}


      {
       appointment?.status === "completed" && 
       appointment?.appointment_type === "grooming" && 
       <>
        <InfoRow>
          <Info>
            <h2>Appointment summary</h2>
          </Info>
        </InfoRow>
        <InfoRow>
          <Info>
            <h4>Time of the event</h4>
            <label>
            {live_stream_data?.start_time} - {live_stream_data?.end_time}</label>
          </Info>
        </InfoRow>
        <InfoRow>
          <Info>
            <h4>Record of the stream</h4>
            {
              live_stream_data?.video ? <video src={live_stream_data?.video} controls></video> : <label>Video record stream not available</label>
            }
          </Info>
        </InfoRow>
        </>
      }

      { !pathname?.includes("/customer/schedules/") && appointment?.status === "pending" && (
        <InfoRow style={{ justifyContent: "center" }}>
          <button className="reject" onClick={() => confirmAppointment('rejected')}>Re-schedule</button>
          <button className="approve" onClick={() => confirmAppointment('approved')}>
            Approve
          </button>
        </InfoRow>
      )}

      {
        !pathname?.includes("/customer/schedules/") && appointment?.status &&
        appointment?.status !== "pending" &&
        appointment?.status !== "rejected" &&
        appointment?.status !== "completed" &&
        appointment?.status !== "cancelled" &&
        (
          <InfoRow style={{ justifyContent: "center" }}>
            <button className="complete" onClick={completeSchedule}>
              Mark as completed
            </button>
          </InfoRow>
        )}

        {
            !pathname?.includes("/customer/schedules/") && appointment?.status === 'completed' &&
            (<InfoRow style={{ justifyContent: "center" }}>
            <button className="reject" onClick={deleteAppointment}>delete</button>
          </InfoRow>)
        }

        {
            appointment?.status === 'rejected' &&
            (<InfoRow style={{ justifyContent: "center" }}>
            <button className="reject" onClick={deleteAppointment}>delete</button>
          </InfoRow>)
        }

        {
            !pathname?.includes("/customer/schedules/") && appointment?.status === 'cancelled' &&
            (<InfoRow style={{ justifyContent: "center" }}>
            <button className="reject" onClick={deleteAppointment}>delete</button>
          </InfoRow>)
        }

        
        { pathname?.includes("/customer/schedules/") && appointment?.status === "pending" && (
        <InfoRow style={{ justifyContent: "center" }}>
          <button className="reject" onClick={() => {
            confirmAppointment('rejected')
          }}>Cancel</button>
          <button className="approve" onClick={updateScheduleByCustomer} >
            Update
          </button>
        </InfoRow>
      )}

    </AppointmentInfoContainer>
  );
}

export default AppointmentInfo;
