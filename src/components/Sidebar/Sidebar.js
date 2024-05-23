import React from "react";
import { useLocation, NavLink, useHistory } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import logo from "../../assets/img/logo2.png";
import './style.modules.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Sidebar({ color, image, routes }) {
  const location = useLocation();
  const history = useHistory();
  const { authState } = useContext(AuthContext);
  const role = authState.role;
  const { setAuthInfo } = useContext(AuthContext);

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    setAuthInfo({ token: null, role: null, username: null, userId: null, expiresAt: null });
    history.push("/login");
  };

  const SubMenu = ({ icon, title, items, activeRoute, layout }) => (
    <li className={`nav-item ${activeRoute(layout)}`}>
      <a className="nav-link collapsed" data-toggle="collapse" href={`#${title.replace(/\s+/g, '')}`} aria-expanded={activeRoute(layout) === 'active'}>
        <i className={icon}></i>
        <p>
          {title} <b className="caret"></b>
        </p>
      </a>
      <div className={`collapse ${activeRoute(layout) === 'active' ? 'show' : ''}`} id={title.replace(/\s+/g, '')}>
        <ul className="nav">
          {items.map((subItem, subKey) => {
            if (subItem.roles && !subItem.roles.includes(role)) {
              return null;
            }
            return (
              <li className={`nav-item ${activeRoute(layout + subItem.path)}`} key={subKey}>
                <NavLink
                  to={layout + subItem.path}
                  className="nav-link"
                  activeClassName="active"
                >
                  <span className="sidebar-mini">{subItem.name.charAt(0)}</span>
                  <span className="sidebar-normal">{subItem.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );

  return (
    <div className="sidebar" data-color={color} data-image={image}>
      <div className="sidebar-wrapper">
        <div className="d-flex align-items-center justify-content-start">
          <a href="#" className="simple-text logo-mini mx-3">
            <img src={logo} alt="logo_image" className="sidebar-logo" />
            <hr className="hr-custom" />
          </a>
        </div>

        <Nav>
          {routes.map((prop, key) => {
            if (prop.roles && !prop.roles.includes(role)) {
              return null;
            }

            if (prop.subMenu) {
              return (
                <SubMenu
                  key={key}
                  icon={prop.icon}
                  title={prop.name}
                  items={prop.subMenu}
                  activeRoute={activeRoute}
                  layout={prop.layout}
                />
              );
            } else if (!prop.redirect) {
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </Nav>
        <Button style={{ backgroundColor: 'black' }} className="logout-button" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;