import axios from "axios";

var instance = axios.create({
    // cookie name we are using here must match the cookiename we are using in server.js res.cookie("myaxioscsurftoken"), reg.csrfToken()); !
    xsrfCookieName: "myaxioscsurftoken",
    xsrfHeaderName: "csrf-token",
});

export default instance;
