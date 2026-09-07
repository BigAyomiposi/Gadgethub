import React, { useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import { useModal } from "./ModalContext";

export default function AdminUpload() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
	const [quantity, setQuantity] = useState("");
	const { showModal, showConfirm } = useModal();
    
	
	const handleFileChange = (e) => {
    setImage(e.target.files[0]);
};
    const submitProduct = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("image", image);
        try {

            const res = await axios.post(
                "http://localhost:1000/add-product",
                formData
            );

            if(res.data.success){

                showModal("Product Uploaded Successfully");

                setName("");
                setPrice("");
				setQuantity("");
                setImage(null);

            }else{

                showModal(res.data.message);

            }

        }catch(err){

            console.log(err);

        }

    };

    return (
       <div className="admin-upload-page">
        <div className="admin-upload">

            <h1>Upload New Product</h1>

            <form onSubmit={submitProduct}>

                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    required
                />

                <br /><br />
       <input
    type="number"
    placeholder="Quantity"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
    min="0"
    required
/>

<br /><br />
      <input
    type="file"
    className="file-input"
    onChange={handleFileChange}
    required
/>
<button type="submit" className="upload-btn">
    ⬆ Upload Product
</button>
            </form>

        </div>
<Footer/>
</div>

    );

}