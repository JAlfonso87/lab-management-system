import "./Sidebar.css"

import homeIcon from "../../assets/images/home.png"
import searchIcon from "../../assets/images/search.png"
import addIcon from "../../assets/images/add.png"
import checkIcon from "../../assets/images/check.png"
import user from "../../assets/images/user.png"
import log_out from "../../assets/images/log_out.png"
import reqIcon from "../../assets/images/request.png"
import usersIcon from "../../assets/images/users.png"


import { usePermissions } from "../../permissions/PermissionValidator.jsx"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../axios/api.jsx"

function Sidebar() {

  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async (event) => {
    event.preventDefault();
    await api.post('/auth/logout')
    .then((response) => {
        navigate('/login')
    });
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <Link
          to={"/home"}
          className={`sidebar-link ${location.pathname === "/home"
            ? "selected-link"
            : ""
            }`
          }
        >
          <img
            src={homeIcon}
            alt="Icono de home"
            className="sidebar-img"
          />
          <p className="sidebar-text">
            Inicio
          </p>
        </Link>

        <Link
          to={"/materials"}
          className={
            `sidebar-link ${location.pathname === "/materials"
              ? "selected-link"
              : ""
            }`
          }
        >
          <img
            src={searchIcon}
            alt="Icono de materiales"
            className="sidebar-img"
          />
          <p className="sidebar-text">
            Materiales
          </p>
        </Link>

        <Link
          to={"/add-material"}
          className={
            `sidebar-link ${location.pathname === "/add-material"
              ? "selected-link" : ""
            }`
          }
        >
          <img
            src={addIcon}
            alt="Icono de agregar"
            className="sidebar-img"
          />
          <p className="sidebar-text">
            Nuevo Material
          </p>
        </Link>

        {
          hasPermission("permissions.users.approve_new_signups") == true ? (
            <Link
              to={"/admin/approve"}
              className={
                `sidebar-link ${location.pathname === "/admin/approve"
                  ? "selected-link" : ""
                }`
              }
            >
              <img
                src={checkIcon}
                alt="Icono de aprobar"
                className="sidebar-img"
              />
              <p className="sidebar-text">
                Aprobar Registros
              </p>
            </Link>
          ): null
        }
        
        <Link
          to={"/new-request"}
          className={
            `sidebar-link ${location.pathname === "/new-request"
              ? "selected-link" : ""
            }`
          }
        >
          <img
            src={reqIcon}
            alt="Icono de agregar"
            className="sidebar-img"
          />
          <p className="sidebar-text">
            Realizar Solicitud
          </p>
        </Link>

        {
          hasPermission("permissions.users.modify_others") == true ? (
            <Link
              to={"/admin/user-management"}
              className={
                `sidebar-link ${location.pathname === "/admin/user-management"
                  ? "selected-link" : ""
                }`
              }
            >
              <img
                src = {usersIcon}
                alt = "Gestión de Usuarios"
                className="sidebar-img"
              />
              <p className="sidebar-text">
                Gestión de Usuarios
              </p>
            </Link>
          ): null
        }

      </div>

      <div className="sidebar-bottom">
        <Link
          to={"/user"}
          className={
            `sidebar-link ${location.pathname === "/user"
              ? "selected-link" : ""
            }`
          }
        >
          <img
            src={user}
            alt="Icono de usuario"
            className="sidebar-img"
          />
          <p>
            Usuario
          </p>
        </Link>

        <Link
          to = {"/login"}
          className={
            `sidebar-link`
          }
          onClick={ logout }
        >
          <img
            src={log_out}
            alt="Icono de cerrar sesión"
            className="sidebar-img"
          />
          <p>
            Cerrar sesión
          </p>

        </Link>
      </div>


    </nav>
  );

}

export default Sidebar;