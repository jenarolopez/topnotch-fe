import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import OrderData from "../../../components/order/OrderData";

import {
  OrderDetailsContainer,
  OrderDetailsList,
  SearchBarWrapper,
  SearchBarContainer,
  TableContainer,
  TableRowHeader,
  T_Head as Thead,
  GlobalStyles,
} from "./components";
import CustomAxios from "../../../customer hooks/CustomAxios";

function OrderList() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [textSearch, setTextSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setOrders([]);
        const response = await CustomAxios({
          METHOD: "POST",
          uri: `/api/admin/getToShipOrders`,
          values: { status, textSearch },
        });
        console.log(response);
        const { msg, success } = response;
        if (!success && msg?.includes("session expired")) {
          return window.location.reload();
        }
        const { orders } = response;
        setOrders(orders);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [status, textSearch]);

  return (
    <OrderDetailsContainer>
      <GlobalStyles />
      <h3>To Ship Orders</h3>

      <p>
        Welcome, Admin! Tracking customer order allows you to manage, modified
        and approve all the pending orders in the system.
      </p>

      <OrderDetailsList>
        <SearchBarWrapper>
          <SearchBarContainer>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search for Order ID"
              onChange={(e) => setTextSearch(e.target.value)}
            />
          </SearchBarContainer>

          <select
            name=""
            id=""
            className="select"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="onGoing">On Going</option>
          </select>
        </SearchBarWrapper>

        <TableContainer>
          <TableRowHeader>
            <Thead className="id"> Order ID </Thead>
            <Thead className="customer"> Customer </Thead>
            <Thead className="products"> Products </Thead>
            <Thead className="date"> Date </Thead>
            <Thead className="price"> Price </Thead>
            <Thead className="order__status"> Order Status </Thead>
            <Thead className="payment__method"> Payment Method</Thead>
          </TableRowHeader>

          {loading ? (
            <h2 style={{ color: "gray", marginBlock: 50 }}>
              Loading orders...
            </h2>
          ) : orders?.length === 0 ? (
            <h2 style={{ color: "gray", marginBlock: 50 }}>No Orders Yet</h2>
          ) : (
            orders?.map((order) => <OrderData key={order.id} data={order} />)
          )}
        </TableContainer>
      </OrderDetailsList>
    </OrderDetailsContainer>
  );
}

export default OrderList;
