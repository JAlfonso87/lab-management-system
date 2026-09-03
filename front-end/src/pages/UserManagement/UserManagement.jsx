import styles from "./UserManagement.module.css";

import { api } from "../../axios/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserTableEntry from "../../components/UserTableEntry/UserTableEntry";
import UserCard from "../../components/UserCard/UserCard";
import image from "../../assets/images/image.png";
import UserModal from "../../components/UserModal/UserModal";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [modalDisplay, setModalDisplay] = useState(false);

  const handleRefresh = async () => {
    await api
      .get("users/active/nadmin")
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (Object.keys(selectedUser) != 0) {
      setModalDisplay(true);
    } else {
      setModalDisplay(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="edit-stock-page">
      <Header />

      <div className="edit-stock-content">
        <Sidebar />

        <main className="edit-stock-main">
          <h1 className="edit-stock-title">Gestión de Usuarios</h1>

          <p className="edit-stock-text">
            Desde esta ventana puedes modificar la información de los diferentes
            usuarios no administradores.
            <br />
            Ten precaución al momento de realizar modificaciones; y procura que
            las mismas sean notificadas al usuario.
          </p>

          <div className="subtitle-container" style={{ marginBottom: "35px" }}>
            <hr className="edit-stock-left-line" />
            <h2 className="subtitle-text">Usuarios Activos</h2>
            <hr className="edit-stock-right-line" />
          </div>

          <div className={styles["user-cards-container"]}>
            {users.map((user) => (
              <UserCard
                key={user.user_id}
                image={image}
                user={user}
                onClick={setSelectedUser}
              />
            ))}
          </div>
          <button
            className="user-entry-edit-button"
            type="button"
            style={{
              marginTop: "35px",
              width: "150px",
              alignSelf: "center",
            }}
            onClick={() => navigate("/home")}
          >
            Regresar
          </button>
          {modalDisplay == true ? (
            <UserModal
              user={selectedUser}
              image={image}
              onClose={setSelectedUser}
              onRefresh={handleRefresh}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default UserManagement;
