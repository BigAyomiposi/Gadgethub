import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function Signup() {
  const navigate = useNavigate();
const { showModal, showConfirm } = useModal();
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      showModal("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:1000/register", {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        password: user.password,
      });

      showModal(res.data.message);

      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      showModal("Registration Failed");
    }
  };

  return (
  <>
    <div className="auth-container">

      <form className="auth-form" onSubmit={register}>

        <h2>Create Account</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button>Create Account</button>

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </form>
    </div>
	<Footer/>
	</>
  );
}