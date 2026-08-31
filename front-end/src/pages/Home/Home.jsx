import "./Home.css"

import searchIcon from "../../assets/images/search.png"
import addIcon from "../../assets/images/add.png"

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../../axios/api"
import Header from "../../components/Header/Header.jsx"
import Sidebar from "../../components/Sidebar/Sidebar.jsx"

function Home() {

  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const getUserData = async () => {
      api.get('/users/find', { 
        params: { 
          spec: "current",
          method: "id" 
        } 
      })
      .then((user) => { 
          setUserData(user.data) 
      } )
      .catch((error) => console.error(error))

  }

  useEffect(() => {
    getUserData()
  }, [])

  return (

    <div className="home-page">

      <Header />

      <div className="home-content">

        <Sidebar />

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
                navigate("/add-material")
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
            a Lab Management System, <br />
            <strong>{userData.user_username}</strong>
          </p>

        </main>

      </div>

    </div>
  );
}

export default Home;