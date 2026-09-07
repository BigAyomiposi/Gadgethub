import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./receipt.css";

export default function Receipt() {

  const { transaction_id } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const getReceipt = async () => {

      try {

        const res = await axios.get(
          `http://localhost:1000/receipt/${transaction_id}`
        );

        console.log("RECEIPT:", res.data);

        if (res.data.success) {

          setReceipt(res.data.receipt);

        } else {

          setError(res.data.message);

        }

      } catch (err) {

        console.log("RECEIPT ERROR:", err);

        setError("Unable to load receipt.");

      } finally {

        setLoading(false);

      }

    };

    getReceipt();

  }, [transaction_id]);


  if (loading) {

    return (
      <div className="receipt-page">

        <div className="receipt-card loading-receipt">

          <div className="loading-spinner"></div>

          <h2>Loading Receipt...</h2>

          <p>
            Please wait while we retrieve your receipt.
          </p>

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="receipt-page">

        <div className="receipt-card error-receipt">

          <div className="error-icon">
            !
          </div>

          <h2>Receipt Not Found</h2>

          <p>{error}</p>

          <Link to="/dashboard">

            <button className="back-btn">
              Back To Dashboard
            </button>

          </Link>

        </div>

      </div>
    );

  }


  return (
    <div className="receipt-page">

      <div className="receipt-card">

        {/* HEADER */}

        <div className="receipt-header">

          <div className="receipt-logo">
            PGH
          </div>

          <h1>
            Possy's Gadget Hub
          </h1>

          <p>
            Your trusted gadget store
          </p>

          <div className="receipt-title">
            PAYMENT RECEIPT
          </div>

        </div>


        {/* PAYMENT STATUS */}

        <div className="receipt-status">

          <span className="status-check">
            ✓
          </span>

          <div>

            <strong>
              Payment Successful
            </strong>

            <span>
              Your payment has been confirmed
            </span>

          </div>

        </div>


        {/* TRANSACTION INFORMATION */}

        <div className="transaction-section">

          <div className="transaction-item">

            <span>
              Transaction ID
            </span>

            <strong>
              {receipt.transaction_id}
            </strong>

          </div>


          <div className="transaction-item">

            <span>
              Payment Status
            </span>

            <strong className="paid-text">
              PAID
            </strong>

          </div>


          <div className="transaction-item">

            <span>
              Date
            </span>

            <strong>
              {new Date().toLocaleDateString()}
            </strong>

          </div>

        </div>


        {/* CUSTOMER */}

        <div className="receipt-section">

          <h3>
            Customer Information
          </h3>

          <div className="customer-grid">

            <div>

              <span>Name</span>

              <strong>
                {receipt.name}
              </strong>

            </div>


            <div>

              <span>Email</span>

              <strong>
                {receipt.email}
              </strong>

            </div>


            <div>

              <span>Phone</span>

              <strong>
                {receipt.phone}
              </strong>

            </div>


            <div className="address-field">

              <span>Delivery Address</span>

              <strong>
                {receipt.deliveryAddy}
              </strong>

            </div>

          </div>

        </div>


        {/* ORDER */}

        <div className="receipt-section">

          <h3>
            Order Details
          </h3>

          <div className="items-table">

            <div className="items-header">

              <span>
                Product
              </span>

              <span>
                Qty
              </span>

              <span>
                Unit Price
              </span>

              <span>
                Total
              </span>

            </div>


            {receipt.items.map((item) => {

              const quantity =
                Number(item.Quantity);

              const total =
                Number(item.Price);

              const unitPrice =
                quantity > 0
                  ? total / quantity
                  : total;

              return (

                <div
                  className="item-row"
                  key={item.id}
                >

                  <span className="product-name">
                    {item.itemOrdered}
                  </span>

                  <span>
                    {quantity}
                  </span>

                  <span>
                    ₦{unitPrice.toLocaleString()}
                  </span>

                  <strong>
                    ₦{total.toLocaleString()}
                  </strong>

                </div>

              );

            })}

          </div>

        </div>


        {/* TOTAL */}

        <div className="receipt-summary">

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₦{Number(
                receipt.totalPrice
              ).toLocaleString()}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong>
              Free
            </strong>

          </div>


          <div className="summary-total">

            <span>
              Total Paid
            </span>

            <strong>
              ₦{Number(
                receipt.totalPrice
              ).toLocaleString()}
            </strong>

          </div>

        </div>


        {/* FOOTER */}

        <div className="receipt-footer">

          <p>
            Thank you for shopping with
            <strong> Possy's Gadget Hub</strong>.
          </p>

          <span>
            Please keep this receipt for your records.
          </span>

        </div>


        {/* BUTTONS */}

        <div className="receipt-buttons">

          <button
            className="print-btn"
            onClick={() => window.print()}
          >
            🖨️ Print Receipt
          </button>


          <Link to="/dashboard">

            <button className="back-btn">
              View My Orders
            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}