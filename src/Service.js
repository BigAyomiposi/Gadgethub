import React from "react";
import "./App.css";
import { gadgets } from "./gadgets";
import Footer from "./Footer";

export default function Service() {
  return (
    <div className="page">
      <div className="page-container">
        <h1>Our Services</h1>

        <p>
          We provide premium gadgets together with reliable customer services to
          ensure you enjoy the best shopping experience.
        </p>

        <div className="services-grid">
          {gadgets.slice(4, 12).map((gadget, index) => (
            <div className="service-card" key={index}>
              <img src={gadget.image} alt={gadget.name} />
              <h3>{gadget.name}</h3>
              <p>
                We supply high-quality {gadget.name} with guaranteed
                authenticity, affordable pricing, and excellent after-sales
                support.
              </p>
            </div>
          ))}
        </div>

        <div className="extra-services">
          <h2>Additional Services</h2>

          <ul>
            <li>✔ Gadget Sales</li>
            <li>✔ Nationwide Delivery</li>
            <li>✔ Warranty Support</li>
            <li>✔ Secure Online Payments</li>
            <li>✔ Customer Support</li>
            <li>✔ Product Recommendations</li>
          </ul>
        </div>
      </div>
	  <Footer/>
    </div>
  );
}