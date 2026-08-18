import "./MaterialLocationsModal.css"

function MaterialModal({material, onClose, onDelete }) {
  const { locations } = material.locations;
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-top">
          <h1 className="modal-material-title">DISPONIBILIDAD POR UBICACIÓN</h1>

          <button
            type="button"
            onClick = { onClose }
            className="modal-close-button"
            aria-label="Cerrar"
          >
            X
          </button>
        </div>

        <div>
          <ul>
            <li>Hola</li>
          </ul>
        </div>

      </div>
    </div>

  );

}

export default MaterialModal;