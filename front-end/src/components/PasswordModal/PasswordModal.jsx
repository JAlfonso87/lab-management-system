import { useState } from "react";
import styles from"../../pages/SignUp/SignUp.module.css"
import "./PasswordModal.css"
import { api } from "../../axios/api";

function PasswordModal({ onClose }) {
  const [visiblePassword, isPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const updateAttempt = () => {
    if(newPassword.length != 0 )
      if(newPassword == newPasswordConfirmation)
      {
        api.post('users/user/credentials', { new_password: newPassword }, { params: { type: "pwd" } })
          .then((response) => {
              alert("La contraseña se ha actualizado exitosamente.")
              setNewPassword("");
              setNewPasswordConfirmation("");
          })
          .catch((error) => console.error(error))
      }
      else
        alert("Las contraseñas no coincden.")
    else
      alert("Por favor, proporciona una nueva contraseña.")
  }

  return (
    <div
      className="password-modal-overlay"
      onClick={onClose}
    >
      <div
        className="password-modal-content"
        onClick={event =>
          event.stopPropagation()
        }
      >
        <div className="password-modal-top">
          <div className="modal-title-container">
            <h1
              className="modal-password-title"
            >
              Cambiar contraseña
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
            La contraseña debe tener al menos 8 caracteres e incluir una combinación de
            números, letras y caractéres especiales (!$@%).
          </p>
        </div>


        <div className="password-modal-middle">
          <div className="change-password-container">
            <label
              className="change-password-label"
              htmlFor="new-password"
            >Nueva contraseña</label>
            <input
              id="new-password"
              placeholder="Nueva contraseña"
              className="change-username-input"
              type = { visiblePassword ? "text" : "password" } 
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>

          <div className="repeat-password-container">
            <label
              className="change-password-label"
              htmlFor="repeat-new-password"
            >Repetir nueva contraseña</label>
            <div style = {{ display: 'flex', justifyItems: "center"}}>
                <input
                  id="repeat-new-password"
                  placeholder="Nueva contraseña"
                  className="change-username-input"
                  type = { visiblePassword ? "text" : "password" } 
                  onChange={(event) => setNewPasswordConfirmation(event.target.value)}
                />
                <img 
                    style = {{marginTop: "5px", backgroundColor: "white", cursor: "pointer", width: "30px", height: "30px", marginLeft: "-50px", zIndex: "2"}} 
                    alt = "Mostrar contraseña" 
                    className = {styles["header-img"]} src = { visiblePassword ? "/src/assets/images/eye.png" : "/src/assets/images/eye-closed.png"}
                    onClick={()=>isPasswordVisible(!visiblePassword)}
                ></img>
            </div>
            

          </div>
        </div>

        <div className="password-modal-bottom">
          <hr />

          <div>
            <button
              type="button"
              className="modal-change-password-button"
              onClick={() => updateAttempt()}
            >
              Cambiar
            </button>

            <button
              type="button"
              className="modal-cancel-password-button"
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

export default PasswordModal;