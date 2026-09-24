import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import Loader from "../components/Loader";

import {
  getProductById,
  updateProductApi,
} from "../api/productApi";

import { useProducts } from "../context/ProductContext";

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    updatedProducts,
    addedProducts,
    updateLocalProduct,
  } = useProducts();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const numericId = Number(id);

      const localAdded =
        addedProducts.find(
          (product) =>
            product.id === numericId
        );

      if (localAdded) {
        setProduct(localAdded);
        setLoading(false);
        return;
      }

      if (
        updatedProducts[numericId]
      ) {
        setProduct(
          updatedProducts[numericId]
        );

        setLoading(false);
        return;
      }

      try {
        const data =
          await getProductById(
            numericId
          );

        setProduct(data);
      } catch {
        alert(
          "Product could not be loaded."
        );

        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [
    id,
    addedProducts,
    updatedProducts,
    navigate,
  ]);

  const handleUpdate = async (
    formData
  ) => {
    try {
      const updated =
        await updateProductApi(
          id,
          formData
        );

      const finalProduct = {
        ...product,
        ...updated,
        ...formData,
        id: Number(id),
      };

      updateLocalProduct(
        finalProduct
      );

      alert(
        "Product updated successfully."
      );

      navigate(
        `/products/${id}`
      );
    } catch {
      alert(
        "Failed to update product."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <main className="form-page">
        <h1>Edit Product</h1>

        <ProductForm
          initialValues={product}
          onSubmit={handleUpdate}
          buttonText="Save Changes"
        />
      </main>
    </>
  );
}

export default EditProduct;