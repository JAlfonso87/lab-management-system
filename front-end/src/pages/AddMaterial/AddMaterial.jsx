import "./AddMaterial.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { useEffect, useState } from "react";
import axios from "axios";

function AddMaterial() {

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState("");
  const [building, setBuilding] = useState("");
  const [location, setLocation] = useState("");
  const [stock, setStock] = useState("");

  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState("");
  const [levels, setLevels] = useState([])
  const [selectedLevel, setSelectedLevel] = useState("");

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
  })

  const getShelves = async () => {
     let shelves;
     if(location == "Almacen") {
        shelves = await api.get('/locations/shelves', {
          params: {
            host_building: building
          }
        })
        setShelves(shelves.data);
     }
  }

  const getShelfLevels = async() => {
      console.log(selectedShelf)
      let levels = await api.get('/locations/shelf/levels', {
        params: {
          shelf_id: selectedShelf
        }
      })
      setLevels(levels.data)
  }

  useEffect(() => {
    getShelves()
  }, [location])

  useEffect(() => {
    getShelfLevels()
  }, [selectedShelf])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !brand || !weight || !unit || !color || !building || !location || !stock) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (location === "Almacen" && (!selectedShelf || !selectedLevel)) {
      alert("Completa el estante y nivel")
      return;
    }

    const reagent_registration_payload = {
      reagent_data: {
        reagent_name: name.toUpperCase(),
        reagent_brand: brand.toUpperCase(),
        reagent_netweight: `${weight} ${unit}`,
        reagent_risk: color.toLocaleUpperCase(),
      },
      location_data: {
        host_building: building.toUpperCase(),
        shelf_id: Number(selectedShelf),
        shelf_level_id: Number(selectedLevel)
      },
      operation_data: {
        stock_units: Number(stock)
      }
      
    }

    try {
        const new_reagent = await api.post('/operations/new_reagent', reagent_registration_payload);
        alert('El reactivo se ha añadido con éxito.')
        document.getElementById("reagentForm").reset()
    } catch(error) {
      console.error(error);
      alert(error);
    }

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

          <form id = "reagentForm" onSubmit = {handleSubmit}>

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
                
                { 
                  building ? (
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
                      </select>
                    </div>
                  ) : null
                }
                

                {
                  location === "Almacen" ? (
                  <>
                    <div className="shelf-input-container input-label">
                      <label htmlFor="shelf">Estante</label>
                      <select value = {selectedShelf} className = "shelf-input" onChange = {event => setSelectedShelf(event.target.value)}>
                          <option value = "" disabled>Estante</option>
                          {
                            shelves.map((shelf) => (
                              <option key = {shelf.shelf_number} value = {shelf.shelf_id}>
                                {shelf.shelf_number}
                              </option>
                            ))
                          }
                      </select>
                    </div> 
                  </>
                  ) : null
                }
                
                {
                  selectedShelf != "" && location === "Almacen" ? 
                  (
                    <div className="level-input-container input-label">
                      <label htmlFor="level">Nivel</label>
                      <select value = {selectedLevel} className = "level-input" onChange = {event => setSelectedLevel(event.target.value)}>
                          <option value = "" disabled>Nivel</option>
                          {
                            levels.map((level) => (
                              <option key = {level.shelf_level_number} value = {level.shelf_level_id}>
                                {level.shelf_level_number}
                              </option>
                            ))
                          }
                      </select>
                    </div>
                  ) : null
                }

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