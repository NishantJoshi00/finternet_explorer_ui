/*!

=========================================================
* Finternet Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/finternet-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/finternet-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      let mainRoute = prop.layout === "/admin" ? (
        <Route path={prop.path} element={prop.component} key={key} exact />
      ) : null;
  
      let subRoutes = prop.subItems
        ? prop.subItems.map((subItem, subKey) => (
            <Route
              path={prop.path + subItem.path}
              element={subItem.component || <div>{subItem.name}</div>}
              key={`${key}-${subKey}`}
              exact
            />
          ))
        : [];
  
      return [mainRoute, ...subRoutes].filter(Boolean);
    });
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: "https://finternetlab.io/images/headers/finternet-favicon.png",
          imgAlt: "...",
        }}
      />
      <div className="main-content" >
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Admin;
