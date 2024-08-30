import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:3010/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export default apiAuth;
