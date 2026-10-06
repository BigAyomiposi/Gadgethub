import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
  localStorage.getItem("user") || "null"
);
const [passport, setPassport] = useState(null);
 const [orders, setOrders] = useState([]);
const [groupedOrders, setGroupedOrders] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const { showModal, showConfirm } = useModal();

  const [editData, setEditData] = useState({fullname: user?.fullname || "", email: user?.email || "", phone: user?.phone || ""});
  useEffect(() => {
console.log("Logged in user:", user);
console.log("Email:", user?.email);
    axios.get(
  `http://localhost:1000/orders/${encodeURIComponent(user.email)}`
)
.then((res) => {
	console.log(res.data);
  if (res.data.success) {

  setOrders(res.data.orders);

  const grouped = {};

  res.data.orders.forEach((order) => {

    const transactionId = order.transaction_id;

    if (!grouped[transactionId]) {

      grouped[transactionId] = {
        transaction_id: transactionId,
        name: order.name,
        email: order.email,
        phone: order.phoneNo,
        deliveryAddy: order.deliveryAddy,
        status: order.status,
        items: [],
        totalPrice: 0
      };

    }

    grouped[transactionId].items.push(order);

    grouped[transactionId].totalPrice +=
      Number(order.Price);

  });

  setGroupedOrders(
    Object.values(grouped)
  );
}
})
.catch((err) => {
  console.log(err);
});

  }, []);
