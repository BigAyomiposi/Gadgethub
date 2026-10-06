import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import { useModal } from "./ModalContext";
import "./App.css";

export default function PaymentCallback() {
  const location = useLocation();
  const { showModal, showConfirm } = useModal();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    hasProcessed.current = true;

    const completePayment = async () => {
      const params = new URLSearchParams(location.search);

      const transaction_id = params.get("transaction_id");

      console.log("Transaction ID:", transaction_id);

      if (!transaction_id) {
        showModal("Transaction ID not found.");
        navigate("/cart");
        return;
      }

      try {
        const pendingCart =
          JSON.parse(
            localStorage.getItem("pendingCart")
          ) || [];

        const pendingOrder =
          JSON.parse(
            localStorage.getItem("pendingOrder")
          );

        if (
          pendingCart.length === 0 ||
          !pendingOrder
        ) {
          showModal("Pending order information not found.");
          navigate("/cart");
          return;
        }

        const res = await axios.post(
          "http://localhost:1000/complete-payment",
          {
            transaction_id,
            name: pendingOrder.name,
            email: pendingOrder.email,
            phone: pendingOrder.phone,
            deliveryAddy: pendingOrder.deliveryAddy,
            items: pendingCart,
            totalPrice: pendingOrder.totalPrice
          }
        );

        console.log(
          "COMPLETE PAYMENT:",
          res.data
        );

        if (res.data.success) {
          const receiptData = {
            transaction_id: transaction_id,
            name: pendingOrder.name,
            email: pendingOrder.email,
            phone: pendingOrder.phone,
            deliveryAddy: pendingOrder.deliveryAddy,
            items: pendingCart,
            totalPrice: pendingOrder.totalPrice,
            paymentStatus: "PAID"
          };


          const user = JSON.parse(
            localStorage.getItem("user") || "null"
          );

          if (user?.email) {
            const cartKey = `cart_${user.email}`;

            console.log(
              "Clearing cart:",
              cartKey
            );

            localStorage.removeItem(cartKey);
          }

          localStorage.removeItem("checkoutData");
          localStorage.removeItem("pendingCart");
          localStorage.removeItem("pendingOrder");


          window.dispatchEvent(
            new Event("cartUpdated")
          );

          localStorage.setItem(
            "receipt",
            JSON.stringify(receiptData)
          );

          

          navigate("/order-success", {
            state: {
              transaction_id: transaction_id
            }
          });
        } else {
          showModal(
            res.data.message ||
            "Payment could not be completed."
          );

          navigate("/cart");
        }

      } catch (error) {
        console.log(
          "PAYMENT COMPLETION ERROR:",
          error
        );

        console.log(
          "ERROR RESPONSE:",
          error.response?.data
        );

       showModal(
          error.response?.data?.message ||
          "Unable to complete your order."
        );

        navigate("/cart");
      }
    };

    completePayment();

  }, [location, navigate]);

  
return (
  <div className="payment-page">
    <div className="payment-callback">
      <h2>Processing Payment...</h2>

      <p>
        Please wait while we confirm your payment.
      </p>
    </div>

    <Footer />
  </div>
);


}

