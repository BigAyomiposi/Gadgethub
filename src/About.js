import React from "react";
import "./App.css";
import { gadgets } from "./gadgets";
import Footer from "./Footer";

export default function About() {
  return (
    <div className="page">
      <div className="page-container">
        <h1>About Possy's Gadget Hub</h1>

        <p>
          Welcome to <strong>Possy's Gadget Hub</strong>, your trusted destination
          for premium gadgets and electronics. We provide quality products from
          top brands at competitive prices while ensuring excellent customer
          service.
        </p>

        <p>
          Whether you're looking for smartphones, tablets, laptops, smart
          watches, headphones, cameras, or accessories, we've got you covered.
          Our goal is to make technology accessible, reliable, and affordable.
        </p>

        <h2>Our Mission</h2>

        <p>
          To become the leading online gadget store by providing authentic
          products, affordable prices, and exceptional customer satisfaction.
        </p>

        <h2>Featured Products</h2>

        <div className="gadget-gallery">
          {gadgets.slice(0, 10).map((gadget, index) => (
            <div className="gallery-card" key={index}>
              <img src={gadget.image} alt={gadget.name} />
              <h4>{gadget.name}</h4>
              <p>₦{gadget.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <h2>Why Choose Us?</h2>

        <div className="features">
          <div className="feature">
            <h3>✔ Genuine Products</h3>
            <p>100% authentic gadgets from trusted manufacturers.</p>
          </div>

          <div className="feature">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and secure delivery nationwide.</p>
          </div>

          <div className="feature">
            <h3>💳 Secure Payment</h3>
            <p>Safe payment options for a worry-free shopping experience.</p>
          </div>
        </div>
      </div>
	  <Footer/>
    </div>
  );
}