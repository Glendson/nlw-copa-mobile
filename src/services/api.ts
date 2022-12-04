import axios from "axios";


export const api = axios.create({
    baseURL: "http://192.168.1.74:3333"
})