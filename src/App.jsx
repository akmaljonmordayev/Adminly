import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainLayOut from "./layouts/MainLayOut";
import React, { Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
const Login = React.lazy(() => import("./auth/Login"));
const Register = React.lazy(() => import("./auth/Register"));
const NotFound = React.lazy(() => import("./role/Employee/NotFound"));

const Announcements = React.lazy(() => import("./role/Manager/Announcements"));
const Archieve = React.lazy(() => import("./role/Manager/Archieve"));
const Complaints = React.lazy(() => import("./role/Manager/Complaints"));
const Dashboard = React.lazy(() => import("./role/Manager/Dashboard"));
const Employees = React.lazy(() => import("./role/Manager/Employees"));
const Finance = React.lazy(() => import("./role/Manager/Finance"));
const Logs = React.lazy(() => import("./role/Manager/Logs"));
const Settings = React.lazy(() => import("./role/Manager/Settings"));
const Tasks = React.lazy(() => import("./role/Manager/Tasks"));
const Vacations = React.lazy(() => import("./role/Manager/Vacations"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Dashboard />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/finance"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Finance />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tasks"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Tasks />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/logs"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Logs />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/vacations"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Vacations />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/settings"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Settings />
                </MainLayOut>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/complaints"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Complaints />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Employees />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/archieve"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Archieve />
                </MainLayOut>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/announcemenets"
            element={
              <ProtectedRoute>
                <MainLayOut>
                  {" "}
                  <Announcements />
                </MainLayOut>
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/signin" element={<Login />} />
          <Route path="/auth/signup" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
