import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

import { getProductById } from "../api/productApi";

import { useProducts } from "../context/ProductContext";

function ProductDetails() {
  const { id } = useParams();

  const {
    updatedProducts,
    deletedProductIds,
    addedProducts,
  } = useProducts();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const numericId = Number(id);

      if (
        !Number.isInteger(numericId) ||
        numericId <= 0
      ) {
        setError("not-found");
        setLoading(false);
        return;
      }

      if (
        deletedProductIds.includes(
          numericId
        )
      ) {
        setError("not-found");
        setLoading(false);
        return;
      }

      const addedProduct =
        addedProducts.find(
          (item) =>
            item.id === numericId
        );

      if (addedProduct) {
        setProduct(addedProduct);
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
      } catch (error) {
        if (
          error.response?.status === 404
        ) {
          setError("not-found");
        } else {
          setError("general");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [
    id,
    addedProducts,
    updatedProducts,
    deletedProductIds,
  ]);

  if (loading) {
    return <Loader />;
  }

  if (error === "not-found") {
    return (
      <>
        <Navbar />

        <div className="not-found">
          <h1>Product Not Found</h1>

          <p>
            This product does not exist.
          </p>

          <Link to="/products">
            Back to Products
          </Link>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <p>
        Failed to load product.
      </p>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <Link to="/products">
          ← Back
        </Link>

        <div className="product-details">
          <div className="product-images">
            {product.images?.map(
              (image) => (
                <img
                  key={image}
                  src={image}
                  alt={product.title}
                />
              )
            )}
          </div>

          <div>
            <h1>{product.title}</h1>

            <p>{product.description}</p>

            <h2>
              ${product.price}
            </h2>

            <p>
              Category:{" "}
              {product.category}
            </p>

            <p>
              Rating: {product.rating}
            </p>

            <p>
              Stock: {product.stock}
            </p>

            <Link
              to={`/products/${product.id}/edit`}
            >
              Edit Product
            </Link>
          </div>
        </div>

        <section className="reviews">
          <h2>Reviews</h2>

          {product.reviews?.length ? (
            product.reviews.map(
              (review, index) => (
                <div
                  className="review"
                  key={index}
                >
                  <strong>
                    {review.reviewerName}
                  </strong>

                  <p>
                    Rating:{" "}
                    {review.rating}/5
                  </p>

                  <p>
                    {review.comment}
                  </p>
                </div>
              )
            )
          ) : (
            <p>No reviews available.</p>
          )}
        </section>
      </main>
    </>
  );
}

export default ProductDetails;