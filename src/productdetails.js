import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./Footer";

export default function ProductDetails() {

    const location = useLocation();
    const navigate = useNavigate();

    const gadget = location.state?.gadget;

    if (!gadget) {
        return (
            <div className="product-details">
                <h2>Product not found.</h2>
            </div>
        );
    }

    const buyNow = () => {

        if (gadget.quantity <= 0) {
            alert("Product is out of stock.");
            return;
        }

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(
            item => item.id === gadget.id
        );

        if (existing) {

            if (existing.quantity >= gadget.quantity) {
                alert("No more stock available.");
                return;
            }

            existing.quantity++;

        } else {

            cart.push({
                ...gadget,
                quantity: 1,
                quantityAvailable: gadget.quantity
            });

        }

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        navigate("/cart");
    };


    return (
        <>
            <div className="product-details">

                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="product-container">

                    <div className="product-image">

                        <img
                            src={
                                gadget.image.startsWith("/images/")
                                    ? gadget.image
                                    : `http://localhost:1000${gadget.image}`
                            }
                            alt={gadget.name}
                        />

                    </div>


                    <div className="product-info">

                        <h1>{gadget.name}</h1>

                        <h2 className="product-price">
                            ₦{Number(gadget.price).toLocaleString()}
                        </h2>


                        <p className="stock">

                            {gadget.quantity > 0
                                ? `✅ ${gadget.quantity} In Stock`
                                : "❌ Out of Stock"}

                        </p>

                        <hr />


                        <p>
                            <strong>Product:</strong>{" "}
                            {gadget.name}
                        </p>

                        <p>
                            <strong>Price:</strong>{" "}
                            ₦{Number(gadget.price).toLocaleString()}
                        </p>

                        <p>
                            <strong>Available Quantity:</strong>{" "}
                            {gadget.quantity}
                        </p>


                        <button
                            className="buy-btn"
                            onClick={buyNow}
                            disabled={gadget.quantity <= 0}
                        >

                            {gadget.quantity > 0
                                ? "Add to Cart"
                                : "Out of Stock"}

                        </button>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
}