import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Ordered() {
  const location = useLocation();
  const cart = location.state?.cart || [];
  const [formResponse, setFormResponse] = React.useState({responder: "",message: "",});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  fullName: user?.fullname || "",
  phone: user?.phone || "",
  quantity: 1,
  deliveryAddy: "",
});

  const handleForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
   const totalPrice = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
  const submitForm = async (e) => {
  e.preventDefault();
  console.log(cart);

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.post(
      "http://localhost:1000/create-payment",
      {
        name: formData.fullName,
        email: user.email,
        phone: formData.phone,
        deliveryAddy: formData.deliveryAddy,
        items: cart,
        totalPrice: totalPrice
      }
    );

    console.log(res.data);

    if (res.data.success) {

    
      localStorage.setItem(
        "pendingCart",
        JSON.stringify(cart)
      );

    
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          name: formData.fullName,
          email: user.email,
          phone: formData.phone,
          deliveryAddy: formData.deliveryAddy,
          totalPrice: totalPrice
        })
      );

   
      window.location.href = res.data.paymentLink;

    } else {

      alert(res.data.message);

    }

  } catch (err) {

    console.log(err);
    alert("Unable to start payment.");

  }
};
  
    const { responder, message } = formResponse;
  const report =
    responder !== "" ? `${responder}, ${message}` : "";

 
	const getImageUrl = (image) => {
        if (!image) return "";

        return image.startsWith("/images/")
            ? image
            : `http://localhost:1000${image}`;
    };

   

  return (
    <div className="App">
      <h2>Order Gadget</h2>
     <div className="order-card">
     <h2>Your Items</h2>

{cart.map((item) => (

  <div className="checkout-item" key={item.id}>

    <img
    className="checkout-image"
    src={getImageUrl(item.image)}
    alt={item.name}
/>

    <div>

      <h3>{item.name}</h3>

      <p>Quantity: {item.quantity}</p>

      <p>
        ₦{(item.price * item.quantity).toLocaleString()}
      </p>

    </div>

  </div>

))}

      <form onSubmit={submitForm}>
        <label>Full Name</label><br />
        <input type="text" name="fullName" value={formData.fullName} onChange={handleForm}/><br /><br />
     <label>Phone Number</label><br />
        <input type="text" name="phone" value={formData.phone} onChange={handleForm}/><br /><br />
         <label>Delivery Address</label><br />
        <input type="text" name="deliveryAddy" value={formData.deliveryAddy} onChange={handleForm}/><br /><br />
        <label>Total Price</label><br />
        <input type="text" name="price" value={`₦${totalPrice.toLocaleString()}`} readOnly/><br /><br />
       <button type="submit">Pay Now</button>
      </form>
	  </div>
    </div>
  );
}  