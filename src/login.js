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

      const res = await axios.post("http://localhost:1000/login", login);
if (res.data.success) {

  localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
  );

  console.log(
    "Saved user:",
    localStorage.getItem("user")
  );

  if (res.data.user.isAdmin === 1) {

    navigate("/admin");

  } else {

    navigate("/dashboard");

  }

} else {

  showModal(res.data.message);

}

    } catch (err) {

      console.log(err);

      showModal("Login Failed");

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