import Axios from 'axios';

const instance = Axios.create({
    baseURL: "http://localhost:4000/api/syllabus"
});

instance.defaults.headers.common['Authorization'] = sessionStorage.getItem("token");

export default instance;