import "./NewRequest.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../axios/api"

function NewRequest() {

  const materials = [
    {
      id: 1,
      name: "Ácido sulfúrico",
      brand: "Merck",
      stock: 35
    },
    {
      id: 2,
      name: "Ácido clorhídrico",
      brand: "Sigma-Aldrich",
      stock: 24
    },
    {
      id: 3,
      name: "Hidróxido de sodio",
      brand: "Fermont",
      stock: 18
    },
    {
      id: 4,
      name: "Sulfato de cobre",
      brand: "J.T. Baker",
      stock: 42
    }
  ]

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [assignedLab, setAssignedLab] = useState({});
  const [labInventory, setLabInventory] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();


  }

  useEffect(() => {
    api.get('/locations/lab').then((response) => { console.log(response); setAssignedLab(response.data) })
  }, [])

  useEffect(() => {
    if(Object.keys(assignedLab).length)
      api.get('/locations/lab', { params: { lab_name: assignedLab.lab_name }}).then((response) => {setLabInventory(response.data)});
    console.log(labInventory)
  }, [assignedLab]);

  return (
    <div className="new-request-page">

      <Header />

      <div className="new-request-content">

        <Sidebar />

        <main className="new-request-main">

          <h1 className="new-request-title">
            Nueva Solicitud
          </h1>

          <h2 className="new-request-location">
            EDIFICIO {assignedLab.host_building} : LABORATORIO DE {assignedLab.lab_name}
          </h2>

          <p className="new-request-text">
            Seleccione los reactivos para realizar la nueva solicitud:
          </p>

          <form
            onSubmit={handleSubmit}
          >
            <div className="availables-container">

              <div className="subtitle-container">
                <hr className="new-request-left-line" />
                <h2 className="subtitle-text">Reactivos disponibles</h2>
                <hr className="new-request-right-line" />
              </div>

              <table className="availables-table">
                <thead>
                  <tr>
                    <td>Nombre</td>
                    <td>Marca</td>
                    <td>Stock</td>
                    <td>Operaciones</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    /*labInventory.map(entry => (
                      <tr key={entry.id}>
                        <td>{entry.name}</td>
                        <td>{entry.brand}</td>
                        <td>{entry.stock}</td>
                        <td>
                          <button
                            type="button"
                            className="availables-button"
                            onClick={() =>
                              setSelectedMaterials([...selectedMaterials, entry])
                            }
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))*/
                  }
                </tbody>
              </table>

              <div className="page-buttons-container">
                <button
                  type="button"
                  className="page-button"
                >
                  &lt;
                </button>
                <span
                  className="page-text"
                >
                  Página 2
                </span>
                <button
                  type="button"
                  className="page-button"
                >
                  &gt;
                </button>
              </div>
            </div>

            <div className="stock-container">

              <div className="subtitle-container">
                <hr className="new-request-left-line" />
                <h2 className="subtitle-text">
                  Reactivos seleccionados
                </h2>
                <hr className="new-request-right-line" />
              </div>

              {
                selectedMaterials.length !== 0
                  ? (
                    <table className="stock-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Marca</th>
                          <th>Stock</th>
                          <th>Operaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          selectedMaterials.map(selectedMaterial => (
                            <tr key={selectedMaterial.id}>
                              <td>{selectedMaterial.name}</td>
                              <td>{selectedMaterial.brand}</td>
                              <td>{selectedMaterial.stock}</td>
                              <td>
                                <button
                                  type="button"
                                  className="selected-button"
                                  onClick={() =>
                                    setSelectedMaterials(
                                      selectedMaterials.filter(
                                        (material) => material.id !== selectedMaterial.id
                                      )
                                    )
                                  }
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ) : (
                    <p className="non-selected-text">Aún no hay reactivos seleccionados</p>)
              }

            </div>

            <div >
              <button
                type="submit"
                className="confirm-request-button"
              >
                Confirmar
              </button>

              <button
                type="button"
                className="cancel-request-button"
              >
                Cancelar
              </button>
            </div>

          </form>

        </main>

      </div>
    </div>
  );
}

export default NewRequest;