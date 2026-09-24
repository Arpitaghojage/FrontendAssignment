import { Link } from "react-router-dom";

function ProductCard({ product, onDelete }) {
  return (
    <div className="product-card">
      <img
        src={product.thumbnail}
        alt={product.title}
      />

      <h3>{product.title}</h3>

      <p>
        <strong>Category:</strong>{" "}
        {product.category}
      </p>

      <p>
        <strong>Price:</strong> ${product.price}
      </p>

      <p>
        <strong>Rating:</strong> {product.rating}
      </p>

      <p>
        <strong>Stock:</strong> {product.stock}
      </p>

      <div className="card-actions">
        <Link to={`/products/${product.id}`}>
          View
        </Link>

        <Link to={`/products/${product.id}/edit`}>
          Edit
        </Link>

        <button
          onClick={() => onDelete(product.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProductCard;