import axiosInstance from "./axiosInstance";

export const getProducts = async ({
  limit,
  skip,
  sortBy,
  order,
  signal,
}) => {
  const response = await axiosInstance.get("/products", {
    params: {
      limit,
      skip,
      sortBy,
      order,
    },
    signal,
  });

  return response.data;
};

export const searchProducts = async ({
  query,
  limit,
  skip,
  sortBy,
  order,
  signal,
}) => {
  const response = await axiosInstance.get("/products/search", {
    params: {
      q: query,
      limit,
      skip,
      sortBy,
      order,
    },
    signal,
  });

  return response.data;
};

export const getProductsByCategory = async ({
  category,
  limit,
  skip,
  sortBy,
  order,
  signal,
}) => {
  const response = await axiosInstance.get(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
        sortBy,
        order,
      },
      signal,
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get("/products/categories");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const addProductApi = async (product) => {
  const response = await axiosInstance.post("/products/add", product);
  return response.data;
};

export const updateProductApi = async (id, product) => {
  const response = await axiosInstance.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};