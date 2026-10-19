import styles from "./Home.module.css";

import searchIcon from "../../assets/images/search.png";
import addIcon from "../../assets/images/add.png";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../axios/api";
import { Header, Sidebar } from "../../components/Components";

function Home() {
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const getUserData = async () => {
    api
      .get("/users/find", {
        params: {
          spec: "current",
          method: "id",
        },
      })
      .then((user) => {
        setUserData(user.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles["home-page"]}>
      <Header />

      <div className={styles["home-content"]}>
        <Sidebar />

        <main className={styles["main-section"]}>
          <h1 className={styles["home-title"]}>Inicio</h1>

          <div className={styles["tools-section"]}>
            <h2 className={styles["home-subtitle"]}>Herramientas rápidas</h2>

            <form
              className={styles["search-form"]}
              onSubmit={(event) => {
                event.preventDefault();

                if (!search) {
                  return;
                }

                navigate("/materials");
              }}
            >
              <input
                placeholder="Buscar reactivo"
                type="text"
                className={styles["search-input"]}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button type="submit" className={styles["search-button"]}>
                <img src={searchIcon} alt="Icono de buscar" />
              </button>
            </form>

            <button
              type="button"
              className={styles["add-button"]}
              onClick={() => navigate("/add-material")}
            >
              <img src={addIcon} alt="Icono de agregar" />
              Añadir reactivo
            </button>
          </div>

          <p className={styles["welcome-text"]}>
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
