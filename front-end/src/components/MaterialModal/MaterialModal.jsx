import "./MaterialModal.css"

function MaterialModal({ material, image, onClose, onDelete }) {

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
          <h1 className="modal-material-title">{material.name}</h1>

          <button
            type="button"
            onClick={onClose}
            className="modal-close-button"
            aria-label="Cerrar"
          >
            X
          </button>
        </div>


        <div className="modal-middle">

          <img
            src={image}
            alt={`Imagen de ${material.name}`}
            className="modal-material-img"
          />

          <div className="modal-material-properties">
            <div className="modal-material-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Datos del reactivo</h2>
                <hr className="right-line" />
              </div>
              <span>Marca: {material.brand}</span>
              <div>
                <span className="modal-material-weight">Peso: {material.weight}</span>
                <span>Color: {material.color}</span>
              </div>
            </div>

            <div className="modal-location-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Datos de la ubicación</h2>
                <hr className="right-line" />
              </div>
              <span>{material.location}</span>
              <div>
                <span className="modal-material-shelf">Estante: {material.shelf}</span>
                <span>Nivel: {material.level}</span>
              </div>
            </div>

            <div className="modal-stock-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Datos del stock</h2>
                <hr className="right-line" />
              </div>
              <span>Stock: {material.stock}</span>
              <span>
                <strong>{material.status}</strong>
              </span>
            </div>
          </div>

        </div>

        <div className="modal-bottom">
          <hr className="bottom-line" />

          <div>
            <button
              className="modal-edit-button"
              type="button"
            >
              Editar stock
            </button>

            <button
              className="modal-delete-button"
              type="button"
              onClick={() => {
                onDelete(material.id);
                onClose();
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

    </div>

  );

}

export default MaterialModal;