import "./Sidebar.css"

import homeIcon from "../../assets/images/home.png"
import searchIcon from "../../assets/images/search.png"
import addIcon from "../../assets/images/add.png"

import { Link, useLocation } from "react-router-dom";

function Sidebar() {

  const location = useLocation();

  return (
    <nav className="sidebar">

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
          Agregar
        </p>
      </Link>

    </nav>
  );

}

export default Sidebar;