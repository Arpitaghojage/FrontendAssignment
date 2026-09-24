import axiosInstance from "./axiosInstance";

export const loginUser = async (username, password) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  return response.data;
};