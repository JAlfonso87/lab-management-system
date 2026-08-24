import "./EditStockMaterial.css"

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../axios/api";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Stock from "../../components/Stock/Stock";
import LocationSelector from "../../components/LocationSelector/LocationSelector";

function EditStockMaterial() {

  const navigate = useNavigate();

  const [material, setMaterial] = useState({});

  const [source, setSource] = useState({});
  const [destination, setDestination] = useState({});

  const [stockUnits, setStockUnits] = useState("");

  const documentLocation = useLocation();

  const refresh = async () => {
    let response = await api.get('reagents/reagent/'+material.reagent_id);
    setMaterial(response.data);
  }

  const isLocationSelected = (location) => {
    return Object.hasOwn(location, "host_building");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(!Object.hasOwn(source, "host_building") || !Object.hasOwn(destination, "host_building"))
    {
      alert("Por favor, especifica las ubicaciones de transferencia.");
      return;
    }

    if (!stockUnits) {
      alert("Por favor, especifica el monto a transferir.");
      return;
    }

    if(Number(stockUnits) > Number(source.local_stock_units))
    {
      alert("Las unidades a transferir no pueden superar las unidades del stock de origen.")
      return;
    }

    const response = await api.post('operations/transfer', {
      source_id: Number(source.shelf_level_id),
      destination_id: Number(destination.shelf_level_id),
      reagent_id: Number(material.reagent_id),
      stock_units: Number(stockUnits)
    })

    console.log(response.data)
    alert("Stock transferido con éxito.")
    setStockUnits("");
    setSource({});
    setDestination({});
    refresh();
  }

  const handleCancel = () => {
    setStockUnits("");
    setSource({});
    setDestination({});

    navigate('/materials');
  }

  const loadReagentData = () => {
    console.log(documentLocation.state)
    setMaterial(documentLocation.state)
  }

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
            Transferir Stock
          </h1>

          <h2 className="edit-stock-name">
            {material.reagent_name}
          </h2>

          <p className="edit-stock-text">
            A continuación se encuentran los datos de la transferencia:
          </p>

          <form onSubmit={handleSubmit}>
            <div className="stocks-container">

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
                              source = { source }
                              setSource = { setSource }
                              destination = { destination }
                              setDestination = { setDestination }
                            />
                          ) : null
                        )
                      )
                    ) : null
                  }
                </tbody>
              </table>
            </div>
          
            <div>
                {
                  isLocationSelected(source) && !isLocationSelected(destination)? (
                    <LocationSelector 
                        label = {"También puedes seleccionar un destino manualmente:"}
                        selectedLocation = { destination }
                        setSelectedLocation = { setDestination }
                      />
                  ) : null
                }
            </div>

            <div className="stock-container">

              <div className="subtitle-container">
                <hr className="edit-stock-left-line" />
                <h2 className="subtitle-text">
                  Ubicaciones afectadas:
                </h2>
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
                    <td>Rol</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.hasOwn(source, "host_building") ? (
                      <tr className="edit-stock-data">
                        <td>{source.host_building}</td>
                        <td>{Object.hasOwn(source, "shelf_level_number") ? "Almacén" : "Laboratorio"}</td>
                        <td>{source.shelf_number ? source.shelf_number : "-"}</td>
                        <td>{source.shelf_level_number ? source.shelf_level_number : "-"}</td>
                        <td>{source.local_stock_units}</td>
                        <td>Origen</td>
                      </tr>
                    ) :
                    (
                      <tr className="edit-stock-data">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>Origen</td>
                      </tr>
                    )
                  }
                  {
                    Object.hasOwn(destination, "host_building") ? (
                      <tr className="edit-stock-data">
                        <td>{destination.host_building}</td>
                        <td>{Object.hasOwn(destination, "shelf_level_number") ? "Almacén" : "Laboratorio"}</td>
                        <td>{destination.shelf_number ? destination.shelf_number : "-"}</td>
                        <td>{destination.shelf_level_number ? destination.shelf_level_number : "-"}</td>
                        <td>{destination.local_stock_units}</td>
                        <td>Destino</td>
                      </tr>
                    ) :
                    (
                      <tr className="edit-stock-data">
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>Destino</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>

              <div className="subtitle-container">
                <hr className="edit-stock-left-line" />
                <h2 className="subtitle-text">
                  Especificaciones de la transacción:
                </h2>
                <hr className="edit-stock-right-line" />
              </div>
              <div className="edit-stock-container" style={{marginBottom: "50px", marginTop: "15px"}}>
                {
                  (
                    <div className="stock-input-container input-label">
                    <label htmlFor="stock">Unidades a transferir</label>
                    <input
                      id="stock"
                      style={{width: "280px", marginBottom: "20px"}}
                      placeholder="Unidades a transferir"
                      type="number"
                      className="stock-input"
                      value ={stockUnits}
                      onChange={event =>
                        setStockUnits(event.target.value)
                      }
                    />
                    {
                      (
                        <div style = {{marginTop: "15px"}}>
                          <button
                            className="add-stock-button"
                            type="submit"
                          >
                            Transferir
                          </button>

                          <button className="cancel-stock-button" type="button" onClick = { handleCancel }>
                            Cancelar
                          </button>
                        </div>
                      )
                    }
                  </div>
                  )
                }
              </div>

            </div>
            
          </form>

        </main>

      </div>
    </div>
  );
}

export default EditStockMaterial;