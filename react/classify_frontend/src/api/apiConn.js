import axios from 'axios'

export default axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 6000,
    headers: {
        Authorization: localStorage.getItem('access_tk') ? "Bearer" + " " + localStorage.getItem('access_tk') : null,
        'Content-Type': 'application/json',
        accept: 'application/json'
    }
});



