import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./ordersuccess.css";
import Footer from "./Footer";
export default function OrderSuccess() {

    const location = useLocation();

    const transaction_id =
        location.state?.transaction_id;

    return (
  <>
    <div className="success-page">

      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="sub-text">
          Thank you for choosing
          <strong> Possy's Gadget Hub</strong>.
        </p>

        <p className="sub-text">
          Your order has been confirmed and is currently being prepared for delivery.
        </p>

        <div className="success-info">

          <div className="info-row">
            <span>📦 Status</span>
            <strong className="green">Confirmed</strong>
          </div>

          <div className="info-row">
            <span>🚚 Delivery</span>
            <strong>2 - 4 Business Days</strong>
          </div>

          <div className="info-row">
            <span>💳 Payment</span>
            <strong>Cash On Delivery</strong>
          </div>

        </div>

        <div className="success-btns">

          <Link to="/dashboard">
            <button className="dashboard-btn">
              View My Orders
            </button>
          </Link>

          <Link to="/">
            <button className="shop-btn">
              Continue Shopping
            </button>
          </Link>
            <Link
    to={`/receipt/${transaction_id}`}
>
    <button className="receipt-btn">
        View Receipt
    </button>
</Link>
        </div>

      </div>

    </div>
	<Footer/>
	</>
  );
}