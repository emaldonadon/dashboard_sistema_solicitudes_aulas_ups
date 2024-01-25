import React from 'react'
import { Navigate } from 'react-router-dom'
export default function PrivateRoute ({ isAuth, children }) {
    return isAuth ? children  : <Navigate to="/account/login/" />
}