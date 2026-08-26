import "./Restock.css"

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../axios/api";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Stock from "../../components/Stock/Stock";
import LocationSelector from "../../components/LocationSelector/LocationSelector";

function Restock() {

  const navigate = useNavigate();
  const documentLocation = useLocation();

  const [material, setMaterial] = useState({});

  const [target, setTarget] = useState({})
  const [targets, setTargets] = useState([]);

  const [incomingChanges, setIncomingChanges] = useState([])


  const validateTarget = (incomingTarget) => {
    if(!targets.some(target => target.shelf_level_id === incomingTarget.shelf_level_id))
      setTarget(incomingTarget)
    else
      alert("La ubicación especificada ya está registrada.")
  }

  const prepareIncomingStock = (targetStock, incomingUnits) => {
    if (!incomingUnits) 
      return;

    setIncomingChanges((prev) => [
      ...prev.filter((element) => element.shelf_level_id !== targetStock.shelf_level_id),
      {
        ...targetStock,
        stock_diff: Number(incomingUnits)
      }
    ])
  }

  const handleRefresh = () => {
    api.get('reagents/reagent/'+material.reagent_id)
    .then((response) => setMaterial(response.data))
    .catch((error) => console.error(error))
  }

  const handleCancel = () => {
    setTargets([]);
    setIncomingChanges([]);
    setTarget({});

    navigate('/materials');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let cleanData = incomingChanges.map((data) => {
      const {location_type, local_stock_units, ...cleanEntry} = data;
        return cleanEntry;
    })

  const payload = {
    stock_data: cleanData,
    reagent_data: {
      reagent_id: material.reagent_id, 
      reagent_name: material.reagent_name
    }
  }

  api.post('/operations/restock', payload)
  .then((response) => {
    console.log(response.data)
    alert("Restock registrado exitosamente.")
    handleRefresh()
  })
  .catch((error) => console.error(error))

  }
  const loadReagentData = () => setMaterial(documentLocation.state);

  useEffect(() => {
    if(Object.hasOwn(target, 'host_building'))
      setTargets((targets) => [...targets, target]);
  }, [target])

  useEffect(() => {
    loadReagentData()
  }, [])

  return (
    <div className="edit-stock-page">
      <Header />

      <div className="edit-stock-content">

        <Sidebar />

        <main className="edit-stock-main">

          <h1 className="edit-stock-title">
            Realizar Re-Stock
          </h1>

          <h2 className="edit-stock-name">
            {material.reagent_name}
          </h2>

          <p className="edit-stock-text">
            A continuación se encuentran los datos de la transferencia:
          </p>

          <form onSubmit={handleSubmit}>
            <div className="stocks-container">
                <div>
                    {
                    (
                        <LocationSelector 
                            label = {"Registro manual:"}
                            selectedLocation = { target }
                            setSelectedLocation = { validateTarget }
                            restricted = { true }
                        />
                    )
                    }
                </div>
                <div className="subtitle-container">
                    <hr className="edit-stock-left-line" />
                    <h2 className="subtitle-text">Stock registrados</h2>
                    <hr className="edit-stock-right-line" />
                </div>

              <table className="stock-table">
                <thead>
                  <tr>
                    <td>Edificio</td>
                    <td>Ubicación</td>
                    <td>Estante</td>
                    <td>Nivel</td>
                    <td>Stock</td>
                    <td>Operaciones</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    material.locations != undefined ? (
                      material.locations.map((location) => (
                          Number(location.local_stock_units) > 0 ? (
                            <Stock
                              key = { location.shelf_level_id }
                              location = { location }
                              target = { target }
                              setTarget = { setTarget }
                              targets = { targets }
                              setTargets = { setTargets }
                            />
                          ) : null
                        )
                      )
                    ) : null
                  }
                </tbody>
              </table>
            </div>

            <div className="stock-container">

              <div className="subtitle-container">
                <hr className="edit-stock-left-line" />
                <h2 className="subtitle-text">
                  Ubicaciones afectadas:
                </h2>
                <hr className="edit-stock-right-line" />
              </div>
              
              <table className = "stock-table">
                <thead>
                  <tr>
                    <td>Edificio</td>
                    <td>Ubicación</td>
                    <td>Estante</td>
                    <td>Nivel</td>
                    <td>Stock Actual</td>
                    <td>Stock Entrante</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    targets.length != 0 ? (
                        targets.map((target) => (
                            <tr className="edit-stock-data">
                                <td>{target.host_building}</td>
                                <td>{Object.hasOwn(target, "shelf_level_number") ? "Almacén" : "Laboratorio"}</td>
                                <td>{target.shelf_number ? target.shelf_number : "-"}</td>
                                <td>{target.shelf_level_number ? target.shelf_level_number : "-"}</td>
                                <td>{target.local_stock_units}</td>
                                <td>
                                  <input 
                                    style = {{width: '150px'}}
                                    type = "number"
                                    min = "1"
                                    onChange = {(event) => { prepareIncomingStock(target, event.target.value) }}
                                    required
                                  >
                                  </input>
                                </td>
                            </tr>
                        ))
                      
                    ) :
                    (
                      <tr className="edit-stock-data">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    )
                  }

                </tbody>
              </table>

              <div className="subtitle-container">
                <hr className="edit-stock-left-line" />
                <hr className="edit-stock-right-line" />
              </div>
              <div style = {{marginTop: "15px"}}>
                  <button
                      className="add-stock-button"
                      type="submit"
                  >
                    Registrar
                  </button>

                  <button className="cancel-stock-button" type="button" onClick = { handleCancel }>
                    Cancelar
                  </button>
              </div>

            </div>
            
          </form>

        </main>

      </div>
    </div>
  );
}

export default Restock;