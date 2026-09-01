import { useState } from "react"
import "./Stock.css"

function Stock({
  location,
  target,
  setTarget,
  targets,
  setTargets,
  globalDisable
}) {

  const [selected, setSelected] = useState({})

  const addMaterialEnabled = () => {
    if(!globalDisable)
      return targets.some((element) => element === selected)
    else
      return globalDisable;
  };
  
  return (
    <tr className="stock-data">
      <td>{location.host_building}</td>
      <td>{Object.hasOwn(location, "shelf_level_number") ? "ALMACÉN" : "LAB. " + location.lab_name.replace("_", " ")}</td>
      <td>{location.shelf_number ? location.shelf_number : "-"}</td>
      <td>{location.shelf_level_number ? location.shelf_level_number : "-"}</td>
      <td>{location.local_stock_units}</td>
      <td className="operation-buttons">
        {
            <>
              <button
                className="stock-edit-button"
                type="button"
                onClick = { () => { 
                  setSelected(location); 
                  setTarget(location);
                }}
                disabled = { addMaterialEnabled() }
              >
                Seleccionar Ubicación
              </button>

            </>
        }
      </td>
    </tr>
  );
}

export default Stock;