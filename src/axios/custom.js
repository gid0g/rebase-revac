import axios from "axios";
const token = sessionStorage.getItem("myToken");
// "proxy": "https://pm.ebs-rcm.com/revac/api/",

const api = axios.create({
  // baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
  baseURL: "https://localhost:7180/api/",
  headers: {
    Accept: "application/json; charset=utf-8",
    "Content-Type": "application/json",
    timeout: 15000,
    Authorization: `Bearer ${token}`,
  },
});

export const apis = axios.create({
  // baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
  baseURL: "https://localhost:7180/api/",
  headers: {
    Accept: "application/json; charset=utf-8",
    "Content-Type": "application/json",
    timeout: 20000,
  },
});
export const attachment = axios.create({
  // baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
  baseURL: "https://localhost:7180/api/",
  headers: {
    Accept: "/*",
    "Content-Type": "multipart/form-data",
    timeout: 30000,
    Authorization: `Bearer ${token}`,
  },
});

let isAlertDisplayed = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error Token:", error);
    if (error.response && error.response.message && error.response.message.includes('The token expired on') && !isAlertDisplayed) {
      isAlertDisplayed = true;
      displayLoginPrompt();
    }
    return Promise.reject(error);
  }
);

function displayLoginPrompt() {
  alert('Your session has expired. Please log in again.');
  isAlertDisplayed = false;
}


export default api;
