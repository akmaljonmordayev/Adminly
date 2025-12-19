import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  let token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to={'/auth/signin'} />
  }
  return children
}

export default ProtectedRoute
