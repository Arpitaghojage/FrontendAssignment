import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ProductTable from "../components/ProductTable";
import ProductCard from "../components/ProductCard";

import {
  deleteProductApi,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "../api/productApi";

import { useProducts } from "../context/ProductContext";

const PAGE_SIZES = [10, 20, 50];

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const {
    addedProducts,
    applyLocalChanges,
    deleteLocalProduct,
  } = useProducts();

  const rawPage = Number(
    searchParams.get("page")
  );

  const rawLimit = Number(
    searchParams.get("limit")
  );

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit = PAGE_SIZES.includes(rawLimit)
    ? rawLimit
    : 10;

  const query =
    searchParams.get("search") || "";

  const category =
    searchParams.get("category") || "";

  const sortBy =
    searchParams.get("sortBy") || "title";

  const order =
    searchParams.get("order") === "desc"
      ? "desc"
      : "asc";

  const [searchInput, setSearchInput] =
    useState(query);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] =
    useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  const skip = (page - 1) * limit;

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() =>
        console.error(
          "Failed to load categories"
        )
      );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput === query) return;

      const params = new URLSearchParams(
        searchParams
      );

      if (searchInput.trim()) {
        params.set(
          "search",
          searchInput.trim()
        );
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchInput,
    query,
    searchParams,
    setSearchParams,
  ]);

  const loadProducts = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      let data;

      if (query) {
        data = await searchProducts({
          query,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      } else if (category) {
        data = await getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      } else {
        data = await getProducts({
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
      }

      let result = applyLocalChanges(
        data.products
      );


      if (query && category) {
        result = result.filter(
          (product) =>
            product.category === category
        );
      }

      if (
        page === 1 &&
        !query &&
        !category
      ) {
        result = [
          ...addedProducts,
          ...result,
        ];
      }

      setProducts(result);
      setTotal(data.total);
    } catch (error) {
      if (
        error.name !== "CanceledError" &&
        error.code !== "ERR_CANCELED"
      ) {
        setError(
          "Failed to load products."
        );
      }
    } finally {
      if (
        abortControllerRef.current ===
        controller
      ) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadProducts();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [
    page,
    limit,
    query,
    category,
    sortBy,
    order,
  ]);

  useEffect(() => {
    if (
      total > 0 &&
      page > totalPages
    ) {
      const params = new URLSearchParams(
        searchParams
      );

      params.set(
        "page",
        String(totalPages)
      );

      setSearchParams(params, {
        replace: true,
      });
    }
  }, [
    page,
    total,
    totalPages,
    searchParams,
    setSearchParams,
  ]);

  const updateParam = (
    name,
    value,
    resetPage = true
  ) => {
    const params = new URLSearchParams(
      searchParams
    );

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    if (resetPage) {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    updateParam(
      "page",
      String(newPage),
      false
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProductApi(id);

      deleteLocalProduct(id);

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product.id !== id
        )
      );
    } catch {
      alert(
        "Failed to delete product."
      );
    }
  };

  const showingStart =
    total === 0
      ? 0
      : skip + 1;

  const showingEnd = Math.min(
    skip + limit,
    total
  );

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="page-heading">
          <div>
            <h1>Products</h1>

            <p>
              Manage your product catalogue.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/products/add")
            }
          >
            Add Product
          </button>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
          />

          <select
            value={category}
            onChange={(event) =>
              updateParam(
                "category",
                event.target.value
              )
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map(
              (categoryItem) => (
                <option
                  key={
                    categoryItem.slug
                  }
                  value={
                    categoryItem.slug
                  }
                >
                  {categoryItem.name}
                </option>
              )
            )}
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              updateParam(
                "sortBy",
                event.target.value
              )
            }
          >
            <option value="title">
              Sort by Title
            </option>

            <option value="price">
              Sort by Price
            </option>

            <option value="rating">
              Sort by Rating
            </option>
          </select>

          <select
            value={order}
            onChange={(event) =>
              updateParam(
                "order",
                event.target.value
              )
            }
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>

          <select
            value={limit}
            onChange={(event) =>
              updateParam(
                "limit",
                event.target.value
              )
            }
          >
            <option value="10">
              10 per page
            </option>

            <option value="20">
              20 per page
            </option>

            <option value="50">
              50 per page
            </option>
          </select>
        </div>

        {query && category && (
          <div className="info-message">
            Search is handled by DummyJSON
            first. Category filtering is
            then applied to the returned
            search results because DummyJSON
            does not support both operations
            together.
          </div>
        )}

        {loading && <Loader />}

        {!loading && error && (
          <div className="error-state">
            <p>{error}</p>

            <button onClick={loadProducts}>
              Retry
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="empty-state">
              <h2>No products found</h2>

              <p>
                Try changing the search or
                filters.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <ProductTable
                products={products}
                onDelete={handleDelete}
              />

              <div className="mobile-products">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={
                        handleDelete
                      }
                    />
                  )
                )}
              </div>

              <div className="pagination-info">
                Showing {showingStart}–
                {showingEnd} of {total}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={
                  handlePageChange
                }
              />
            </>
          )}
      </main>
    </>
  );
}

export default Products;