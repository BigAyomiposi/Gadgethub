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
    const navigate = useNavigate();
	const [analytics, setAnalytics] = useState({});
	const { showModal, showConfirm } = useModal();
	
	
	useEffect(() => {

    if (!user) {

        navigate("/login");
        return;

    }

    if (user.isAdmin !== 1) {

        showModal("Access Denied");

        navigate("/");

    }

}, []);
	
	
	const loadAnalytics = () => {

    axios.get("http://localhost:1000/admin/analytics")
    .then((res) => {

        if(res.data.success){

            setAnalytics(res.data.analytics);

        }

    });

};
  

    const loadProducts = () => {

        axios
            .get("http://localhost:1000/products")
            .then((res) => {

                if (res.data.success) {
                    setProducts(res.data.products);
                }

            })
            .catch((err) => {
                console.log(err);
            });

    };
	const loadStats = () => {

    axios.get("http://localhost:1000/admin/stats")
    .then((res)=>{

        if(res.data.success){

            setStats(res.data.stats);

        }

    });

};
useEffect(() => {

    loadProducts();
    loadStats();
	 loadAnalytics();

}, []);


const totalStock = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0
);

const lowStock = products.filter(
    (product) =>
        Number(product.quantity) > 0 &&
        Number(product.quantity) <= 5
).length;

const outOfStock = products.filter(
    (product) => Number(product.quantity) === 0
).length;
	
	
	const deleteProduct = (id) => {

    showConfirm(
        "Delete Product",
        "Are you sure you want to delete this product?",
        () => {

            console.log("Deleting product ID:", id);

            axios.delete(`http://localhost:1000/delete-product/${id}`)
                .then((res) => {

                    console.log("DELETE RESPONSE:", res.data);

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

                    console.log("DELETE ERROR:", err);

                    showModal(
                        "Error",
                        "Unable to delete product."
                    );

                });

        }
    );

};
const updateProduct = () => {

    const formData = new FormData();

    formData.append("name", editProduct.name);
    formData.append("price", editProduct.price);
    formData.append("quantity", editProduct.quantity);
    if(editProduct.newImage){
        formData.append("image", editProduct.newImage);
    }

    axios.put(
        `http://localhost:1000/update-product/${editProduct.id}`,
        formData
    )
    .then((res) => {

        if(res.data.success){

            showModal("Product Updated Successfully");

            setEditProduct(null);

            loadProducts();

        }else{

            showModal(res.data.message);

        }

    })
    .catch((err)=>{

        console.log(err);

    });

};
const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("/images/")
        ? image
        : `http://localhost:1000${image}`;
};
    return (
	<>
        <div className="admin-dashboard">
<div className="admin-layout">

    <div className="admin-sidebar">

        <h2>🛍 Admin</h2>

        <button
    className="sidebar-btn active-sidebar"
    onClick={() => navigate("/admin")}
>
    📊 Dashboard
</button>

        <button
            className="sidebar-btn"
            onClick={() => navigate("/admin-upload")}
        >
            ➕ Add Product
        </button>

        <button
            className="sidebar-btn"
            onClick={() => navigate("/admin-orders")}
        >
            📦 Orders
        </button>

        <button
            className="sidebar-btn logout-btn"
            onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
            }}
        >
            🚪 Logout
        </button>

    </div>

    <div className="admin-content">
	<h1>📊 Admin Dashboard</h1>

<p className="dashboard-subtitle">
    Welcome back, Admin 👋
</p>
			<div className="admin-cards">

    <div className="admin-card">
        <h3>Total Products</h3>
        <h1>{stats.totalProducts}</h1>
		
    </div>

    <div className="admin-card">
        <h3>Total Orders</h3>
        <h1>{stats.totalOrders}</h1>
    </div>

    <div className="admin-card">
        <h3>Total Customers</h3>
        <h1>{stats.totalCustomers}</h1>
    </div>

    <div className="admin-card">
        <h3>Total Revenue</h3>
        <h1>₦{Number(stats.revenue || 0).toLocaleString()}</h1>
    </div>

    <div className="admin-card">
        <h3>Pending</h3>
        <h1>{stats.pending}</h1>
    </div>

    <div className="admin-card">
        <h3>Shipped</h3>
        <h1>{stats.shipped}</h1>
    </div>

    <div className="admin-card">
        <h3>Delivered</h3>
        <h1>{stats.delivered}</h1>
    </div>
