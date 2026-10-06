import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function OrderPreview() {

  const navigate = useNavigate();
    const { showModal, showConfirm } = useModal();

  const checkoutData = JSON.parse(
    localStorage.getItem("checkoutData") || "null"
  );

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("/images/")
      ? image
      : `http://localhost:1000${image}`;
  };

  if (!checkoutData) {

    return (
      <>
        <div className="order-preview-page">

          <div className="order-preview-container">

            <h1>Order Preview</h1>

            <p>
              No checkout information was found.
            </p>

            <button
              className="preview-shopping-btn"
              onClick={() => navigate("/cart")}
            >
              ← Back to Cart
            </button>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  const {
    name,
    email,
    phone,
    deliveryAddy,
    items,
    totalPrice
  } = checkoutData;


  const proceedToPayment = async () => {

    try {

      if (!items || items.length === 0) {
       showModal("Your order is empty.");
        return;
      }

      const res = await axios.post(
        "http://localhost:1000/create-payment",
        {
          name,
          email,
          phone,
          deliveryAddy,
          items,
          totalPrice
        }
      );

      console.log(
        "PAYMENT RESPONSE:",
        res.data
      );

      if (res.data.success) {

        localStorage.setItem(
          "pendingCart",
          JSON.stringify(items)
        );

        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            name,
            email,
            phone,
            deliveryAddy,
            totalPrice
          })
        );

        window.location.href =
          res.data.paymentLink;

      } else {

        showModal(
          res.data.message ||
          "Unable to start payment."
        );
      }

    } catch (err) {

      console.log(
        "PAYMENT ERROR:",
        err
      );

      console.log(
        "PAYMENT ERROR RESPONSE:",
        err.response?.data
      );

     showModal(
        err.response?.data?.message ||
        "Unable to start payment."
      );
    }
  };


  const editDetails = () => {

    navigate("/gadget", {
      state: {
        cart: items,
        editCheckout: true
      }
    });

  };


  return (
    <>
      <div className="order-preview-page">

        <div className="order-preview-container">

          <h1>📋 Order Preview</h1>

          <p className="preview-subtitle">
            Please review your order and delivery information
            before making payment.
          </p>


          {/* PRODUCTS */}

          <div className="preview-section">

            <h2>🛍️ Your Items</h2>

            {items.map((item) => (

              <div
                className="preview-item"
                key={item.id}
              >

                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="preview-image"
                />

                <div className="preview-item-details">

                  <h3>{item.name}</h3>

                  <p>
                    Quantity: {item.quantity}
                  </p>

                  <p>
                    Unit Price: ₦
                    {Number(
                      item.price
                    ).toLocaleString()}
                  </p>

                  <strong>
                    ₦
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>

            ))}

          </div>


          {/* DELIVERY INFORMATION */}

          <div className="preview-section">

            <div className="preview-heading-row">

              <h2>🚚 Delivery Information</h2>

            </div>

            <div className="delivery-details">

              <div className="delivery-row">

                <span>
                  <strong>Name</strong>
                </span>

                <span>
                  {name}
                </span>

              </div>


              <div className="delivery-row">

                <span>
                  <strong>Email</strong>
                </span>

                <span>
                  {email}
                </span>

              </div>


              <div className="delivery-row">

                <span>
                  <strong>Phone</strong>
                </span>

                <span>
                  {phone}
                </span>

              </div>


              <div className="delivery-row address-row">

                <span>
                  <strong>Address</strong>
                </span>

                <span>
                  {deliveryAddy}
                </span>

              </div>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="preview-summary">

            <h2>💰 Order Summary</h2>

            <div className="summary-row">

              <span>
                Number of Items
              </span>

              <span>
                {items.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity),
                  0
                )}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₦
                {Number(
                  totalPrice
                ).toLocaleString()}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery Fee
              </span>

              <span>
                Free
              </span>

            </div>


            <hr />


            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₦
                {Number(
                  totalPrice
                ).toLocaleString()}
              </span>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="preview-buttons">

            <button
              className="back-cart-btn"
              onClick={editDetails}
            >
              ← Edit Details
            </button>

            <button
              className="continue-checkout-btn"
              onClick={proceedToPayment}
            >
              Proceed to Payment →
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}