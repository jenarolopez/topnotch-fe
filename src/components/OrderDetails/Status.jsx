import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  OrderStatusContainer,
  OrderStatus,
  OrderStatusInfo,
} from "../../pages/adminPages/order_detail/components";
import statusLogic from "./statusLogic";
import ConfirmModal from "../modals/admin_modals/confirm/ConfirmModal";

function Status({ data }) {
  const [deliveryStatus, setDeliveryStatus] = useState(0);
  const [statusSummaryPackaging, setStatusSummaryPackaging] = useState("");
  const [statusSummaryShipping, setStatusSummaryShipping] = useState("");
  const [statusSummaryDelivering, setStatusSummaryDelivering] = useState("");
  const [openItem, setOpenItem] = useState({
    isOpen: false,
    response: false
  })
  

  const { statusSummary, orderNextStage } = statusLogic({
    deliveryStatus,
    setDeliveryStatus,
    data,
  });
  useEffect(() => {
    setDeliveryStatus(data?.delivery_status);
  }, [data]);

  
  useEffect(() => {
    setStatusSummaryPackaging(statusSummary(1));
    setStatusSummaryShipping(statusSummary(2));
    setStatusSummaryDelivering(statusSummary(3));
  }, [deliveryStatus]);


  useEffect(()=>{
    if(openItem.response) {
      orderNextStage()
    }
  },[openItem.response])


  const confirmOrderStatus = () => {
    setOpenItem({
      isOpen: true,
      response: false
    })
  }


  return (
    <OrderStatusContainer>
      {
        openItem.isOpen && <ConfirmModal openItem={openItem} setOpenItem={setOpenItem} body={'Are you sure you want to move this to the NEXT STEP?'}/>
      }
      <h3>Order Status</h3>

      <OrderStatus className={statusSummaryPackaging}>
        <i class="fa-solid fa-boxes-stacked"></i>
        <OrderStatusInfo>
          <span>
            Order Packed{" "}
            <i class={`fa-solid fa-circle-check ${statusSummaryPackaging}`}></i>
          </span>
          <small>Order is being prepared</small>
        </OrderStatusInfo>
      </OrderStatus>

      <OrderStatus className={statusSummaryShipping}>
        <i class="fa-solid fa-truck-fast"></i>
        <OrderStatusInfo>
          <span>
            Order Dispatched{" "}
            <i class={`fa-solid fa-circle-check ${statusSummaryShipping}`}></i>
          </span>
          <small>Preparing to dispatch </small>
        </OrderStatusInfo>
      </OrderStatus>

      <OrderStatus className={statusSummaryDelivering}>
        <i class="fa-solid fa-truck-ramp-box "></i>
        <OrderStatusInfo>
          <span>
            Order Delivered{" "}
            <i
              class={`fa-solid fa-circle-check ${statusSummaryDelivering}`}
            ></i>
          </span>
          <small>Order is in shipping process </small>
        </OrderStatusInfo>
      </OrderStatus>

      {data?.id ? (
        <>
          {data.delivery_status !== "cancelled" && deliveryStatus !== -1 ? (
            <button onClick={()=>{confirmOrderStatus()}} disabled={deliveryStatus >= 4}>
              {deliveryStatus >= 4 ? "Order completed" : "Next Stage"}
            </button>
          ) : (
            <button disabled={deliveryStatus === -1}>
              {"Order cancelled"}
            </button>
          )}
        </>
      ) : (
        <> </>
      )}
    </OrderStatusContainer>
  );
}

export default Status;
