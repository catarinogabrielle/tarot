import axios from "axios";

const Api = axios.create({
    baseURL: 'https://ymonetize.com/apps/app_tarot'
})

export { Api }