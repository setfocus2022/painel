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

function Admin() {
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
      // Verifica se a rota pertence ao layout /admin ou /usuario
      if (prop.layout === "/admin" || prop.layout === "/usuario") { 
        if (prop.subMenu) {
          // Se a rota tiver submenus, mapeia cada submenu
          return prop.subMenu.map((subRoute, subIdx) => {
            // Verifica se a role do usuário tem permissão para acessar o submenu
            if (subRoute.roles && !subRoute.roles.includes(role)) {
              // Se não tiver permissão, renderiza a página de erro
              return (
                <Route
                  path={prop.layout + subRoute.path}
                  render={(props) => <ErrorPage {...props} />}
                  key={`${key}_${subIdx}`}
                />
              );
            } else {
              // Se tiver permissão, renderiza o componente do submenu
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

        // Verifica se a role do usuário tem permissão para acessar a rota
        if (prop.roles && !prop.roles.includes(role)) {
          // Se não tiver permissão, renderiza a página de erro
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <ErrorPage {...props} />}
              key={key}
            />
          );
        } else {
          // Se tiver permissão, renderiza o componente da rota
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          );
        }
      } else {
        // Se a rota não pertencer ao layout /admin ou /usuario, retorna null
        return null; 
      }
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
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);

  return (
    <>
      <div className="wrapper" style={{ backgroundColor: 'black' }}>
        <Sidebar color="#1F1F1F" image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Switch>
              {getRoutes(routes)}
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;