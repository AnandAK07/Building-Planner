import React from 'react'
import  Login  from '../components/authentication/Login';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
 
    const token = localStorage.getItem('e-token');
    if (token) {
        return children;
    } else {
        return <Navigate to='/login' element={<Login />} />
    }
}