const saveProfile = async () => {
  try {
    const formData = new FormData();

    formData.append("fullname", editData.fullname);
    formData.append("email", editData.email);
    formData.append("phone", editData.phone);
    formData.append("oldEmail", user.email);

    if (passport) {
      formData.append("passport", passport);
    }

    const res = await axios.put(
      "http://localhost:1000/update-profile",
      formData
    );

    console.log("UPDATE PROFILE RESPONSE:", res.data);

    if (res.data.success) {

      const updatedUser = {
        ...user,
        fullname: editData.fullname,
        email: editData.email,
        phone: editData.phone,
        passport:
          res.data.passport ??
          user?.passport ??
          null
      };

      console.log("UPDATED USER:", updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      showModal(
        "Success",
        "Profile updated successfully.",
        () => {
          setActivePage("profile");
        }
      );

    } else {

      showModal(
        "Error",
        res.data.message || "Profile update failed"
      );
    }

  } catch (err) {

    console.log("UPDATE ERROR:", err);
    console.log(
      "UPDATE RESPONSE:",
      err.response?.data
    );

    showModal(
      "Error",
      err.response?.data?.message ||
      err.message ||
      "Unable to update profile."
    );
  }
};
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
  <>
    <div className="dashboard-container">

      <div className="sidebar">

        <h2>Possy's Gadget Hub</h2>

        <ul>
          <li onClick={() => setActivePage("dashboard")}>
            🏠 Dashboard
          </li>

          <li onClick={() => setActivePage("profile")}>
            👤 My Profile
          </li>

          <li onClick={() => setActivePage("orders")}>
            📦 My Recent Orders
          </li>
		<li onClick={() => setActivePage("editprofile")}>
            ✏️ Edit Profile
          </li>
		<li onClick={() => navigate("/")}>
  🛒 Continue Shopping
</li>
</ul>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      <div className="dashboard-content">

        {activePage === "dashboard" && (
          <>

            <h1>Welcome {user?.fullname}</h1>

            <div className="cards">

              <div
                className="card-box"
                style={{ cursor: "pointer" }}
                onClick={() => setActivePage("orders")}
              >
                <h3>Total Orders</h3>
                <h1>{groupedOrders.length}</h1>
              </div>

            </div>

          </>
        )}

  {activePage === "profile" && (

  <div className="my-profile-box">

    <h2>My Profile</h2>

    <div className="my-profile-layout">

      {/* PASSPORT SECTION */}
      <div className="my-profile-passport">

        <div className="my-profile-image-box">

          {user?.passport ? (
            <img
              src={`http://localhost:1000/${user.passport}`}
              alt="Passport"
              className="my-profile-image"
            />
          ) : (
            <div className="my-profile-no-passport">
              No passport uploaded
            </div>
          )}

        </div>

        <button
          className="my-profile-passport-btn"
          onClick={() => setActivePage("editprofile")}
        >
          {user?.passport
            ? "Change Passport"
            : "Add Passport"}
        </button>

      </div>


      {/* USER INFORMATION */}
      <div className="my-profile-info">

        <div className="my-profile-details">

          <div className="my-profile-row">

            <span className="my-profile-label">
              Name:
            </span>

            <span>
              {user?.fullname}
            </span>

          </div>


          <div className="my-profile-row">

            <span className="my-profile-label">
              Email:
            </span>

            <span>
              {user?.email}
            </span>

          </div>


          <div className="my-profile-row">

            <span className="my-profile-label">
              Phone:
            </span>

            <span>
              {user?.phone}
            </span>

          </div>

        </div>

      </div>

    </div>

  </div>

)}
		
{activePage === "editprofile" && (

  <div className="profile">

    <h2>Edit Profile</h2>

    <input
    type="text"
    value={editData.fullname}
    onChange={(e)=>
        setEditData({
            ...editData,
            fullname:e.target.value
        })
    }
/>

<br /><br />

<input
    type="email"
    value={editData.email}
    onChange={(e)=>
        setEditData({
            ...editData,
            email:e.target.value
        })
    }
/>

<br /><br />

<input
    type="text"
    value={editData.phone}
    onChange={(e)=>
        setEditData({
            ...editData,
            phone:e.target.value
        })
    }
/>
<br /><br />
<input
  type="file"
  className="file-input"
  accept="image/jpeg,image/png,image/jpg"
  onChange={(e) => setPassport(e.target.files[0])}
/>

    <br /><br />

   <button
    className="save-btn"
    onClick={saveProfile}
>
    Save Changes
</button>

  </div>

)}
        {activePage === "orders" && (

          <>

            
            {groupedOrders.length === 0 ? (

              <p>No orders found.</p>

            ) : (
<div className="customer-orders">
    <h2>📦 Recent Orders</h2>
              <table  className="orders-table">

                <thead>


             <tr>
            <th>Name</th>
            <th>Product</th>
            <th>Quantity</th>
             <th>Price</th>
            <th>Delivery Address</th>
             <th>Status</th>
             <th>Receipt</th>
                   </tr>
           

       </thead>


                <tbody>

  {groupedOrders.map((order) => (

    <tr key={order.transaction_id}>

      {/* NAME */}

      <td>
        {order.name}
      </td>


      {/* PRODUCTS */}

      <td>

        {order.items.map((item) => (

          <div
            key={item.id}
            className="dashboard-product"
          >
            {item.itemOrdered}
          </div>

        ))}

      </td>


      {/* QUANTITY */}

      <td>

        {order.items.map((item) => (

          <div
            key={item.id}
            className="dashboard-product"
          >
            {item.Quantity}
          </div>

        ))}

      </td>


      {/* PRICE */}

      <td>

        {order.items.map((item) => (

          <div
            key={item.id}
            className="dashboard-product"
          >
            ₦{Number(
              item.Price
            ).toLocaleString()}
          </div>

        ))}

        <div className="dashboard-order-total">

          Total: ₦{Number(
            order.totalPrice
          ).toLocaleString()}

        </div>

      </td>


      {/* DELIVERY */}

      <td>
        {order.deliveryAddy}
      </td>


      {/* STATUS */}

      <td>

        {order.status === "Pending" && (
          <span className="pending-status">
            🟡 Pending
          </span>
        )}

        {order.status === "Processing" && (
          <span className="processing-status">
            🔵 Processing
          </span>
        )}

        {order.status === "Shipped" && (
          <span className="shipped-status">
            🚚 Shipped
          </span>
        )}

        {order.status === "Delivered" && (
          <span className="delivered-status">
            ✅ Delivered
          </span>
        )}

        {order.status === "Cancelled" && (
          <span className="cancelled-status">
            ❌ Cancelled
          </span>
        )}

      </td>


      {/* RECEIPT */}

      <td>

        <button
          className="receipt-btn"
          onClick={() =>
            navigate(
              `/receipt/${order.transaction_id}`
            )
          }
        >
          🧾 View Receipt
        </button>

      </td>

    </tr>

  ))}

</tbody>

              </table>
			  </div>

            )}

          </>

        )}
	
      </div>
 
    </div> 
	<Footer/> 
	</>
  );
  
}