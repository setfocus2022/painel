import React, { useState, useEffect, useContext } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js";
import sidebarImage from "assets/img/sidebar-4.jpg";
import './Admin.css';
import { AuthContext } from '../context/AuthContext';

function Empresa() {
  const [image, setImage] = useState(sidebarImage);
  const [hasImage, setHasImage] = useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authState } = useContext(AuthContext);

  const isAuthenticated = () => {
    return authState.token !== null;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getRoutes = (routes) => {
    const role = authState.role;
    return routes.map((prop, key) => {
      if (prop.layout === "/empresa") {
        if (prop.subMenu) {
          return prop.subMenu.map((subRoute, subIdx) => {
            if (subRoute.roles && !subRoute.roles.includes(role)) {
              return (
                <Route
                  path={prop.layout + subRoute.path}
                  render={(props) => <ErrorPage {...props} />}
                  key={`${key}_${subIdx}`}
                />
              );
            } else {
              return (
                <Route
                  path={prop.layout + subRoute.path}
                  render={(props) => <subRoute.component {...props} />}
                  key={`${key}_${subIdx}`}
                />
              );
            }
          });
        }
        if (prop.roles && !prop.roles.includes(role)) {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <ErrorPage {...props} />}
              key={key}
            />
          );
        } else {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          );
        }
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    // Verificando se mainPanel.current é válido antes de acessar scrollTop
    if (mainPanel.current) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      mainPanel.current.scrollTop = 0;
    }
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
 
  return (
    <>
      {isAuthenticated() ? ( 
        <div className="wrapper" style={{ backgroundColor: 'black' }}>
          <Sidebar color="#1F1F1F" image={hasImage ? image : ""} routes={routes} />
          <div className="main-panel" ref={mainPanel}>
            <AdminNavbar />
            <div className="content">
              <Switch>
                {getRoutes(routes)}
                <Redirect from="*" to="/empresa/painel" /> 
              </Switch>
            </div>
            
          </div>
        </div>
      ) : (
        <Redirect to="/login" /> 
      )}
    </>
  );
}

export default Empresa;