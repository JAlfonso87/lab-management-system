import "./EditStockMaterial.css"

import { use, useState } from "react";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Stock from "../../components/Stock/Stock";

function EditStockMaterial() {

  const [material, setMaterial] = useState({
    id: 1,
    name: "Ácido sulfúrico",

    locations: [
      {
        id: 1,
        building: "C",
        location: "Almacen",
        shelf: "A",
        level: 2,
        stock: 15
      },
      {
        id: 2,
        building: "A",
        location: "Laboratorio 1",
        shelf: null,
        level: null,
        stock: 8
      },
      {
        id: 3,
        building: "B",
        location: "Laboratorio 3",
        shelf: null,
        level: null,
        stock: 12
      }
    ],

    totalStock: 35
  });

  const [building, setBuilding] = useState("");
  const [location, setLocation] = useState("");
  const [shelf, setShelf] = useState("");
  const [level, setLevel] = useState("");
  const [stock, setStock] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!building || !location || !stock) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (location === "Almacen" && (!shelf || !level)) {
      alert("Completa el estante y nivel")
      return;
    }

    if (isEdit) {
      setMaterial(prev => ({
        ...prev,
        locations: prev.locations.map(loc =>
          loc.id === currentId
            ? {
              ...loc,
              building,
              location,
              shelf: location === "Almacen" ? shelf : null,
              level: location === "Almacen" ? level : null,
              stock
            }
            : loc)
      }));
    } else {
      setMaterial(prev => ({
        ...prev,
        locations: [
          ...prev.locations,
          {
            id: Math.max(...prev.locations.map(loc => loc.id), 0) + 1,
            building,
            location,
            shelf,
            level,
            stock
          }
        ]
      }))
    }

    setBuilding("");
    setLocation("");
    setShelf("");
    setLevel("");
    setStock("");

    setIsEdit(false);
  }

  const handleCancel = () => {
    setBuilding("");
    setLocation("");
    setShelf("");
    setLevel("");
    setStock("");

    setIsEdit(false);
  }

  const handleDelete = (id) => {
    setMaterial(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id)
    }));
  }

  return (
    <div className="edit-stock-page">
      <Header />

      <div className="edit-stock-content">

        <Sidebar />

        <main className="edit-stock-main">

          <h1 className="edit-stock-title">
            Editar stock
          </h1>

          <h2 className="edit-stock-name">
            {material.name}
          </h2>

          <p className="edit-stock-text">
            {
              !isEdit
                ? "Escribe los siguientes datos para añadir un nuevo stock:"
                : "Cambia los datos que se desean cambiar para editar un stock:"
            }
          </p>

          <form onSubmit={handleSubmit}>

            <div className="stock-container">

              <div className="subtitle-container">
                <hr className="edit-stock-left-line" />
                <h2 className="subtitle-text">
                  {
                    !isEdit
                      ? "Añadir stock"
                      : "Editar stock"
                  }

                </h2>
                <hr className="edit-stock-right-line" />
              </div>

              <div className="edit-stock-container">
                <div className="building-input-container input-label">
                  <label htmlFor="building">Edificio</label>
                  <select
                    id="building"
                    className="building-input"
                    value={building}
                    onChange={event =>
                      setBuilding(event.target.value)
                    }
                  >
                    <option value="" disabled>Edificio</option>
                    <option value="A">A</option>
                  </select>
                </div>

                <div className="location-input-container input-label">
                  <label htmlFor="location">Ubicación</label>
                  <select
                    id="location"
                    className="location-input"
                    value={location}
                    onChange={event =>
                      setLocation(event.target.value)
                    }
                  >
                    <option value="" disabled>Ubicación</option>
                    <option value="Almacen">Almacen</option>
                    <option value="Laboratorio 1">Laboratorio 1</option>
                    <option value="Laboratorio 2">Laboratorio 2</option>
                    <option value="Laboratorio 3">Laboratorio 3</option>
                  </select>
                </div>

                {location === "Almacen" ? (
                  <>
                    <div className="shelf-input-container input-label">
                      <label htmlFor="shelf">Estante</label>
                      <input
                        id="shelf"
                        placeholder="Estante"
                        type="text"
                        className="shelf-input"
                        value={shelf}
                        onChange={event =>
                          setShelf(event.target.value)
                        }
                      />
                    </div>

                    <div className="level-input-container input-label">
                      <label htmlFor="level">Nivel</label>
                      <input
                        id="level"
                        placeholder="Nivel"
                        type="number"
                        className="level-input"
                        value={level}
                        onChange={event =>
                          setLevel(event.target.value)
                        }
                      />
                    </div>
                  </>
                ) : null}

                <div className="stock-input-container input-label">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    placeholder="Stock"
                    type="number"
                    className="stock-input"
                    value={stock}
                    onChange={event =>
                      setStock(event.target.value)
                    }
                  />
                </div>

                <div>
                  {
                    !isEdit
                      ? (
                        <button
                          className="add-stock-button"
                          type="submit"
                        >
                          Añadir
                        </button>
                      ) : (
                        <>
                          <button
                            className="save-stock-button"
                            type="submit"
                          >
                            Guardar
                          </button>

                          <button
                            className="cancel-stock-button"
                            type="button"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </button>
                        </>
                      )
                  }

                </div>
              </div>

            </div>

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
                    material.locations.map((loc) => (
                      <Stock
                        key={loc.id}
                        loc={loc}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        setBuilding={setBuilding}
                        setLocation={setLocation}
                        setShelf={setShelf}
                        setLevel={setLevel}
                        setStock={setStock}
                        setCurrentId={setCurrentId}
                        onDelete={handleDelete}
                      />
                    ))
                  }
                </tbody>
              </table>

            </div>

          </form>

        </main>

      </div>
    </div>
  );
}

export default EditStockMaterial;