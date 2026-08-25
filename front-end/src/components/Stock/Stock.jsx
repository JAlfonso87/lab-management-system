import { useState } from "react"
import "./Stock.css"

function Stock({
  location,
  target,
  setTarget,
  targets,
  setTargets,
  disablingCondition
}) {

  const [selected, setSelected] = useState({})

  const alreadyStored = () => {
    let locationType = Object.hasOwn(selected, "shelf_level_id") ? "Almacen" : Object.hasOwn(selected, "lab_name") ? "Laboratorio" : null;
    
    if(disablingCondition == false)
      return targets.some((target_record) => {
          if(locationType == "Almacen")
            return target_record.shelf_level_id == selected.shelf_level_id;
          
          if (locationType == "Laboratorio")
            return target_record.lab_name == selected.lab_name;
      });
    else if (disablingCondition == true)
        return true;
  }

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
                disabled = { alreadyStored() }
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