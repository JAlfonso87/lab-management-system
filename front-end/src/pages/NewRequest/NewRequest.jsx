import "./NewRequest.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { api } from "../../axios/api"

function NewRequest() {

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [assignedLab, setAssignedLab] = useState({});

  const [labInventory, setLabInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)

  const [checkouts, setCheckouts] = useState([])

  const updateCheckout = (checkout) => {

    const { local_stock_id, checkout_units } = checkout;

    if(checkouts.some((element) => element.local_stock_id == local_stock_id))
      setCheckouts(prev =>
          prev.map(element =>
              element.local_stock_id === local_stock_id
                  ? { ...element, checkout_units }
                  : element
          )
      );
    else
      setCheckouts([...checkouts, checkout]);
  }

  const pageButtonEnabled = (type) => {
    if(type == "forward"){
      let max_page = (Math.ceil(labInventory.length / 5))
      return currentPage < max_page ? false : true;
    }
    else if (type == "back")
      return currentPage == 1 ? true : false;
  }

  const addMaterialEnabled = (material) => selectedMaterials.some((entry) => entry === material);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(checkouts.length != 0)
    {
      api.post('/operations/request', {
        "checkouts": checkouts
      })
      .then((response) => console.log(response))
    }
  }

  useEffect(() => {
    let reagent_code = "";
    let lastKeyTime = 0;
    let matching_entry = {};

    const handleKeyDown = async (event) => {
        const now = Date.now();

        if (now - lastKeyTime > 100) {
            reagent_code = "";
        }

        if (event.key === "Enter") {
            if (reagent_code.length > 0) {
                matching_entry = labInventory.find((lab_entry) => (lab_entry.reagent_code == reagent_code));

                if(matching_entry != undefined){
                  if(!addMaterialEnabled(matching_entry)) {
                    setSelectedMaterials([...selectedMaterials, matching_entry])
                  }
                } 
                else {
                  alert("ATENCIÓN: PRODUCTO NO REGISTRADO")
                }

                reagent_code = "";
                matching_entry = {};
            }
        } else if (event.key.length === 1) {
            reagent_code += event.key.toUpperCase();
        }

        lastKeyTime = now;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
  }, [labInventory, selectedMaterials]);

  useEffect(() => {
    api.get('/locations/lab').then((response) => { setAssignedLab(response.data) })
  }, [])

  useEffect(() => {
    if(Object.keys(assignedLab).length != 0)
      api.get('/locations/lab/inventory', { params: { lab_name: assignedLab.lab_name }}).then((response) => { setLabInventory(response.data)});
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
                    <td>Código Interno</td>
                    <td>Stock</td>
                    <td>Operaciones</td>
                  </tr>
                </thead>

                <tbody>
                  {  
                    labInventory.slice((currentPage * 5) - 5, ((currentPage * 5))).map(entry => (
                      <tr key={entry.local_stock_id}>
                        <td>{entry.reagent_name}</td>
                        <td>{entry.reagent_brand}</td>
                        <td>{entry.reagent_code}</td>
                        <td>{entry.local_stock_units}</td>
                        <td>
                          <button
                            type="button"
                            className="availables-button"
                            onClick={() => setSelectedMaterials([...selectedMaterials, entry])}
                            disabled = { addMaterialEnabled(entry) }
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <div className="page-buttons-container">
                <button
                  type="button"
                  className="page-button"
                  onClick = { () => setCurrentPage(currentPage - 1) }
                  disabled = { pageButtonEnabled("back") }
                >
                  &lt;
                </button>
                <span
                  className="page-text"
                >
                  Página {currentPage}
                </span>
                <button
                  type="button"
                  className="page-button"
                  onClick = { () => setCurrentPage(currentPage + 1) }
                  disabled = {pageButtonEnabled("forward")}
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
                          <th>Código Interno</th>
                          <th>Stock Actual</th>
                          <th>Stock Saliente</th>
                          <th>Operaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          selectedMaterials.map(element => (
                            <tr key={element.local_stock_id}>
                              <td>{element.reagent_name}</td>
                              <td>{element.reagent_brand}</td>
                              <td>{element.reagent_code}</td>
                              <td>{element.local_stock_units}</td>
                              <td>
                                  <input
                                    id = "stock"
                                    style = {{width: "100px", marginBottom: "20px"}}
                                    min = { 1 }
                                    max = { element.local_stock_units }
                                    placeholder = "Stock saliente"
                                    type = "number"
                                    className = "stock-input"
                                    onChange={(event) => updateCheckout({
                                      "local_stock_id": element.local_stock_id, 
                                      "checkout_units": Number(event.target.value) 
                                    })}
                                  />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="selected-button"
                                  onClick={() =>
                                    setSelectedMaterials(
                                      selectedMaterials.filter(
                                        (material) => material.id !== element.id
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
                onClick={()=> console.log(labInventory)}
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