import React, { useState, useEffect  } from "react";
import "./App.css";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Nav(){
	const [menuOpen, setMenuOpen] = useState(false);
	const closeMenu = () =>
	 setMenuOpen(false);
	 const user = JSON.parse(localStorage.getItem("user"));
	 const navigate = useNavigate();
	 
	 const [cartCount, setCartCount] = useState(0);

useEffect(() => {

  const updateCart = () => {

    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    // No logged-in user = empty cart
    if (!currentUser) {
      setCartCount(0);
      return;
    }

    // Get this user's cart
    const cartKey = `cart_${currentUser.email}`;

    const cart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    const count = cart.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    setCartCount(count);

  };

  updateCart();

  window.addEventListener(
    "cartUpdated",
    updateCart
  );

  return () => {
    window.removeEventListener(
      "cartUpdated",
      updateCart
    );
  };

}, []);
	return(
	<>
	<nav>
  <b>Possy's Gadget Hub</b>

  <div
    className="menu-icon"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? "✕" : "☰"}
  </div>

  <ul className={menuOpen ? "show-menu" : ""}>
    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
    <li><Link to="/about" onClick={closeMenu}>About</Link></li>
    <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
    <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
	{user ? (
  <>
    <li>
      <Link
        to={user.isAdmin === 1 ? "/admin" : "/dashboard"}
        onClick={closeMenu}
      >
        {user.isAdmin === 1 ? "Admin Dashboard" : "Dashboard"}
      </Link>
    </li>

    <li>
      <button
	    className="logout-button"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </li>
  </>
) : (
  <>
    <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
    <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
  </>
)}
<li>
  <Link to="/cart" className="cart-link">
    🛒 Cart
    <span className="cart-badge">
      {cartCount}
    </span>
  </Link>
</li>

  </ul>
</nav>
	<Outlet/>
	</>
	);
}