<div className="admin-card stock-total-card">
    <h3>📦 Total Stock</h3>
    <h1>{totalStock}</h1>
    <p>Total units available</p>
</div>

<div className="admin-card stock-low-card">
    <h3>⚠️ Low Stock</h3>
    <h1>{lowStock}</h1>
    <p>Products with 1-5 units</p>
</div>

<div className="admin-card stock-out-card">
    <h3>🚫 Out of Stock</h3>
    <h1>{outOfStock}</h1>
    <p>Products unavailable</p>
</div>
</div>
<div className="analytics-cards">

    <div className="analytics-card revenue-card">
        <h3>💰 Revenue This Month</h3>
        <h2>₦{Number(analytics.revenue || 0).toLocaleString()}</h2>
    </div>

    <div className="analytics-card orders-card">
        <h3>🛒 Orders This Month</h3>
        <h2>{analytics.orders || 0}</h2>
    </div>

    <div className="analytics-card best-card">
        <h3>🏆 Best Seller</h3>
        <h2>{analytics.bestSeller?.itemOrdered}</h2>
        <small>{analytics.bestSeller?.totalSold} sold</small>
    </div>

</div>
               <h1>My Products</h1>
            <table border = "1" className="admin-table">

                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
						<th>Stock</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map((product) => (

                        <tr key={product.id}>

                            <td>
                                <img src={getImageUrl(product.image)} alt={product.name} width="70"/>
                            </td>

                            <td>{product.name}</td>

                            <td>
                                ₦{Number(product.price).toLocaleString()}
                            </td>

                            <td>

                                <button className="edit-btn" onClick={() => setEditProduct(product)} > ✏️ Edit </button>

                                <button className="delete-btn" onClick={() => deleteProduct(product.id)} >🗑 Delete </button>

                            </td>
							<td>

    <strong>{product.quantity}</strong>

    {Number(product.quantity) === 0 && (
        <span className="stock-badge out">
            🔴 Out of Stock
        </span>
    )}

    {Number(product.quantity) > 0 &&
     Number(product.quantity) <= 5 && (
        <span className="stock-badge low">
            🟡 Low Stock
        </span>
    )}

    {Number(product.quantity) > 5 && (
        <span className="stock-badge good">
            🟢 In Stock
        </span>
    )}

</td>

                        </tr>

                    ))}

                </tbody>

            </table>
  {editProduct && (

    <div className="edit-modal-overlay">

        <div className="edit-modal">

            <button
                className="edit-modal-close"
                onClick={() => setEditProduct(null)}
            >
                ×
            </button>

            <h2>✏️ Edit Product</h2>

            <div className="edit-form">

                <label>Product Name</label>

                <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                        setEditProduct({
                            ...editProduct,
                            name: e.target.value
                        })
                    }
                />


                <label>Price</label>

                <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                        setEditProduct({
                            ...editProduct,
                            price: e.target.value
                        })
                    }
                />


                <label>Quantity / Stock</label>

                <input
                    type="number"
                    value={editProduct.quantity}
                    onChange={(e) =>
                        setEditProduct({
                            ...editProduct,
                            quantity: e.target.value
                        })
                    }
                />


                <label>Change Image</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setEditProduct({
                            ...editProduct,
                            newImage: e.target.files[0]
                        })
                    }
                />


                <div className="edit-modal-buttons">

                    <button
                        className="cancel-edit-btn"
                        onClick={() => setEditProduct(null)}
                    >
                        Cancel
                    </button>

                    <button
                        className="update-btn"
                        onClick={updateProduct}
                    >
                        💾 Update Product
                    </button>

                </div>

            </div>

        </div>

    </div>

)}

        </div> 

    </div> 

</div> 
<Footer/>
</>
    );
}