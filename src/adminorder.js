import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
	const { showModal, showConfirm } = useModal();

    const navigate = useNavigate();


   
    const loadOrders = () => {

        axios
            .get("http://localhost:1000/admin/orders")
            .then((res) => {

                if (res.data.success) {

                    setOrders(res.data.orders);

                    groupOrders(res.data.orders);

                }

            })
            .catch((err) => {

                console.log(err);

            });

    };


    // ==============================
    // GROUP ORDERS BY TRANSACTION
    // ==============================

    const groupOrders = (orderList) => {

        const grouped = {};

        orderList.forEach((order) => {

            const transactionId =
                order.transaction_id;

            if (!transactionId) {
                return;
            }


            if (!grouped[transactionId]) {

                grouped[transactionId] = {

                    transaction_id:
                        transactionId,

                    name:
                        order.name,

                    email:
                        order.email,

                    phoneNo:
                        order.phoneNo,

                    deliveryAddy:
                        order.deliveryAddy,

                    status:
                        order.status,

                    orderDate:
                        order.orderDate,

                    items: [],

                    totalPrice: 0

                };

            }


            grouped[transactionId].items.push(order);


            grouped[transactionId].totalPrice +=
                Number(order.Price || 0);

        });


        setGroupedOrders(
            Object.values(grouped)
        );

    };


    useEffect(() => {

        loadOrders();

    }, []);


    // ==============================
    // UPDATE ENTIRE ORDER STATUS
    // ==============================

    const updateStatus = (transaction_id, status) => {

        axios.put(
            `http://localhost:1000/admin/orders/transaction/${transaction_id}`,
            {
                status
            }
        )
        .then((res) => {

            if (res.data.success) {

                showModal("Order Updated Successfully");

                loadOrders();

            } else {

               showModal(res.data.message);

            }

        })
        .catch((err) => {

            console.log(err);

            showModal("Unable to update order");

        });

    };


    // ==============================
    // DELETE ENTIRE ORDER
    // ==============================

    const deleteOrder = (transaction_id) => {

    showConfirm(
        "Delete Order",
        "Are you sure you want to delete this entire order?",
        () => {

            axios
                .delete(
                    `http://localhost:1000/admin/orders/transaction/${transaction_id}`
                )
                .then((res) => {

                    if (res.data.success) {

                        showModal(
                            "Success",
                            "Order deleted successfully."
                        );

                        loadOrders();

                    } else {

                        showModal(
                            "Error",
                            res.data.message
                        );

                    }

                })
                .catch((err) => {

                    console.log(err);

                    showModal(
                        "Error",
                        "Unable to delete order."
                    );

                });

        }
    );

};

    // ==============================
    // FILTER ORDERS
    // ==============================

    const filteredOrders =
        groupedOrders.filter((order) => {

            const searchText =
                search.toLowerCase();


            const matchesSearch =

                String(
                    order.transaction_id || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                (order.name || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (order.email || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (order.phoneNo || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                (order.deliveryAddy || "")
                    .toLowerCase()
                    .includes(searchText)

                ||

                order.items.some((item) =>

                    (item.itemOrdered || "")
                        .toLowerCase()
                        .includes(searchText)

                );


            const matchesStatus =

                statusFilter === "All"

                ||

                order.status ===
                    statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    return (
    <>
        <div className="admin-dashboard">

            <h1>📦 All Customer Orders</h1>


            {/* SEARCH */}

            <input
                type="text"
                className="search-input"
                placeholder="🔍 Search by customer, email, product or transaction..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />


            {/* FILTERS */}

            <div className="filter-buttons">

                <button
                    className={
                        statusFilter === "All"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("All")
                    }
                >
                    All
                </button>


                <button
                    className={
                        statusFilter === "Pending"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("Pending")
                    }
                >
                    Pending
                </button>


                <button
                    className={
                        statusFilter === "Processing"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("Processing")
                    }
                >
                    Processing
                </button>


                <button
                    className={
                        statusFilter === "Shipped"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("Shipped")
                    }
                >
                    Shipped
                </button>


                <button
                    className={
                        statusFilter === "Delivered"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("Delivered")
                    }
                >
                    Delivered
                </button>


                <button
                    className={
                        statusFilter === "Cancelled"
                            ? "active-filter"
                            : ""
                    }
                    onClick={() =>
                        setStatusFilter("Cancelled")
                    }
                >
                    Cancelled
                </button>

            </div>


           

            {/* ORDERS */}

<table border="1" className="admin-table">

    <thead>
        <tr>
            <th>Transaction ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>

        {filteredOrders.length === 0 ? (

            <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "30px" }}>
                    No orders found.
                </td>
            </tr>

        ) : (

            filteredOrders.map((order) => {

                return (
                    <tr key={order.transaction_id}>

                        {/* TRANSACTION ID */}

                        <td>
                            <strong className="transaction-id">
                                #{order.transaction_id}
                            </strong>
                        </td>


                        {/* CUSTOMER */}

                        <td>
                            {order.name}
                        </td>


                        {/* EMAIL */}

                        <td>
                            {order.email}
                        </td>


                        {/* PRODUCTS */}

                        <td>

                            <div className="admin-products-list">

                                {order.items.map((item) => {

                                    return (
                                        <div
                                            className="admin-product-row"
                                            key={item.id}
                                        >

                                            <span>
                                                {item.itemOrdered}
                                                {" × "}
                                                {item.Quantity}
                                            </span>

                                            <strong>
                                                ₦
                                                {Number(
                                                    item.Price
                                                ).toLocaleString()}
                                            </strong>

                                        </div>
                                    );

                                })}

                            </div>

                        </td>


                        {/* TOTAL */}

                        <td>

                            <strong>
                                ₦
                                {Number(
                                    order.totalPrice
                                ).toLocaleString()}
                            </strong>

                        </td>


                        {/* STATUS */}

                        <td>

                            <select
                                value={order.status}
                                onChange={(e) =>
                                    updateStatus(
                                        order.transaction_id,
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Processing">
                                    Processing
                                </option>

                                <option value="Shipped">
                                    Shipped
                                </option>

                                <option value="Delivered">
                                    Delivered
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>

                            </select>

                        </td>


                        {/* DATE */}

                        <td>

                            {order.orderDate
                                ? new Date(
                                    order.orderDate
                                ).toLocaleDateString()
                                : "N/A"
                            }

                        </td>


                        {/* ACTIONS */}

                        <td>

                            <button
                                className="view-btn"
                                onClick={() =>
                                    setSelectedOrder(order)
                                }
                            >
                                👁 View
                            </button>


                            <button
                                className="receipt-btn"
                                onClick={() =>
                                    navigate(
                                        `/receipt/${order.transaction_id}`
                                    )
                                }
                            >
                                🧾 Receipt
                            </button>


                            <button
                                className="delete-btn"
                                onClick={() =>
                                    deleteOrder(
                                        order.transaction_id
                                    )
                                }
                            >
                                🗑 Delete
                            </button>

                        </td>

                    </tr>
                );

            })

        )}

    </tbody>

</table>


                            


            {/* VIEW MODAL */}

            {selectedOrder && (

                <div className="modal-overlay">

                    <div className="order-modal">

                        <h2>
                            📦 Order Details
                        </h2>


                        <div className="modal-transaction">

                            <span>
                                Transaction ID
                            </span>

                            <strong>
                                {
                                    selectedOrder.transaction_id
                                }
                            </strong>

                        </div>


                        <p>
                            <strong>
                                Customer:
                            </strong>{" "}
                            {selectedOrder.name}
                        </p>


                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {selectedOrder.email}
                        </p>


                        <p>
                            <strong>
                                Phone:
                            </strong>{" "}
                            {selectedOrder.phoneNo}
                        </p>


                        <p>
                            <strong>
                                Delivery Address:
                            </strong>{" "}
                            {
                                selectedOrder.deliveryAddy
                            }
                        </p>

                   <table border= "1" className="admin-table">

    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
        </tr>
    </thead>

    <tbody>

        {selectedOrder.items.map((item) => (

            <tr key={item.id}>

                <td>
                    {item.itemOrdered}
                </td>

                <td>
                    {item.Quantity}
                </td>

                <td>
                    ₦{Number(item.Price).toLocaleString()}
                </td>

            </tr>

        ))}

        <tr className="order-total-row">

            <td colSpan="2">
                <strong>Total</strong>
            </td>

            <td>
                <strong>
                    ₦{Number(
                        selectedOrder.totalPrice
                    ).toLocaleString()}
                </strong>
            </td>

        </tr>

    </tbody>

</table>

                        <p>

                            <strong>
                                Status:
                            </strong>{" "}

                            <span
                                className={
                                    `status-badge ${
                                        selectedOrder.status
                                            ?.toLowerCase()
                                    }`
                                }
                            >
                                {
                                    selectedOrder.status
                                }
                            </span>

                        </p>


                        <p>

                            <strong>
                                Order Date:
                            </strong>{" "}

                            {selectedOrder.orderDate
                                ? new Date(
                                    selectedOrder.orderDate
                                ).toLocaleString()
                                : "N/A"
                            }

                        </p>


                        <div className="modal-buttons">

                            <button
                                className="receipt-btn"
                                onClick={() => {

                                    setSelectedOrder(
                                        null
                                    );

                                    navigate(
                                        `/receipt/${selectedOrder.transaction_id}`
                                    );

                                }}
                            >
                                🧾 View Receipt
                            </button>


                            <button
                                className="close-btn"
                                onClick={() =>
                                    setSelectedOrder(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

       

        </div>
     <Footer />
	 </>
    );

}