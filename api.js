import axios from "axios";

const baseURL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL,
});

const setAuthToken = (token) => {
  axiosInstance.defaults.headers.common = {
    auth: token,
  };
};

if (localStorage.getItem("token")) setAuthToken(localStorage.getItem("token"));

export { setAuthToken, baseURL };
export default axiosInstance;
