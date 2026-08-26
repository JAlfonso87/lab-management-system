import { useState } from "react";
import { api } from "../../axios/api";
import "./UsernameModal.css"

function UsernameModal({ username, onClose }) {

  const [newUsername, setNewUsername] = useState("");

  const updateAttempt = () => {
    if(newUsername.length != 0 ){
      api.post('users/user/credentials', { new_username: newUsername }, { params: { type: "usn" } })
      .then((response) => console.log(response.data))
      .catch((error) => {
        if (error.code === "P2002")
          alert("El nombre de usuario ya está en uso. Elige otro.")
      })
    }
    else
      alert("Por favor, proporciona un nuevo nombre de usuario.")
  }

  return (
    <div
      className="username-modal-overlay"
      onClick={onClose}
    >
      <div
        className="username-modal-content"
        onClick={event =>
          event.stopPropagation()
        }
      >
        <div className="username-modal-top">
          <div className="modal-title-container">
            <h1
              className="modal-username-title"
            >
              Cambiar nombre de <br /> usuario
            </h1>

            <button
              type="button"
              className="modal-close-button"
              aria-label="Cerrar"
              onClick={onClose}
            >
              X
            </button>
          </div>

          <p className="modal-intructions-text">
            El nombre de usuaro puede tener letras, números y guiones (-).
          </p>
        </div>


        <div className="username-modal-middle">
          <p className="current-username-text">
            Nombre de usuario actual:<br />
            <strong>{username}</strong>
          </p>

          <div className="change-username-container input-label">
            <label
              className="change-username-label"
              htmlFor="new-username"
            >Nuevo nombre de usuario</label>
            <input
              id="new-username"
              placeholder="Nuevo nombre de usuario"
              className="change-username-input"
              onChange = { setNewUsername }
              value = { newUsername }
            />
          </div>
        </div>

        <div className="username-modal-bottom">
          <hr />

          <div>
            <button
              type = "button"
              className = "modal-change-username-button"
              onClick = {() => updateAttempt()}
            >
              Cambiar
            </button>

            <button
              type="button"
              className="modal-cancel-username-button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default UsernameModal;