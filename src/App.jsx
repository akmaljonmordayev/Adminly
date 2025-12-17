import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayOut from './layouts/MainLayOut'
import React, { Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'

const Home = React.lazy(() => import('./role/Employee/Home'))
const Users = React.lazy(() => import('./role/Manager/Employees'))
const NotFound = React.lazy(() => import('./role/Employee/NotFound'))
const Login = React.lazy(() => import('./auth/Login'))

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Home />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {' '}
                  <Users />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  <NotFound />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
