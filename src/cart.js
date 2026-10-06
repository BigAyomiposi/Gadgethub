import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./Footer";
export default function Cart() {

  const [cart, setCart] = useState([]);
  const getImageUrl = (image) => {
        if (!image) return "";

        return image.startsWith("/images/")
            ? image
            : `http://localhost:1000${image}`;
    };

   

  const navigate = useNavigate();

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setCart([]);
    return;
  }

  const cartKey = `cart_${user.email}`;

  const savedCart =
    JSON.parse(localStorage.getItem(cartKey)) || [];

  setCart(savedCart);
}, []);

const saveCart = (newCart) => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return;
  }

  const cartKey = `cart_${user.email}`;

  setCart(newCart);

  localStorage.setItem(
    cartKey,
    JSON.stringify(newCart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );

};

  const increaseQty = (id) => {

    const updated = cart.map((item) => {

        if (item.id === id) {

            if (item.quantity >= item.quantityAvailable) {

                alert("Maximum stock reached.");

                return item;

            }

            return {
                ...item,
                quantity: item.quantity + 1
            };

        }

        return item;

    });

    saveCart(updated);

};
  const decreaseQty = (id) => {

    const updated = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return;
  }

  const cartKey = `cart_${user.email}`;

  localStorage.removeItem(cartKey);

  setCart([]);

  window.dispatchEvent(
    new Event("cartUpdated")
  );

};

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
console.log(cart);

const proceedToCheckout = () => {
  const invalidItem = cart.find(
    (item) => Number(item.quantity) > Number(item.quantityAvailable)
  );

  if (invalidItem) {
    alert(
      `${invalidItem.name} has only ${invalidItem.quantityAvailable} item(s) available.`
    );
    return;
  }

  navigate("/gadget", {
    state: { cart }
  });
};

  return (
  <>
    <div className="cart-page">

      <h1>🛒 My Cart</h1>

      {cart.length === 0 ? (

        <h2>Your cart is empty.</h2>

      ) : (

        <>
          {cart.map((item) => (

            <div className="cart-item" key={item.id}>

              <img src={getImageUrl(item.image)} alt={item.name}/>

              <div className="cart-details">

                <h3>{item.name}</h3>

                <p>Unit Price: ₦{item.price.toLocaleString()}</p>
				<p className="stock-info">
    Available Stock: {item.quantityAvailable}
</p>

                <div className="qty-buttons">

                  <button onClick={() => decreaseQty(item.id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQty(item.id)}>
                    +
                  </button>

                </div>
                <div className="Totalprice">
                <h4>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </h4>
                  </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          <div className="cart-total">

            <h2>
              Total: ₦{total.toLocaleString()}
            </h2>

           <button
  className="checkout-btn"
  onClick={proceedToCheckout}
>
  Proceed to Checkout
</button>
            

            <button
              className="clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </>

      )}

    </div>
	<Footer/>
	</>
  );
}