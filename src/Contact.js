import React from "react";
import "./App.css";
import Footer from "./Footer";

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">

        <h1>Contact Us</h1>

        <p className="contact-intro">
          We'd love to hear from you! Whether you have questions about our
          products, need technical assistance, or want to place an order, our
          team is ready to help.
        </p>

        <div className="contact-grid">

          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p>+234 806 904 2158</p>
          </div>

          <div className="contact-card">
            <h3>📧 Email</h3>
         <p>possysgadgethub.com</p>
          </div>

          <div className="contact-card">
            <h3>📍 Address</h3>
            <p>
              COREM Church,
              <br />
              Oke Ila,
              <br />
              Ado-Ekiti,
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
	  <Footer/>
    </div>
	
  );
}