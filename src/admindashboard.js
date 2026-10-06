import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function AdminDashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [stats, setStats] = useState({});
    const [analytics, setAnalytics] = useState({});

 
    const [contactMessages, setContactMessages] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState( Number(localStorage.getItem("unreadMessages") || 0)
);
    const navigate = useNavigate();

    const { showModal, showConfirm } = useModal();


   

    useEffect(() => {

        if (!user) {

            navigate("/login");
            return;

        }

        if (user.isAdmin !== 1) {

            showModal(
                "Access Denied",
                "You do not have permission to access the admin dashboard."
            );

            navigate("/");

        }

    }, []);


    // ======================================================
    // LOAD ANALYTICS
    // ======================================================

    const loadAnalytics = () => {

        axios
            .get("http://localhost:1000/admin/analytics")
            .then((res) => {

                if (res.data.success) {

                    setAnalytics(res.data.analytics);

                }

            })
            .catch((err) => {

                console.log("Analytics error:", err);

            });

    };


    // ======================================================
    // LOAD PRODUCTS
    // ======================================================

    const loadProducts = () => {

        axios
            .get("http://localhost:1000/products")
            .then((res) => {

                if (res.data.success) {

                    setProducts(res.data.products);

                }

            })
            .catch((err) => {

                console.log("Products error:", err);

            });

    };


    // ======================================================
    // LOAD STATS
    // ======================================================

    const loadStats = () => {

        axios
            .get("http://localhost:1000/admin/stats")
            .then((res) => {

                if (res.data.success) {

                    setStats(res.data.stats);

                }

            })
            .catch((err) => {

                console.log("Stats error:", err);

            });

    };


    // ======================================================
    // LOAD CONTACT MESSAGES
    // ======================================================

