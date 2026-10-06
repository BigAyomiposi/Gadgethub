import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function Login() {

  const navigate = useNavigate();
  const { showModal, showConfirm } = useModal();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

const signin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:1000/login",
      login
    );

    console.log("LOGIN RESPONSE:", res.data);
    console.log("LOGIN USER:", res.data.user);
    console.log("LOGIN PASSPORT:", res.data.user?.passport);

    if (res.data.success) {
      const loggedInUser = {
        id: res.data.user.id,
        fullname: res.data.user.fullname,
        email: res.data.user.email,
        phone: res.data.user.phone,
        isAdmin: Number(res.data.user.isAdmin),
        passport: res.data.user.passport || null
      };

      console.log("USER BEING SAVED:", loggedInUser);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      console.log(
        "USER SAVED TO LOCALSTORAGE:",
        JSON.parse(localStorage.getItem("user"))
      );

      if (Number(loggedInUser.isAdmin) === 1) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } else {
      showModal(
        "Login Failed",
        res.data.message || "Invalid login details"
      );
    }

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    console.log("LOGIN ERROR RESPONSE:", err.response?.data);

    showModal(
      "Login Failed",
      err.response?.data?.message || "Login Failed"
    );
  }
};
  return (
<>
    <div className="auth-container">

      <form className="auth-form" onSubmit={signin}>

        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
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

        <button>Login</button>

        <p>

          Don't have an account?

          <Link to="/signup"> Sign Up</Link>

        </p>

      </form>
    </div>
<Footer/>
</>
  );

}