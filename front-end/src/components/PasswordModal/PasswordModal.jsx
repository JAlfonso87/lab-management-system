import "./PasswordModal.css"

function PasswordModal({ onClose }) {
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
            />
          </div>

          <div className="repeat-password-container">
            <label
              className="change-password-label"
              htmlFor="repeat-new-password"
            >Repetir nueva contraseña</label>
            <input
              id="repeat-new-password"
              placeholder="Nueva contraseña"
              className="change-username-input"
            />
          </div>
        </div>

        <div className="password-modal-bottom">
          <hr />

          <div>
            <button
              type="button"
              className="modal-change-password-button"
              onClick={onClose}
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