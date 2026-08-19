import "./AddMaterial.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { useState } from "react";

function AddMaterial() {

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [shelf, setShelf] = useState("");
  const [level, setLevel] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !brand || !weight || !unit || !color || !location || !stock) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (location === "Almacen" && (!shelf || !level)) {
      alert("Completa el estante y nivel")
      return;
    }

    const material = {
      name,
      brand,
      weight: `${weight} ${unit}`,
      color,
      image,
      location,
      shelf,
      level: Number(level),
      status: Number(stock) > 0 ? "Disponible" : "Agotado",
      stock: Number(stock)
    };

    console.log(material)
  }


  return (
    <div className="add-material-page">

      <Header />

      <div className="add-material-content">

        <Sidebar />

        <main className="add-material-main">

          <h1 className="add-material-title">
            Agregar
          </h1>

          <p className="add-material-text">
            Escribe los siguientes datos para
            registrar un nuevo reactivo:
          </p>

          <form onSubmit={handleSubmit}>

            <div className="material-properties">
              <div className="subtitle-container">
                <hr className="add-material-left-line" />
                <h2 className="subtitle-text">Datos del reactivo</h2>
                <hr className="add-material-right-line" />
              </div>

              <div className="properties-container1">
                <div className="name-input-container input-label">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    placeholder="Nombre"
                    type="text"
                    className="name-input"
                    value={name}
                    onChange={event =>
                      setName(event.target.value)
                    }
                  />
                </div>

                <div className="brand-input-container input-label">
                  <label htmlFor="brand">Marca</label>
                  <input
                    id="brand"
                    placeholder="Marca"
                    type="text"
                    className="brand-input"
                    value={brand}
                    onChange={event =>
                      setBrand(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="properties-container2">

                <div className="weight-unit-container">
                  <div className="weight-input-container input-label">
                    <label htmlFor="weight">Masa</label>
                    <input
                      id="weight"
                      placeholder="Masa"
                      type="number"
                      className="weight-input"
                      value={weight}
                      onChange={event =>
                        setWeight(event.target.value)
                      }
                    />
                  </div>

                  <span className="weight-unit-sign">+</span>

                  <div className="unit-input-container input-label">
                    <label htmlFor="unit">Unidad</label>
                    <input
                      id="unit"
                      placeholder="Unidad"
                      type="text"
                      className="unit-input"
                      value={unit}
                      onChange={event =>
                        setUnit(event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="color-input-container input-label">
                  <label htmlFor="color">Color</label>
                  <select
                    id="color"
                    className="color-input"
                    value={color}
                    onChange={event =>
                      setColor(event.target.value)
                    }
                  >
                    <option value="" disabled>Color</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Amarillo">Amarillo</option>
                    <option value="Rojo">Rojo</option>
                  </select>
                </div>

              </div>

              <div className="properties-container3">
                <div className="input-label">
                  <label htmlFor="image">Imagen</label>
                  <input
                    id="image"
                    placeholder="Imagen"
                    type="file"
                    accept="image/*"
                    value={image}
                    onChange={event =>
                      setImage(event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="material-location">
              <div className="subtitle-container">
                <hr className="add-material-left-line" />
                <h2 className="subtitle-text">Ubicación del reactivo</h2>
                <hr className="add-material-right-line" />
              </div>

              <div className="location-container">
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
              </div>
            </div>

            <div className="material-stock">
              <div className="subtitle-container">
                <hr className="add-material-left-line" />
                <h2 className="subtitle-text">Stock del reactivo</h2>
                <hr className="add-material-right-line" />
              </div>

              <div className="input-label">
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
            </div>

            <hr className="add-bottom-line" />
            <button
              type="submit"
              className="add-material-button"
            >
              Añadir reactivo
            </button>

          </form>

        </main>

      </div>

    </div>
  );
}

export default AddMaterial;