import axios from "axios";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "./actionType"
import { Bounce, toast } from 'react-toastify';

export const login = (userDetails) => async (dispatch) => {
    
    try {
        dispatch({ type: LOGIN_REQUEST })
        const { data } = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/users/login`,
            data: userDetails
        });
        const token = data?.token
        if (token) {
            localStorage.setItem("e-token", token)
            localStorage.setItem("user", JSON.stringify({ "name": data.username, "email": data.email }))
        }
        dispatch({ type: LOGIN_SUCCESS, payload: token })
        toast.error(data.error, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    } catch (error) {
        toast.error("Error while Loging", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
        dispatch({ type: LOGIN_FAILURE })
        console.log(error)
    }
}


export const logout = (dispatch) => {
    dispatch({ type: LOGOUT })
}