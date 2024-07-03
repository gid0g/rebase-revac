import axios from "axios";
const token = sessionStorage.getItem("myToken");


const api = axios.create({
  baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
  headers: {
    Accept: "application/json; charset=utf-8",
    "Content-Type": "application/json",
    timeout: 15000,
    Authorization: `Bearer ${token}`,
  },
});

export const apis = axios.create({
  baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
  headers: {
    Accept: "application/json; charset=utf-8",
    "Content-Type": "application/json",
    timeout: 20000,
  },
});

export const attachment = axios.create({
  baseURL: "https://revbilldemo.ebs-rcm.com/New/api/",
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
    if (error.response && error.response.status === 401 && !isAlertDisplayed) {
       isAlertDisplayed = false;
       displayLoginPrompt();
    }
    return Promise.reject(error);
  }
);

function displayLoginPrompt() {
  alert('Your session has expired. Please log in again.');
};

export default api;

