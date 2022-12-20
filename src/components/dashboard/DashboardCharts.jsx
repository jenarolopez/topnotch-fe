import React from "react";
import {
  DashboardChartsContainer,
  MonthlySalesChartsContainer,
  FeedbackList,
  SalesAndProductsData,
  DataContainer
} from "./components";

import { Line, Bar, Pie, Doughnut, Chart } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  LineController,
  BarController,
} from "chart.js";
import { useEffect } from "react";
import CustomAxios from "../../customer hooks/CustomAxios";
import { useState } from "react";
import DataInformation from "./DataInformation";
import Feedbackdata from "./Feedbackdata";
import Feedback from "./Feedback";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LineController,
  BarController
);

const salesChartOption = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      align: "center",
      fontSize: 50,
      color: "black",
    },
  },
  animations: {
    tension: {
      duration: 1000,
      easing: "linear",
      from: 0,
      to: 1,
      loop: true,
    },
  },
  scales: {
    y: {
      // defining min and max so hiding the dataset does not change scale range
      min: 0,
    },
  },
  maintainAspectRatio: false,
};



function DashboardCharts({setOpenFeedbackModal}) {

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

  // const [salesData, setSalesData] = useState([]);
  // const [transactionsData, setTransactionsData] = useState([]);

  // const [overAllSales, setOverAllSales] = useState(0);
  // const [totalSalesToday, setTotalSalesToday] = useState(0);
  // const [totalNumberOfAllTransactions, setTotalNumberOfAllTransactions] = useState(0)

  const [salesData, setSalesData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [cancelledTransactionsData, setCancelledTransactionsData] = useState([]);
  const [overAllSales, setOverAllSales] = useState(0);
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [totalNumberOfAllTransactions, setTotalNumberOfAllTransactions] =
    useState(0);
    const [totalNumberOfAllCancelledTransactions, setTotalNumberOfAllCancelledTransactions] =
    useState(0);
  useEffect(() => {
    (async () => {
      const result = await CustomAxios({ METHOD: "GET", uri: "/api/admin/dashboard" });
      const salesArr = new Array(12);
      const monthlyTransactions = new Array(12);
      const monthlyCancelledTransactions = new Array(12);
      const { data, success, msg } = result;
      const 
      { monthlySales, 
        overAllSales, 
        totalSalesToday, 
        totalNumberOfAllTransactions, 
        totalTransactionsPerMonth,
        totalCancelledTransactionsPerMonth,
        totalCancelledTransactions,
       } = data;
      if (!success && msg?.includes("session expired")) {
        return window.location.reload();
      }

      setTotalNumberOfAllCancelledTransactions(totalCancelledTransactions)
      setOverAllSales(overAllSales);
      setTotalSalesToday(totalSalesToday);
      setTotalNumberOfAllTransactions(totalNumberOfAllTransactions);

      for (const sale in monthlySales) {
        salesArr[sale] = monthlySales[sale];
      }
      for (const transaction in totalTransactionsPerMonth) {
        monthlyTransactions[transaction] = totalTransactionsPerMonth[transaction];
      }
      for (const transaction in totalCancelledTransactionsPerMonth) {
        monthlyCancelledTransactions[transaction] = totalCancelledTransactionsPerMonth[transaction];
      }
      setCancelledTransactionsData(monthlyCancelledTransactions)
      setSalesData(salesArr);
      setTransactionsData(monthlyTransactions);
    })()
  }, [])

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Monthly sales",
        borderColor: "black",
        backgroundColor: "white",
        data: salesData,
      },
      {
        type: "bar",
        label: "Monthly Successful Transactions",
        backgroundColor: "#a6b7f1",
        data: transactionsData,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 100,
      },
      {
        type: "bar",
        label: "Monthly Cancelled Transactions",
        backgroundColor: "rgb(229, 111, 139)",
        data: cancelledTransactionsData,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 100,
      },
    ],
  };


  return (
    <DashboardChartsContainer>
      <SalesAndProductsData>

        <DataContainer>
          <DataInformation icon={'fa-solid fa-ranking-star'} data={totalSalesToday} title="Total sales today" />
          <DataInformation icon={'fa-solid fa-bag-shopping'} data={overAllSales} title={`Total sales for ${new Date().getFullYear()}`} />
          <DataInformation icon={'fa-solid fa-cash-register'} data={totalNumberOfAllTransactions} title="Total sucessful transactions" />
          <DataInformation  icon={"fa-solid fa-cash-register"}data={totalNumberOfAllCancelledTransactions} title="Total cancelled transactions"/>
        </DataContainer>

        <MonthlySalesChartsContainer>
           <h1>Monthly sales & transactions for year {new Date().getFullYear()}</h1> 
          <Chart
            data={data}
            options={salesChartOption}
            style={{ position: "relative", }}
          />
        </MonthlySalesChartsContainer>

      </SalesAndProductsData>

     <Feedback setOpenFeedbackModal={setOpenFeedbackModal}/>
    </DashboardChartsContainer>
  );
}

export default DashboardCharts;
