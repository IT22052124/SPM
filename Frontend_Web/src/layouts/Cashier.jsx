import { useEffect, useRef } from "react";
import { useLocation, Route, Routes } from "react-router-dom";

import routes from "../routes.jsx";

import Sidebar from "../components/Sidebar.jsx";
import sidebarImage from "../assets/sidebar.jpg";

function Cashier() {
  const image = sidebarImage;
  const color = "black";
  const hasImage = true;
  const location = useLocation();
  const mainPanel = useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/cashier") {
        return (
          <Route path={prop.path} element={<prop.component />} key={key} />
        );
      }
      return null;
    });
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      const element = document.getElementById("bodyClick");
      if (element) {
        element.parentNode.removeChild(element);
      }
    }
  }, [location]);

  const getSideBarRoutes = (routes) => {
    return routes.filter((prop) => prop.layout === "/cashier");
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={getSideBarRoutes(routes)}
        />
        <div className="main-panel" ref={mainPanel}>
          {/* <AdminNavbar /> */}
          <div className="content">
            <Routes>{getRoutes(routes)}</Routes>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}

export default Cashier;
