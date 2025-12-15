import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainLayOut from "./layouts/MainLayOut";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./role/Employee/Home"));
const Users = React.lazy(() => import("./role/Manager/Employees"));
const Products = React.lazy(() => import("./role/Employee/Products"));
const NotFound = React.lazy(() => import("./role/Employee/NotFound"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayOut>
                {" "}
                <Home />
              </MainLayOut>
            }
          />
          <Route
            path="/users"
            element={
              <MainLayOut>
                {" "}
                <Users />
              </MainLayOut>
            }
          />
          <Route
            path="/products"
            element={
              <MainLayOut>
                <Products />
              </MainLayOut>
            }
          />
          <Route
            path="*"
            element={
              <MainLayOut>
                <NotFound />
              </MainLayOut>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
