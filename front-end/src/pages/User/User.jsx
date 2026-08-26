import "./User.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar"

import userPhoto from "../../assets/images/user-photo.png"
import { useEffect, useState } from "react";
import UsernameModal from "../../components/UsernameModal/UsernameModal";
import PasswordModal from "../../components/PasswordModal/PasswordModal";
import {api} from "../../axios/api"

function User() {

  const user = {
    name: "Juan Pérez García",
    username: "juan-perez",
    password: "Juan1234!",
    phone: "5551234567",
    building: "A",
    location: "Laboratorio de Alimentos"
  };

  const getUserData = async () => {
    api.get('/users/find', { params: { spec: "current" } } )
    .then((user) => { 
        setUserData(user.data) 
        api.get('/locations/lab')
        .then((lab) => {
          setAssignedLab(lab.data)
        })
        .catch((error) => console.error(error))
    } )
    .catch((error) => console.error(error))
  }

  const [userData, setUserData] = useState({});
  const [assignedLab, setAssignedLab] = useState({});
  
  const [usernameModal, setUsernameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  useEffect(() => {
    getUserData()
  }, [])
  return (
    <div className="user-page">
      <Header />

      <div className="user-content">

        <Sidebar />

        <main className="user-main">

          <h1 className="user-title">
            {userData.user_first_name} {userData.user_last_name} {userData.user_middle_name ?? ""} 
          </h1>

          <div className="user-data-section">
            <img
              src={userPhoto}
              alt="Imagen del usuario"
              className="user-photo"
            />

            <div className="user-information">

              <div className="user-data">
                <div className="subtitle-container">
                  <hr className="user-left-line" />
                  <h2 className="subtitle-text">
                    Datos de usuario
                  </h2>
                  <hr className="user-right-line" />
                </div>

                <p className="username-text">{userData.user_username}</p>
                <p className="user-phone-text">Teléfono {userData.user_phone_number}</p>

              </div>

              <div className="user-location">

                <div className="subtitle-container">
                  <hr className="user-left-line" />
                  <h2 className="subtitle-text">
                    Datos de ubicación
                  </h2>
                  <hr className="user-right-line" />
                </div>


                <p className="user-building-text">Edificio {assignedLab.host_building}</p>
                <p className="user-lab-text">LABORATORIO DE {assignedLab.lab_name}</p>

              </div>

              <div className="user-operations">

                <div className="subtitle-container">
                  <hr className="user-left-line" />
                  <h2 className="subtitle-text">
                    Operaciones
                  </h2>
                  <hr className="user-right-line" />
                </div>

                <div className="operation-buttons-container">
                  <button
                    type="button"
                    className="change-username-button"
                    onClick={() => setUsernameModal(true)}
                  >
                    Actualizar información <br /> personal
                  </button>

                  <button
                    type="button"
                    className="change-username-button"
                    onClick={() => setUsernameModal(true)}
                  >
                    Actualizar nombre <br /> de usuario
                  </button>

                  <button
                    type="button"
                    className="change-password-button"
                    onClick={() => setPasswordModal(true)}
                  >
                    Actualizar <br /> contraseña
                  </button>
                </div>

              </div>

            </div>

          </div>

          {
            usernameModal ? (
              <UsernameModal
                username={userData.user_username}
                onClose={() =>
                  setUsernameModal(false)
                }
              />
            ) : null
          }

          {
            passwordModal ? (
              <PasswordModal
                onClose={() =>
                  setPasswordModal(false)
                }
              />
            ) : null
          }



        </main>

      </div>
    </div>
  );
}

export default User;