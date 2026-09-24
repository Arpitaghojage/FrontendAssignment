import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

import { addProductApi } from "../api/productApi";

import { useProducts } from "../context/ProductContext";

function AddProduct() {
  const navigate = useNavigate();

  const { addLocalProduct } =
    useProducts();

  const handleAdd = async (
    formData
  ) => {
    try {
      const createdProduct =
        await addProductApi(
          formData
        );

      addLocalProduct({
        ...createdProduct,
        thumbnail:
          "https://placehold.co/100x100?text=Product",
        images: [
          "https://placehold.co/500x400?text=Product",
        ],
        reviews: [],
      });

      alert(
        "Product added successfully."
      );

      navigate("/products");
    } catch {
      alert(
        "Failed to add product."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <h1>Add Product</h1>

        <ProductForm
          onSubmit={handleAdd}
          buttonText="Add Product"
        />
      </main>
    </>
  );
}

export default AddProduct;