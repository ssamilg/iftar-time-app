import axios from "axios";

axios.defaults.baseURL = "https://api.aladhan.com/v1/";
axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

export default axios;