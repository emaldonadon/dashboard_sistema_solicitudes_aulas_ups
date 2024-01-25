import React from 'react'
import { Navigate } from 'react-router-dom'
export default function PublicRoute ({ isAuth, children }){
    return isAuth ? <Navigate to="/" /> : children
}