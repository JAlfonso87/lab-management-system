import "./Restock.css";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../axios/api";
import {
  Header,
  Sidebar,
  Stock,
  LocationSelector,
  ButtonPane,
  TableHeaders,
} from "../../components/Components";
import { LineSubtitle } from "../../mini-components/Minicomponents";

import { SELECTED_LOCATIONS_TABLE } from "./TableStructures/RestockTableStructures";

function Restock() {
  const navigate = useNavigate();
  const documentLocation = useLocation();

  const [material, setMaterial] = useState({});

  const [target, setTarget] = useState({});
  const [targets, setTargets] = useState([]);

  const [incomingChanges, setIncomingChanges] = useState([]);

  const validateTarget = (incomingTarget) => {
    if (
      !targets.some(
        (target) => target.shelf_level_id === incomingTarget.shelf_level_id,
      )
    )
      setTarget(incomingTarget);
    else alert("La ubicación especificada ya está registrada.");
  };

  const prepareIncomingStock = (targetStock, incomingUnits) => {
    if (!incomingUnits) return;

    setIncomingChanges((prev) => [
      ...prev.filter(
        (element) => element.shelf_level_id != targetStock.shelf_level_id,
      ),
      {
        ...targetStock,
        stock_diff: incomingUnits,
      },
    ]);
  };

  const clearHooks = () => {
    setTarget({});
    setTargets([]);
    setIncomingChanges([]);
  };

  const handleRefresh = () => {
    clearHooks();
    api
      .get("reagents/reagent/" + material.reagent.reagent_id)
      .then((response) => {
        setMaterial(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleCancel = () => {
    clearHooks();
    navigate("/materials");
    setMaterial({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let cleanData = incomingChanges.map((data) => {
      const { location_type, local_stock_units, ...cleanEntry } = data;
      return cleanEntry;
    });

    const payload = {
      stock_data: cleanData,
      reagent_data: {
        reagent_id: material.reagent.reagent_id,
        reagent_name: material.reagent.reagent_name,
      },
    };

    api
      .post("/operations/restock", payload)
      .then((response) => {
        alert("Restock registrado exitosamente.");
        handleRefresh();
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (Object.hasOwn(target, "host_building"))
      setTargets((targets) => [...targets, target]);
  }, [target]);

  useEffect(() => {
    setMaterial(documentLocation.state);
  }, []);

  return (
    <div className="edit-stock-page">
      <Header />

      <div className="edit-stock-content">
        <Sidebar />

        <main className="edit-stock-main">
          <h1 className="edit-stock-title">Realizar Re-Stock</h1>

          <h2 className="edit-stock-name">{material.reagent_name}</h2>

          <p className="edit-stock-text">
            A continuación se encuentran los datos de la transferencia:
          </p>

          <form onSubmit={handleSubmit}>
            <div className="stocks-container">
              <LocationSelector
                label={"Registro manual:"}
                selectedLocation={target}
                setSelectedLocation={validateTarget}
                restricted={true}
              />

              <LineSubtitle subtitle={"Ubicaciones de Almacén Registradas"} />
              <table className="stock-table">
                <TableHeaders
                  headers={[
                    "Edificio",
                    "Ubicación",
                    "Estante",
                    "Nivel",
                    "Stock",
                    "Operaciones",
                  ]}
                />
                <tbody>
                  {material.locations != undefined
                    ? material.locations.map((location) =>
                        Number(location.local_stock_units) > 0 &&
                        Object.hasOwn(location, "shelf_level_number") ? (
                          <Stock
                            key={location.shelf_level_id}
                            location={location}
                            target={target}
                            setTarget={setTarget}
                            targets={targets}
                            setTargets={setTargets}
                          />
                        ) : null,
                      )
                    : null}
                </tbody>
              </table>
            </div>

            <div className="stock-container">
              <LineSubtitle subtitle={"Ubicaciones afectadas"} />
              <table className="stock-table">
                <TableHeaders
                  headers={[
                    "Edificio",
                    "Ubicación",
                    "Estante",
                    "Nivel",
                    "Stock Actual",
                    "Stock Entrante",
                  ]}
                />
                <tbody>
                  {targets.map((target) => (
                    <tr>
                      {SELECTED_LOCATIONS_TABLE.map((element) => (
                        <td>{element.render(target, prepareIncomingStock)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <LineSubtitle />

              <ButtonPane
                settings={[
                  ["Registrar", handleSubmit],
                  ["Cancelar", handleCancel],
                ]}
              />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Restock;
