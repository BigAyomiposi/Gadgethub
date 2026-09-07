import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";


export default function PaymentCallback() {

    const location = useLocation();
    const navigate = useNavigate();
	const hasProcessed = useRef(false);

    useEffect(() => {

    if (hasProcessed.current) {
        return;
    }

    hasProcessed.current = true;

    const completePayment = async () => {

        const params = new URLSearchParams(location.search);

        const transaction_id =
            params.get("transaction_id");

        console.log("Transaction ID:", transaction_id);

        if (!transaction_id) {

            alert("Transaction ID not found.");
            navigate("/cart");

            return;
        }

        try {

            const pendingCart =
                JSON.parse(
                    localStorage.getItem("pendingCart")
                ) || [];

            const pendingOrder =
                JSON.parse(
                    localStorage.getItem("pendingOrder")
                );

            if (
                pendingCart.length === 0 ||
                !pendingOrder
            ) {

                alert("Pending order information not found.");
                navigate("/cart");

                return;
            }

            const res = await axios.post(
    "http://localhost:1000/complete-payment",
    {
        transaction_id,
        name: pendingOrder.name,
        email: pendingOrder.email,
        phone: pendingOrder.phone,
        deliveryAddy: pendingOrder.deliveryAddy,
        items: pendingCart,
        totalPrice: pendingOrder.totalPrice
    }
);
            console.log(
                "COMPLETE PAYMENT:",
                res.data
            );

            if (res.data.success) {

    const receiptData = {
        transaction_id: transaction_id,
        name: pendingOrder.name,
        email: pendingOrder.email,
        phone: pendingOrder.phone,
        deliveryAddy: pendingOrder.deliveryAddy,
        items: pendingCart,
        totalPrice: pendingOrder.totalPrice,
        paymentStatus: "PAID"
    };

    localStorage.removeItem("cart");
    localStorage.removeItem("pendingCart");
    localStorage.removeItem("pendingOrder");

    window.dispatchEvent(
        new Event("cartUpdated")
    );

    navigate("/order-success", {
    state: {
        transaction_id: transaction_id
    }
});

}

             else {

                alert(res.data.message);
                navigate("/cart");

            }

        } catch (error) {

            console.log(error);

            alert("Unable to complete your order.");
            navigate("/cart");

        }

    };

    completePayment();

}, [location, navigate]);

    return (
<>
        <div className="payment-callback">

            <h2>Processing Payment...</h2>

            <p>
                Please wait while we confirm your payment.
            </p>
        </div>
<Footer/>
		
</>
    );

}