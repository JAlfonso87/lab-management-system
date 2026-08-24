import "./Stock.css"

function Stock({
  location,
  source,
  setSource,
  destination,
  setDestination
}) {
  const loadSource = (location) => {
      console.log("SOURCE")
      console.log(location)
      setSource(location)
  }

  const loadDestination = (location) => {
      console.log("DESTINATION")
      console.log(location)
      setDestination(location)
  }

  const validSelection = () => {
    if(Object.hasOwn(source, "host_building") && Object.hasOwn(destination, "host_building"))
      return true;
    else
      return location.shelf_level_id == source.shelf_level_id ? true : false;
  }

  return (
    <tr className="stock-data">
      <td>{location.host_building}</td>
      <td>{Object.hasOwn(location, "shelf_level_number") ? "Almacén" : "Laboratorio"}</td>
      <td>{location.shelf_number ? location.shelf_number : "-"}</td>
      <td>{location.shelf_level_number ? location.shelf_level_number : "-"}</td>
      <td>{location.local_stock_units}</td>
      <td className="operation-buttons">
        {
            <>
              <button
                className="stock-edit-button"
                type="button"
                onClick = { () => { Object.hasOwn(source, "host_building") ? loadDestination(location) : loadSource(location) }}
                disabled = { validSelection() }
              >
                Seleccionar { Object.hasOwn(source, "host_building") ? "Destino" : "Origen" }
              </button>

            </>
        }
      </td>
    </tr>
  );
}

export default Stock;