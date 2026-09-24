import { Link } from "react-router-dom";

function ProductTable({ products, onDelete }) {
  return (
    <div className="desktop-products">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                />
              </td>

              <td>{product.title}</td>

              <td>{product.category}</td>

              <td>${product.price}</td>

              <td>{product.rating}</td>

              <td>{product.stock}</td>

              <td className="action-buttons">
                <Link
                  to={`/products/${product.id}`}
                >
                  View
                </Link>

                <Link
                  to={`/products/${product.id}/edit`}
                >
                  Edit
                </Link>

                <button
                  onClick={() =>
                    onDelete(product.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;