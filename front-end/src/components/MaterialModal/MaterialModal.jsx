import "./MaterialModal.css"
import { useState } from "react";

function MaterialModal({material, image, onClose, onDelete }) {
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
          <h1 className="modal-material-title">{material.reagent.reagent_name}</h1>

          <button
            type="button"
            onClick = { onClose }
            className="modal-close-button"
            aria-label="Cerrar"
          >
            X
          </button>
        </div>


        <div className="modal-middle">

          <img
            src={image}
            alt={`Imagen de ${material.reagent.reagent_name}`}
            className="modal-material-img"
          />

          <div className="modal-material-properties">
            <div className="modal-material-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Datos del reactivo</h2>
                <hr className="right-line" />
              </div>
              <span>Marca: {material.reagent.reagent_brand}</span>
              <div>
                <span className="modal-material-weight">Peso: {material.reagent.reagent_netweight}</span>
                <span>Riesgo: {material.reagent.reagent_risk}</span>
              </div>
            </div>

            <div className="modal-location-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Disponibilidad</h2>
                <hr className="right-line" />
              </div>
              <div>
              {
                material.total_stock != 0 ? (
                  <button
                    className="modal-edit-button"
                    type="button"
                    onClick = { () => {
                      console.log("ok");
                      setLocationList(true)
                    }
                    }
                  >
                    Ver ubicaciones
                  </button>
                ) : (
                  <p className="material-status">
                    <strong>SIN UBICACIONES PARA MOSTRAR</strong>
                  </p>
                )
              }
                
              </div>
            </div>

            <div className="modal-stock-info">
              <div className="modal-title-info">
                <hr className="left-line" />
                <h2 className="modal-title-text">Stock total</h2>
                <hr className="right-line" />
              </div>
              <span>Stock: {material.total_stock}</span>
              <span>
                <strong>{material.reagent_status}</strong>
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