const loadContactMessages = () => {
  setMessagesLoading(true);

  axios
    .get("http://localhost:1000/contact-messages")
    .then((res) => {
      if (res.data.success) {
        const messages = res.data.messages || [];

        setContactMessages(messages);

        // If this is the first time messages are loaded,
        // use the total number of messages as unread.
        const savedUnread = localStorage.getItem("unreadMessages");

        if (savedUnread === null) {
          setUnreadMessages(messages.length);
          localStorage.setItem(
            "unreadMessages",
            messages.length
          );
        }
      }
    })
    .catch((err) => {
      console.log("Contact messages error:", err);

      showModal(
        "Error",
        "Unable to load contact messages."
      );
    })
    .finally(() => {
      setMessagesLoading(false);
    });
};


    // ======================================================
    // LOAD EVERYTHING
    // ======================================================

    useEffect(() => {

        loadProducts();
        loadStats();
        loadAnalytics();
        loadContactMessages();

    }, []);


    // ======================================================
    // TOTAL STOCK
    // ======================================================

    const totalStock = products.reduce(
        (total, product) =>
            total + Number(product.quantity || 0),
        0
    );


    // ======================================================
    // LOW STOCK
    // ======================================================

    const lowStock = products.filter(
        (product) =>
            Number(product.quantity) > 0 &&
            Number(product.quantity) <= 5
    ).length;


    // ======================================================
    // OUT OF STOCK
    // ======================================================

    const outOfStock = products.filter(
        (product) =>
            Number(product.quantity) === 0
    ).length;


    // ======================================================
    // DELETE PRODUCT
    // ======================================================

    const deleteProduct = (id) => {

        showConfirm(
            "Delete Product",
            "Are you sure you want to delete this product?",
            () => {

                axios
                    .delete(
                        `http://localhost:1000/delete-product/${id}`
                    )
                    .then((res) => {

                        if (res.data.success) {

                            showModal(
                                "Success",
                                "Product deleted successfully."
                            );

                            loadProducts();

                        } else {

                            showModal(
                                "Error",
                                res.data.message
                            );

                        }

                    })
                    .catch((err) => {

                        console.log(
                            "DELETE ERROR:",
                            err
                        );

                        showModal(
                            "Error",
                            "Unable to delete product."
                        );

                    });

            }
        );

    };


    // ======================================================
    // UPDATE PRODUCT
    // ======================================================

    const updateProduct = () => {

        const formData = new FormData();

        formData.append(
            "name",
            editProduct.name
        );

        formData.append(
            "price",
            editProduct.price
        );

        formData.append(
            "quantity",
            editProduct.quantity
        );

        if (editProduct.newImage) {

            formData.append(
                "image",
                editProduct.newImage
            );

        }


        axios
            .put(
                `http://localhost:1000/update-product/${editProduct.id}`,
                formData
            )
            .then((res) => {

                if (res.data.success) {

                    showModal(
                        "Product Updated Successfully"
                    );

                    setEditProduct(null);

                    loadProducts();

                } else {

                    showModal(
                        res.data.message
                    );

                }

            })
            .catch((err) => {

                console.log(
                    "UPDATE PRODUCT ERROR:",
                    err
                );

                showModal(
                    "Error",
                    "Unable to update product."
                );

            });

    };


    // ======================================================
    // DELETE CONTACT MESSAGE
    // ======================================================

    const deleteContactMessage = (id) => {

        showConfirm(
            "Delete Message",
            "Are you sure you want to delete this contact message?",
            () => {

                axios
                    .delete(
                        `http://localhost:1000/contact-messages/${id}`
                    )
                    .then((res) => {

                        if (res.data.success) {

                            showModal(
                                "Success",
                                "Contact message deleted successfully."
                            );

                            loadContactMessages();

                        } else {

                            showModal(
                                "Error",
                                res.data.message ||
                                "Unable to delete message."
                            );

                        }

                    })
                    .catch((err) => {

                        console.log(
                            "DELETE MESSAGE ERROR:",
                            err
                        );

                        showModal(
                            "Error",
                            "Unable to delete contact message."
                        );

                    });

            }
        );

    };


    // ======================================================
    // IMAGE URL
    // ======================================================

    const getImageUrl = (image) => {

        if (!image) return "";

        return image.startsWith("/images/")
            ? image
            : `http://localhost:1000${image}`;

    };


    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatMessageDate = (date) => {

        if (!date) return "Unknown date";

        return new Date(date).toLocaleString(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    // ======================================================
    // OPEN CONTACT MESSAGES
    // ======================================================

    const openMessages = () => {
  setShowMessages(true);

  // Mark all current messages as read
  setUnreadMessages(0);
  localStorage.setItem("unreadMessages", "0");

  loadContactMessages();
};

    return (
        <>
            <div className="admin-dashboard">

                <div className="admin-layout">


                    {/* ==================================================
                        SIDEBAR
                    ================================================== */}

                    <div className="admin-sidebar">

                        <h2>🛍 Admin</h2>


                        <button
                            className={
                                `sidebar-btn ${
                                    !showMessages
                                        ? "active-sidebar"
                                        : ""
                                }`
                            }
                            onClick={() => {

                                setShowMessages(false);

                            }}
                        >
                            📊 Dashboard
                        </button>


                        <button
                            className="sidebar-btn"
                            onClick={() =>
                                navigate("/admin-upload")
                            }
                        >
                            ➕ Add Product
                        </button>


                        <button
                            className="sidebar-btn"
                            onClick={() =>
                                navigate("/admin-orders")
                            }
                        >
                            📦 Orders
                        </button>


                        {/* CONTACT MESSAGES */}

                        <button
                            className={
                                `sidebar-btn ${
                                    showMessages
                                        ? "active-sidebar"
                                        : ""
                                }`
                            }
                            onClick={openMessages}
                        >
                            📩 Messages

                            {unreadMessages > 0 && (
                        <span className="message-count">
                           {unreadMessages}
                             </span>
                             )}

                        </button>


                        <button
                            className="sidebar-btn logout-btn"
                            onClick={() => {

                                localStorage.removeItem(
                                    "user"
                                );

                                navigate("/login");

                            }}
                        >
                            🚪 Logout
                        </button>

                    </div>


                    {/* ==================================================
                        ADMIN CONTENT
                    ================================================== */}

                    <div className="admin-content">


                        {!showMessages ? (

                            /* ==================================================
                               MAIN DASHBOARD
                            ================================================== */

                            <>

                                <h1>
                                    📊 Admin Dashboard
                                </h1>


                                <p className="dashboard-subtitle">
                                    Welcome back, Admin 👋
                                </p>


                                {/* ==========================================
                                    ADMIN CARDS
                                ========================================== */}

                                <div className="admin-cards">


                                    <div className="admin-card">

                                        <h3>
                                            Total Products
                                        </h3>

                                        <h1>
                                            {stats.totalProducts}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Total Orders
                                        </h3>

                                        <h1>
                                            {stats.totalOrders}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Total Customers
                                        </h3>

                                        <h1>
                                            {stats.totalCustomers}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Total Revenue
                                        </h3>

                                        <h1>
                                            ₦
                                            {Number(
                                                stats.revenue || 0
                                            ).toLocaleString()}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Pending
                                        </h3>

                                        <h1>
                                            {stats.pending}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Shipped
                                        </h3>

                                        <h1>
                                            {stats.shipped}
                                        </h1>

                                    </div>


                                    <div className="admin-card">

                                        <h3>
                                            Delivered
                                        </h3>

                                        <h1>
                                            {stats.delivered}
                                        </h1>

                                    </div>


                                    <div className="admin-card stock-total-card">

                                        <h3>
                                            📦 Total Stock
                                        </h3>

                                        <h1>
                                            {totalStock}
                                        </h1>

                                        <p>
                                            Total units available
                                        </p>

                                    </div>


                                    <div className="admin-card stock-low-card">

                                        <h3>
                                            ⚠️ Low Stock
                                        </h3>

                                        <h1>
                                            {lowStock}
                                        </h1>

                                        <p>
                                            Products with 1-5 units
                                        </p>

                                    </div>


                                    <div className="admin-card stock-out-card">

                                        <h3>
                                            🚫 Out of Stock
                                        </h3>

                                        <h1>
                                            {outOfStock}
                                        </h1>

                                        <p>
                                            Products unavailable
                                        </p>

                                    </div>

                                </div>


                                {/* ==========================================
                                    ANALYTICS
                                ========================================== */}

                                <div className="analytics-cards">


                                    <div className="analytics-card revenue-card">

                                        <h3>
                                            💰 Revenue This Month
                                        </h3>

                                        <h2>
                                            ₦
                                            {Number(
                                                analytics.revenue || 0
                                            ).toLocaleString()}
                                        </h2>

                                    </div>


                                    <div className="analytics-card orders-card">

                                        <h3>
                                            🛒 Orders This Month
                                        </h3>

                                        <h2>
                                            {analytics.orders || 0}
                                        </h2>

                                    </div>


                                    <div className="analytics-card best-card">

                                        <h3>
                                            🏆 Best Seller
                                        </h3>

                                        <h2>
                                            {analytics.bestSeller?.itemOrdered ||
                                                "No sales yet"}
                                        </h2>

                                        <small>
                                            {analytics.bestSeller?.totalSold ||
                                                0}{" "}
                                            sold
                                        </small>

                                    </div>

                                </div>


                                {/* ==========================================
                                    PRODUCTS
                                ========================================== */}

                                <h1>
                                    My Products
                                </h1>


                                <table
                                    border="1"
                                    className="admin-table"
                                >

                                    <thead>

                                        <tr>

                                            <th>
                                                Image
                                            </th>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                            <th>
                                                Stock
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {products.map(
                                            (product) => (

                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                >

                                                    <td>

                                                        <img
                                                            src={getImageUrl(
                                                                product.image
                                                            )}
                                                            alt={
                                                                product.name
                                                            }
                                                            width="70"
                                                        />

                                                    </td>


                                                    <td>
                                                        {
                                                            product.name
                                                        }
                                                    </td>


                                                    <td>

                                                        ₦
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString()}

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                setEditProduct(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteProduct(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                product.quantity
                                                            }
                                                        </strong>


                                                        {Number(
                                                            product.quantity
                                                        ) === 0 && (

                                                            <span className="stock-badge out">
                                                                🔴 Out of Stock
                                                            </span>

                                                        )}


                                                        {Number(
                                                            product.quantity
                                                        ) > 0 &&
                                                            Number(
                                                                product.quantity
                                                            ) <= 5 && (

                                                                <span className="stock-badge low">
                                                                    🟡 Low Stock
                                                                </span>

                                                            )}


                                                        {Number(
                                                            product.quantity
                                                        ) > 5 && (

                                                            <span className="stock-badge good">
                                                                🟢 In Stock
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>


                                {/* ==========================================
                                    EDIT PRODUCT MODAL
                                ========================================== */}

                                {editProduct && (

                                    <div className="edit-modal-overlay">

                                        <div className="edit-modal">


                                            <button
                                                className="edit-modal-close"
                                                onClick={() =>
                                                    setEditProduct(
                                                        null
                                                    )
                                                }
                                            >
                                                ×
                                            </button>


                                            <h2>
                                                ✏️ Edit Product
                                            </h2>


                                            <div className="edit-form">


                                                <label>
                                                    Product Name
                                                </label>


                                                <input
                                                    type="text"
                                                    value={
                                                        editProduct.name
                                                    }
                                                    onChange={(e) =>
                                                        setEditProduct({
                                                            ...editProduct,
                                                            name: e
                                                                .target
                                                                .value
                                                        })
                                                    }
                                                />


                                                <label>
                                                    Price
                                                </label>


                                                <input
                                                    type="number"
                                                    value={
                                                        editProduct.price
                                                    }
                                                    onChange={(e) =>
                                                        setEditProduct({
                                                            ...editProduct,
                                                            price: e
                                                                .target
                                                                .value
                                                        })
                                                    }
                                                />


                                                <label>
                                                    Quantity / Stock
                                                </label>


                                                <input
                                                    type="number"
                                                    value={
                                                        editProduct.quantity
                                                    }
                                                    onChange={(e) =>
                                                        setEditProduct({
                                                            ...editProduct,
                                                            quantity: e
                                                                .target
                                                                .value
                                                        })
                                                    }
                                                />


                                                <label>
                                                    Change Image
                                                </label>


                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        setEditProduct({
                                                            ...editProduct,
                                                            newImage:
                                                                e
                                                                    .target
                                                                    .files[0]
                                                        })
                                                    }
                                                />


                                                <div className="edit-modal-buttons">


                                                    <button
                                                        className="cancel-edit-btn"
                                                        onClick={() =>
                                                            setEditProduct(
                                                                null
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>


                                                    <button
                                                        className="update-btn"
                                                        onClick={
                                                            updateProduct
                                                        }
                                                    >
                                                        💾 Update Product
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </>

                        ) : (

                            /* ==================================================
                               CONTACT MESSAGES
                            ================================================== */

                            <div className="contact-messages-admin">


                                <div className="messages-header">

                                    <div>

                                        <h1>
                                            📩 Contact Messages
                                        </h1>

                                        <p>
                                            Messages sent by customers
                                            through the Contact Us form.
                                        </p>

                                    </div>


                                    <button
                                        className="refresh-messages-btn"
                                        onClick={
                                            loadContactMessages
                                        }
                                    >
                                        🔄 Refresh
                                    </button>

                                </div>


                                {messagesLoading ? (

                                    <div className="messages-loading">

                                        <div className="message-spinner"></div>

                                        <p>
                                            Loading messages...
                                        </p>

                                    </div>

                                ) : contactMessages.length === 0 ? (

                                    <div className="no-messages">

                                        <div className="no-messages-icon">
                                            📭
                                        </div>

                                        <h2>
                                            No Messages Yet
                                        </h2>

                                        <p>
                                            Customer messages will
                                            appear here.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="messages-list">

                                        {contactMessages.map(
                                            (msg) => (

                                                <div
                                                    className="contact-message-card"
                                                    key={msg.id}
                                                >

                                                    <div className="message-card-top">


                                                        <div className="message-sender">

                                                            <div className="sender-avatar">
                                                                {msg.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>


                                                            <div>

                                                                <h3>
                                                                    {
                                                                        msg.name
                                                                    }
                                                                </h3>

                                                                <a
                                                                    href={`mailto:${msg.email}`}
                                                                    className="message-email"
                                                                >
                                                                    {
                                                                        msg.email
                                                                    }
                                                                </a>

                                                            </div>

                                                        </div>


                                                        <span className="message-date">
                                                            🕒{" "}
                                                            {formatMessageDate(
                                                                msg.created_at
                                                            )}
                                                        </span>

                                                    </div>


                                                    <div className="message-body">

                                                        <p>
                                                            {
                                                                msg.message
                                                            }
                                                        </p>

                                                    </div>


                                                    <div className="message-actions">

                                                        <a
                                                            href={`mailto:${msg.email}?subject=Re:%20Your%20message%20to%20Possy's%20Gadget%20Hub`}
                                                            className="reply-message-btn"
                                                        >
                                                            📧 Reply
                                                        </a>


                                                        <button
                                                            className="delete-message-btn"
                                                            onClick={() =>
                                                                deleteContactMessage(
                                                                    msg.id
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>


            <Footer />

        </>
    );
}

