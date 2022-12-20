import React from "react";
import { useState, useEffect } from "react";
import Employee from "../../../components/employees/Employee";
import { EmployeesContainer, EmployeeList, Header } from "./components";
import CustomAxios from "../../../customer hooks/CustomAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Employees() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [month, setMonth] = useState("All");
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log(month,'12312322')
        const res = await CustomAxios({
          METHOD: "GET",
          uri: `/api/public/getComputedEmployeeOfTheMonth/${month}`,
        });
        console.log(res,'123')
        setEmployeeList(res.data);
        setLoading(false);
      } catch (error) {
        console.error("error here", error.message);
      }
    })();
  }, [refetch]);

  useEffect(() => {
    (async() => {
      
    })()
  }, [month])

  const display = async () => {
    try {
      if(month === -1 || !Boolean(month)) {
        return;
      }
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("error here", error.message);
    }
  };

  if (!Boolean(currentUser?.super)) {
    return navigate(-1);
  }

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <EmployeesContainer>
      <h1>Employee List</h1>

      <div className="month">
        {" "}
        <label htmlFor=""> Select month to display: </label>
        <select name="" id="" onChange={(e) => setMonth(e.target.value)}>
          <option value={"All"}>month</option>
          {labels.map((month, index) => (
            <option value={index}>
              {month}
            </option>
          ))}
        </select>
        <button onClick={display}>Select</button>
      </div>

      <EmployeeList>
        {loading ? (
          <h1>loading...</h1>
        ) : (
          employeeList.length > 0 &&
          employeeList?.map((employee) => <Employee data={employee} />)
        )}
      </EmployeeList>
    </EmployeesContainer>
  );
}

export default Employees;
