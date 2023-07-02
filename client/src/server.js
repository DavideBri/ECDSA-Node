import axios from "axios";

const server = axios.create({
  baseURL: "http://100.65.22.169:3042",
});

export default server;
