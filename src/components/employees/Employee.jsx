import React from "react";
import { EmployeeContainer } from "./components";
import CustomAxios from "../../customer hooks/CustomAxios";
import { useState } from "react";

function Employee({ data }) {
  const [isPinned, setIsPinned] = useState(Boolean(data.pin));
  const pinEmployee = () => {
      try {
        const res = CustomAxios({
          uri: `/api/admin/pinEmployee/${data.id}`,
          METHOD: "PATCH",
          values:!Boolean(data.pin)
        });
  
        setIsPinned((prev) => !prev);
      } catch (error) {
        console.error(error);
      }
  };

  const averageRating =  data.average_rating ? parseFloat(data.average_rating).toFixed(2) : 0
  const employeeRating = data.total_score ? parseFloat(data.total_score).toFixed(2) : 0

  return (
    <EmployeeContainer>
      <td>
        <img src={data.profile_image_url} alt="" />
      </td>
      <td>
        {data.firstname} {data.lastname}
      </td>
    
      <td>
        <div>
          <span>
            Appointment last month:{" "}
            <strong>{data.total_appointments_completed}</strong>{" "}
          </span>
          <span>
            Average Paws <i className={`fa-solid fa-paw rated`} ></i> :{" "}
            <strong>{averageRating} </strong>{" "}
          </span>
          <span>
            Employee Rating:{" "}
            <strong>{employeeRating}</strong>{" "}
          </span>
        </div>
      </td>
      <td>
        <i
          className="fa-solid fa-award"
          // onClick={pinEmployee}
          style={{ color: isPinned ? "rgb(255,151,0)" : "black" }}
        ></i>
      </td>
    </EmployeeContainer>
  );
}

export default Employee;
