import "./AddMaterial.css"

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { useState } from "react";
import { api } from "../../axios/api";
import LocationSelector from "../../components/LocationSelector/LocationSelector";

function AddMaterial() {

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

  const [selectedLocation, setSelectedLocation] = useState({});

  const clearData = () => {
    setName("");
    setBrand("");
    setWeight("");
    setUnit("");
    setColor("");
    setImage("");
    setStock("");
    setSelectedLocation({});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !brand || !weight || !unit || !color || !stock) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (Number(weight) <= 0 || Number(stock) <= 0) {
      alert("Valor/es inválido/s detectado/s. NOTA: Las unidades de stock y la masa deben de superar las 0 unidades.");
      return;
    }

    const reagent_registration_payload = {
      reagent_data: {
        reagent_name: name.toUpperCase(),
        reagent_brand: brand.toUpperCase(),
        reagent_netweight: `${weight}${unit}`,
        reagent_risk: color.toUpperCase(),
      },
      location_data: {
        host_building: selectedLocation.host_building.toUpperCase(),
        shelf_id: Number(selectedLocation.shelf_id),
        shelf_level_id: Number(selectedLocation.shelf_level_id)
      },
      operation_data: {
        stock_units: Number(stock)
      }

    }

    try {
      const new_reagent = await api.post('/operations/new_reagent', reagent_registration_payload);
      alert('El reactivo se ha añadido con éxito.')
      clearData()
    } catch (error) {
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
            Nuevo Material
          </h1>

          <p className="add-material-text">
            Escribe los siguientes datos para
            registrar un nuevo reactivo:
          </p>

          <form id="reagentForm" onSubmit={handleSubmit}>

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
                    className="image-input"
                    value={image}
                    onChange={event =>
                      setImage(event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="material-location">
              <LocationSelector
                label={"Ubicación del reactivo"}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
              />
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