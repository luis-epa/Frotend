import axios from "axios";

const apiPub = axios.create({
  baseURL: "http://localhost:3010/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPub;
