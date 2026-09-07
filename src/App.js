import "./App.css";
import React from "react";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Service from "./Service";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Ordered from "./Ordered";
import Signup from "./signup";
import Login from "./login";
import Dashboard from "./dashboard";
import ProtectedRoute from "./ProtectedRoute";
import OrderSuccess from "./ordersuccess";
import Cart from "./cart";
import AdminUpload from "./adminupload";
import AdminDashboard from "./admindashboard";
import AdminOrders from "./adminorder";
import ProductDetails from "./productdetails";
import PaymentCallback from "./PaymentCallback";
import Receipt from "./Receipt";
import { ModalProvider } from "./ModalContext";
function App() {
	const user = JSON.parse(localStorage.getItem("user"));
  return (
  
    <BrowserRouter>
	<ModalProvider>
      <div className="App">
  <Routes>
    <Route path="/" element={<Nav />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="services" element={<Service />} />
      <Route path="gadget" element={<Ordered />} />
	  <Route path="product" element={<ProductDetails />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
	  <Route path="cart" element={<Cart />} />
	  <Route path="admin-upload" element={<AdminUpload />} />
	  <Route path="/admin" element={ user?.isAdmin === 1 ? <AdminDashboard /> : <Navigate to="/" />}/>
      <Route path="dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="order-success" element={<OrderSuccess />} />
	  <Route path="/admin-orders" element={<AdminOrders />} />
	  <Route path="payment-callback" element={<PaymentCallback />}/>
	  <Route path="/receipt/:transaction_id" element={<Receipt />}/>
    </Route>
  </Routes>
</div>
    </ModalProvider>
    </BrowserRouter>
	
  );
}

export default App;