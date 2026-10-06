import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function Contact() {
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showModal(
        "Missing Name",
        "Please enter your name."
      );
      return;
    }

    if (!formData.email.trim()) {
      showModal(
        "Missing Email",
        "Please enter your email address."
      );
      return;
    }

    if (!formData.message.trim()) {
      showModal(
        "Missing Message",
        "Please enter your message or note."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:1000/contact-messages",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        }
      );

      if (res.data.success) {
        // Clear form
        setFormData({
          name: "",
          email: "",
          message: ""
        });

        showModal(
          "Message Sent",
          "Thank you for contacting Possy's Gadget Hub. We will get back to you shortly."
        );
      } else {
        showModal(
          "Message Failed",
          res.data.message || "Unable to send your message."
        );
      }

    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      showModal(
        "Error",
        error.response?.data?.message ||
        "Unable to send your message. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="contact-page">

      <div className="contact-container">

      
        <h1>Contact Us</h1>

        <p className="contact-intro">
          We'd love to hear from you! Whether you have
          questions about our products, need technical
          assistance, or want to place an order, our
          team is ready to help.
        </p>


        <div className="contact-grid">

          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p>
              +234 806 904 2158
            </p>
          </div>


          <div className="contact-card">
            <h3>📧 Email</h3>
            <p>
              possysgadgethub.com
            </p>
          </div>


          <div className="contact-card">
            <h3>📍 Address</h3>
            <p>
              COREM Church,
              <br />
              Oke Ila,
              <br />
              Ado-Ekiti,
              <br />
              Ekiti State, Nigeria.
            </p>
          </div>


          <div className="contact-card">
            <h3>🕒 Business Hours</h3>
            <p>
              Monday – Friday: 8:00 AM – 6:00 PM
              <br />
              Saturday: 9:00 AM – 4:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>

        </div>


        
        <div className="contact-form-section">

          <h2>Send Us a Message</h2>

          <p className="contact-form-intro">
            Have a question or need assistance?
            Fill out the form below and we'll
            get back to you.
          </p>


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}
            <div className="contact-form-group">

              <label htmlFor="contact-name">
                Full Name
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
              />

            </div>


            {/* EMAIL */}
            <div className="contact-form-group">

              <label htmlFor="contact-email">
                Email Address
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
              />

            </div>


            {/* MESSAGE */}
            <div className="contact-form-group">

              <label htmlFor="contact-message">
                Message / Note
              </label>

              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message or note here..."
                rows="6"
                disabled={loading}
              />

            </div>


            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>


        
        <div className="map-section">

          <h2>Find Us</h2>

          <iframe
            src="https://maps.app.goo.gl/Mz4QXKkQ6kgqr5PW9"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Possy's Gadget Hub Location"
          ></iframe>

        </div>

      </div>


      <Footer />

    </div>
  );
}
