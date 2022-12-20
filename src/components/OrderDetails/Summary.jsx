import React from "react";

import {
  OrderSummary,
  OrderCalculation,
} from "../../pages/adminPages/order_detail/components";
import productPriceFormatter from '../../helpers/ProductPriceFormatter'
function Summary({data}) {
  return (
    <OrderSummary>
      <OrderCalculation>
        <div>Subtotal:</div>
        <div>{productPriceFormatter(Math.ceil(data?.total_amount - (data?.total_amount * 0.01)))}</div>
      </OrderCalculation>

      <OrderCalculation>
        <div>Shipping:</div>
        <div>{productPriceFormatter(Math.round(data.total_amount * 0.01))}</div>
      </OrderCalculation>

      <OrderCalculation>
        <div>Total:</div>
        <div>{productPriceFormatter(data?.total_amount)}</div>
      </OrderCalculation>
    </OrderSummary>
  );
}

export default Summary;
