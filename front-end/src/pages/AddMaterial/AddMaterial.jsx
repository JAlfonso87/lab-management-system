import styles from "./AddMaterial.module.css";
import "../../assets/styles/common.css";

import { useState } from "react";
import { api } from "../../axios/api";
import { Header, Sidebar, LocationSelector } from "../../components/Components";
import {
  LineSubtitle,
  TextInput,
  SelectorInput,
} from "../../mini-components/Minicomponents";

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !brand || !weight || !unit || !color || !stock) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (Number(weight) <= 0 || Number(stock) <= 0) {
      alert(
        "Valor/es inválido/s detectado/s. NOTA: Las unidades de stock y la masa deben de superar las 0 unidades.",
      );
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
        shelf_level_id: Number(selectedLocation.shelf_level_id),
      },
      operation_data: {
        stock_units: Number(stock),
      },
    };

    try {
      const new_reagent = await api.post(
        "/operations/new_reagent",
        reagent_registration_payload,
      );
      alert("El reactivo se ha añadido con éxito.");
      clearData();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div className={styles["add-material-page"]}>
      <Header />

      <div className={styles["add-material-content"]}>
        <Sidebar />

        <main className={styles["add-material-main"]}>
          <h1 className={styles["add-material-title"]}>Nuevo Material</h1>

          <p className={styles["add-material-text"]}>
            Escribe los siguientes datos para registrar un nuevo reactivo:
          </p>

          <form id="reagentForm" onSubmit={handleSubmit}>
            <div className={styles["material-properties"]}>
              <LineSubtitle subtitle={"Datos del reactivo"} />

              <div className={styles["properties-container"]}>
                <TextInput
                  id={"Nombre"}
                  type={"text"}
                  size={"XXL"}
                  target={name}
                  setter={setName}
                />

                <TextInput
                  id={"Marca"}
                  type={"text"}
                  size={"L"}
                  target={brand}
                  setter={setBrand}
                />
              </div>

              <div className={styles["properties-container"]}>
                <div className={styles["weight-unit-container"]}>
                  <TextInput
                    id={"Masa"}
                    type={"number"}
                    size={"XS"}
                    target={weight}
                    setter={setWeight}
                  />

                  <span className={styles["weight-unit-sign"]}>+</span>

                  <TextInput
                    id={"Unidad"}
                    type={"text"}
                    size={"XS"}
                    target={unit}
                    setter={setUnit}
                  />
                </div>

                <SelectorInput
                  id={"Color"}
                  size={"S"}
                  target={color}
                  setter={setColor}
                  options={["Blanco", "Amarillo", "Rojo", "Verde", "Azul"]}
                />
              </div>

              <div className={styles["properties-container"]}>
                <TextInput
                  id={"Imagen"}
                  type={"file"}
                  size={"M"}
                  target={image}
                  setter={setImage}
                  config={{ accept: "image/*" }}
                />
              </div>
            </div>

            <LocationSelector
              label={"Ubicación del reactivo"}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              deact={Object.keys(selectedLocation).length != 0}
              restricted={true}
            />

            <LineSubtitle subtitle={"Stock del reactivo"} />
            <TextInput
              id={"Stock"}
              type={"number"}
              size={"XS"}
              target={stock}
              setter={setStock}
            />

            <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
            <button type="submit" className="gray-button">
              Añadir reactivo
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddMaterial;
