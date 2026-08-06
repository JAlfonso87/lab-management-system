import "./Home.css"

import logo from "../../assets/images/logo.png"
import homeIcon from "../../assets/images/home.png"
import searchIcon from "../../assets/images/search.png"
import addIcon from "../../assets/images/add.png"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

function Home() {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  return (

    <div className="home-page">

      <header className="header-content">

        <img
          src={logo}
          alt="Logo del sistema"
          className="header-img"
        />
        <span>LMS | Lab Management System</span>

      </header>

      <div className="content">

        <nav className="nav-bar">

          <Link
            to={"/home"}
            className={
              `nav-link ${location.pathname === "/home"
                ? "selected-link"
                : ""
              }`
            }
          >
            <img
              src={homeIcon}
              alt="Icono de home"
              className="nav-img"
            />
            <p className="nav-text">
              Inicio
            </p>
          </Link>

          <Link
            to={"/materials"}
            className={
              `nav-link ${location.pathname === "/materials"
                ? "selected-link"
                : ""
              }`
            }
          >
            <img
              src={searchIcon}
              alt="Icono de materiales"
              className="nav-img"
            />
            <p className="nav-text">
              Materiales
            </p>
          </Link>

          <Link
            to={"/create-material"}
            className={
              `nav-link ${location.pathname === "create-material"
                ? "selected-link" : ""
              }`
            }
          >
            <img
              src={addIcon}
              alt="Icono de agregar"
              className="nav-img"
            />
            <p className="nav-text">
              Agregar
            </p>
          </Link>

        </nav>

        <main className="main-section">

          <h1 className="home-title">
            Inicio
          </h1>

          <div className="tools-section">
            <h2 className="home-subtitle">
              Herramientas rápidas
            </h2>

            <form
              className="search-form"
              onSubmit={(event) => {
                event.preventDefault();

                if (!search) {
                  return;
                }

                navigate("/materials")
              }}
            >
              <input
                placeholder="Buscar reactivo"
                type="text"
                className="search-input"
                value={search}
                onChange={event =>
                  setSearch(event.target.value)
                }
              />

              <button
                type="submit"
                className="search-button"
              >
                <img
                  src={searchIcon}
                  alt="Icono de buscar"
                />
              </button>
            </form>

            <button
              type="button"
              className="add-button"
              onClick={() =>
                navigate("/create-material")
              }
            >
              <img
                src={addIcon}
                alt="Icono de agregar"
              />
              Añadir reactivo
            </button>

          </div>

          <p className="welcome-text">
            ¡Bienvenido! <br />
            a Lab Management System <br />
            <strong>Usuario</strong>
          </p>

        </main>

      </div>

    </div>
  );
}

export default Home;