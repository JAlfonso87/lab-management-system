import "./Materials.css"

import searchIcon from "../../assets/images/search.png"
import image from "../../assets/images/image.png"

import { useEffect, useState } from "react";
import axios from 'axios';

import Header from "../../components/Header/Header.jsx"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MaterialCard from "../../components/MaterialCard/MaterialCard.jsx";
import MaterialModal from "../../components/MaterialModal/MaterialModal.jsx";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
})

const normalizeText = text =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function Materials() {

  const [materials, setMaterials] = useState([]);
  /*const [materials, setMaterials] = useState([
    {
      id: 1,
      name: "Ácido sulfúrico",
      brand: "Merck",
      weight: "500 g",
      color: "Amarillo",
      location: "Laboratorio 1",
      shelf: "A",
      level: 2,
      status: "Disponible",
      stock: 15
    },
    {
      id: 2,
      name: "Ácido clorhídrico",
      brand: "Sigma-Aldrich",
      weight: "1 kg",
      color: "Amarillo",
      location: "Laboratorio 2",
      shelf: "B",
      level: 1,
      status: "Disponible",
      stock: 8
    },
    {
      id: 3,
      name: "Hidróxido de sodio",
      brand: "Fermont",
      weight: "250 g",
      color: "Blanco",
      location: "Laboratorio 1",
      shelf: "C",
      level: 3,
      status: "Agotado",
      stock: 0
    },
    {
      id: 4,
      name: "Sulfato de cobre",
      brand: "J.T. Baker",
      weight: "500 g",
      color: "Azul",
      location: "Laboratorio 3",
      shelf: "A",
      level: 2,
      status: "Disponible",
      stock: 12
    }
  ]);*/

  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState("Todos");
  const [locationFilter, setLocationFilter] = useState("Todos")

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedColor, setAppliedColor] = useState("Todos");
  const [appliedLocation, setAppliedLocation] = useState("Todos");

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const filteredMaterials = materials.filter(material =>
    normalizeText(material.reagent_name).includes(normalizeText(searchTerm)) &&
    (material.reagent_risk === appliedColor || appliedColor === "Todos") /*&&
    (material.location === appliedLocation || appliedLocation === "Todos")*/
  );

  const deleteMaterial = (id) => {
    setMaterials(
      materials.filter(material => material.reagent_id !== id)
    );
  }

  useEffect(() => {
    const getReagents = async () => {
        let reagents = await api.get('/reagents/all');
        setMaterials(reagents.data)
    } 
    getReagents()
  }, [])

  return (
    <div className="materials-page">

      <Header />

      <div className="materials-content">

        <Sidebar />

        <main className="main-section">

          <h1 className="materials-title">
            Materiales
          </h1>

          <section className="search-section">

            <form
              className="search-form"
              onSubmit={(event) => {
                event.preventDefault();

                setSearchTerm(search);
                setAppliedColor(colorFilter);
                setAppliedLocation(locationFilter);
              }}
            >

              <div className="search-container">

                <input
                  placeholder="Buscar reactivo"
                  type="text"
                  className="search-input"
                  value={search}
                  onChange={event =>
                    setSearch(event.target.value)
                  }
                />

                <button
                  type="submit"
                  className="search-button"
                >
                  <img
                    src={searchIcon}
                    alt="Icono de buscar"
                  />
                </button>

              </div>

              <div className="filter-container">
                <span>Filtros:</span>

                <label
                  htmlFor="color"
                  className="filter-label"
                >
                  Color
                </label>
                <select
                  id="color"
                  className="material-filter"
                  value={colorFilter}
                  onChange={event =>
                    setColorFilter(event.target.value)
                  }
                >
                  <option>Todos</option>
                  <option>Blanco</option>
                  <option>Amarillo</option>
                  <option>Rojo</option>
                </select>

                <label
                  htmlFor="location"
                  className="filter-label"
                >
                  Ubicación
                </label>
                <select
                  id="location"
                  className="material-filter"
                  value={locationFilter}
                  onChange={event =>
                    setLocationFilter(event.target.value)
                  }
                >
                  <option>Todos</option>
                  <option>Almacen</option>
                  <option>Laboratorio 1</option>
                  <option>Laboratorio 2</option>
                  <option>Laboratorio 3</option>
                </select>

              </div>

            </form>

          </section>

          <section className="materials-section">

            <h2 className="materials-subtitle">Resultados</h2>

            {filteredMaterials.length === 0
              ? (
                <p className="no-results">
                  No se encontraron resultados relacionados a:<br />
                  Busqueda: <strong>{searchTerm}</strong> <br />
                  Color: <strong>{appliedColor}</strong> <br />
                  Ubicación: <strong>{appliedLocation}</strong>
                </p>
              )
              : null
            }

            <div className="cards-container">

              {filteredMaterials.map(material => (
                <MaterialCard
                  key={material.reagent_id}
                  image={image}
                  {...material}
                  onClick={() =>
                    setSelectedMaterial(material)
                  }
                />
              ))}

            </div>

          </section>

          {selectedMaterial !== null && (
            <MaterialModal
              material={selectedMaterial}
              image={image}
              onClose={
                () => setSelectedMaterial(null)
              }
              onDelete={deleteMaterial}
            />
          )}

        </main>

      </div>

    </div>
  );

}

export default Materials;