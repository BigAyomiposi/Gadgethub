import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useModal } from "./ModalContext";


export default function Home() {
  
 const [search, setSearch] = useState("");
const [showCartModal, setShowCartModal] = useState(false);
const [addedGadget, setAddedGadget] = useState(null);
const { showModal, showConfirm } = useModal();
   const navigate = useNavigate();
const addToCart = (gadget) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    showModal("Please login before adding products to your cart.");
    return;
  }

  if (Number(user?.isAdmin) === 1) {
    showModal("Admins cannot add products to cart.");
    return;
  }

  console.log("PRODUCT:", gadget);
  console.log("STOCK:", gadget.quantity);

  // Each user gets their own cart
  const cartKey = `cart_${user.email}`;

  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  const existingItem = cart.find(
    (item) => item.id === gadget.id
  );

  const availableStock = Number(gadget.quantity);

  if (availableStock <= 0) {
    showModal("Product is out of stock.");
    return;
  }

  if (existingItem) {

    if (existingItem.quantity >= existingItem.quantityAvailable) {
      showModal("No more stock available.");
      return;
    }

    existingItem.quantity++;

  } else {

    cart.push({
      ...gadget,
      quantity: 1,
      quantityAvailable: availableStock
    });

  }

  localStorage.setItem(
    cartKey,
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  setAddedGadget(gadget);
  setShowCartModal(true);
};
const [dbProducts, setDbProducts] = useState([]);
useEffect(() => {

    axios.get("http://localhost:1000/products")

    .then((res) => {

        if(res.data.success){

            setDbProducts(res.data.products);

        }

    })

    .catch((err) => {

        console.log(err);

    });

}, []);
const allProducts = dbProducts;
const filteredProducts = allProducts.filter((gadget) =>
  gadget.name.toLowerCase().includes(search.toLowerCase())
);  

  return (
    <div className="App">
	
      <header className="App-header">
     <div className="search-container">
  <input
    type="text"
    placeholder="🔍 Search for a gadget..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {search && (
    <button
      className="clear-search"
      onClick={() => setSearch("")}
    >
      ✕
    </button>
  )}
</div>
       <section className="products">
 {filteredProducts.map((gadget) => (
   <div className="card" key={`${gadget.id}-${gadget.name}`}>
<Link
  to="/product"
  state={{ gadget }}
  className="product-link"
>
  <img
    src={
      gadget.image.startsWith("/images/")
        ? gadget.image
        : `http://localhost:1000${gadget.image}`
    }
    alt={gadget.name}
  />

  <h3>{gadget.name}</h3>
</Link>

  <p className="price">
    ₦{gadget.price.toLocaleString()}
  </p>
 <p className={`stock ${gadget.quantity === 0 ? "out-of-stock" : ""}`}>
  <span className="stock-icon">
    {gadget.quantity > 0 ? "✓" : "×"}
  </span>

  {gadget.quantity > 0
    ? `${gadget.quantity} in stock`
    : "Out of stock"}
</p>

  <button
    className="buy-btn"
    disabled={gadget.quantity === 0}
    onClick={() => addToCart(gadget)}
>
    {gadget.quantity > 0
        ? "Add to Cart🛒"
        : "Out of Stock"}
</button>
</div>
  ))}
</section>

     {showCartModal && (
  <div className="modal-overlay">
    <div className="cart-modal">

      <button
        className="modal-close"
        onClick={() => setShowCartModal(false)}
      >
        &times;
      </button>

      <div className="success-icon">
        ✓
      </div>

      <h2>Added to Cart!</h2>

      {addedGadget && (
        <p>
          <strong>{addedGadget.name}</strong> has been added to your cart.
        </p>
      )}

      <div className="modal-buttons">

        <button
          className="continue-shopping"
          onClick={() => setShowCartModal(false)}
        >
          Continue Shopping
        </button>

        <button
          className="view-cart"
          onClick={() => navigate("/cart")}
        >
          View Cart
        </button>

      </div>
    </div>
  </div>
)}   
        
      </header>

     <Footer/>
    </div>
  );
};
