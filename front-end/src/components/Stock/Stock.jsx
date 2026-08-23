import "./Stock.css"

function Stock({
  loc,
  isEdit,
  setIsEdit,
  setBuilding,
  setLocation,
  setShelf,
  setLevel,
  setStock,
  setCurrentId,
  onDelete
}) {

  const handleEdit = () => {
    setIsEdit(true);

    setBuilding(loc.building);
    setLocation(loc.location);
    setShelf(!loc.shelf ? "" : loc.shelf);
    setLevel(!loc.level ? "" : loc.level);
    setStock(loc.stock);

    setCurrentId(loc.id);
  }

  return (
    <tr className="stock-data">
      <td>{loc.building}</td>
      <td>{loc.location}</td>
      <td>{loc.shelf ? loc.shelf : "-"}</td>
      <td>{loc.level ? loc.level : "-"}</td>
      <td>{loc.stock}</td>
      <td className="operation-buttons">
        {
          !isEdit
            ? (
              <>
                <button
                  className="stock-edit-button"
                  type="button"
                  onClick={handleEdit}
                >
                  Editar
                </button>

                <button
                  className="stock-delete-button"
                  type="button"
                  onClick={() =>
                    onDelete(loc.id)
                  }
                >
                  Eliminar
                </button>
              </>
            ) : null
        }


      </td>
    </tr>
  );
}

export default Stock;