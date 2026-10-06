import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./Footer";

export default function Ordered() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [formData, setFormData] = useState({
    fullName: user?.fullname || "",
    phone: user?.phone || "",
    deliveryAddy: ""
  });

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("/images/")
      ? image
      : `http://localhost:1000${image}`;
  };

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * Number(item.quantity),
    0
  );

  const handleForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const continueToPreview = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.deliveryAddy.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const checkoutData = {
      name: formData.fullName,
      email: user?.email || "",
      phone: formData.phone,
      deliveryAddy: formData.deliveryAddy,
      items: cart,
      totalPrice: totalPrice
    };

    localStorage.setItem(
      "checkoutData",
      JSON.stringify(checkoutData)
    );

    navigate("/order-preview");
  };

  return (
    <>
      <div className="checkout-page">

        <div className="checkout-container">

          <h1>🛒 Checkout</h1>

          <p className="checkout-subtitle">
            Enter your delivery details before reviewing your order.
          </p>

          {/* ORDER ITEMS */}

          <div className="checkout-card">

            <h2>Your Items</h2>

            {cart.length === 0 ? (

              <div className="empty-checkout">
                <p>Your cart is empty.</p>

                <button
                  onClick={() => navigate("/cart")}
                  className="checkout-back-btn"
                >
                  ← Back to Cart
                </button>
              </div>

            ) : (

              cart.map((item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="checkout-image"
                  />

                  <div className="checkout-item-info">

                    <h3>{item.name}</h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Unit Price: ₦
                      {Number(item.price).toLocaleString()}
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

              ))

            )}

            {cart.length > 0 && (

              <div className="checkout-total">

                <span>Total</span>

                <strong>
                  ₦{totalPrice.toLocaleString()}
                </strong>

              </div>

            )}

          </div>


          {/* DELIVERY DETAILS */}

          {cart.length > 0 && (

            <div className="checkout-card">

              <h2>Delivery Information</h2>

              <form onSubmit={continueToPreview}>

                <div className="checkout-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleForm}
                    placeholder="Enter your full name"
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleForm}
                    placeholder="Enter your phone number"
                  />

                </div>


                <div className="checkout-field">

                  <label>
                    Delivery Address
                  </label>

                  <textarea
                    name="deliveryAddy"
                    value={formData.deliveryAddy}
                    onChange={handleForm}
                    placeholder="Enter your delivery address"
                    rows="4"
                  />

                </div>


                <div className="checkout-actions">

                  <button
                    type="button"
                    className="checkout-back-btn"
                    onClick={() => navigate("/cart")}
                  >
                    ← Back to Cart
                  </button>

                  <button
                    type="submit"
                    className="checkout-preview-btn"
                  >
                    Review Order →
                  </button>

                </div>

              </form>

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
}