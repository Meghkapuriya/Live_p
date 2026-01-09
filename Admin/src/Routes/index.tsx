import React from "react";
import { Routes, Route } from "react-router-dom";

import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts";
import AuthProtected from "./AuthProtected";

import { publicRoutes, authProtectedRoutes } from "./allRoutes";

const Index = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES FIRST */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<NonAuthLayout>{route.component}</NonAuthLayout>}
        />
      ))}

      {/* PROTECTED ROUTES */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthProtected>
              <VerticalLayout>{route.component}</VerticalLayout>
            </AuthProtected>
          }
        />
      ))}
    </Routes>
  );
};

export default Index;
