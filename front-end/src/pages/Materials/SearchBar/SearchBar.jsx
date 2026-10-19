import { useEffect, useState } from "react";

import searchIcon from "../../../assets/images/search.png";

import "../../../assets/styles/common.css";
import "./SearchBar.css";
import { LocationManager } from "../../../mini-components/Minicomponents";
function SearchBar({
  searchTerm,
  setSearchTerm,
  setRiskFilter,
  setLocationFilter,
}) {
  //hooks de búsqueda

  const [selectedRisk, setSelectedRisk] = useState("Todos");
  const [selectedLocation, setSelectedLocation] = useState(null);

  //ubicaciones recuperadas
  const [shelves, setShelves] = useState([]);
  const [shelfLevels, setShelfLevels] = useState([]);
  const [labs, setLabs] = useState([]);

  //ubicaciones seleccionadas
  const [selectedLocationType, setSelectedLocationType] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("");
  const [selectedShelfLevel, setSelectedShelfLevel] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const risks = ["Rojo", "Amarillo", "Azul", "Blanco", "Verde"];

  const search = (event) => {
    event.preventDefault();

    setRiskFilter(selectedRisk);
    setLocationFilter(selectedLocation);
  };

  return (
    <section
      className="search-section"
      style={{ flexDirection: "column", alignItems: "center" }}
    >
      <LocationManager
        selectedLocationType={selectedLocationType}
        selectedBuilding={selectedBuilding}
        selectedShelf={selectedShelf}
        selectedShelfLevel={selectedShelfLevel}
        selectedLab={selectedLab}
        setShelves={setShelves}
        setShelfLevels={setShelfLevels}
        setLabs={setLabs}
      />
      <form className="search-form" onSubmit={(event) => search(event)}>
        <div className="search-container">
          <input
            placeholder="Buscar reactivo"
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit" className="search-button">
            <img src={searchIcon} alt="Icono de buscar" />
          </button>
        </div>
      </form>
      <section>
        <div className="filter-container">
          <label htmlFor="color" className="filter-label">
            Riesgo
          </label>
          <select
            id="color"
            className="material-filter"
            value={selectedRisk}
            onChange={(event) => setSelectedRisk(event.target.value)}
          >
            <option value="Todos">Todos</option>
            {risks.length != 0
              ? risks.map((risk) => <option>{risk}</option>)
              : null}
          </select>

          <label htmlFor="edificio" className="filter-label">
            Edificio
          </label>
          <select
            id="building"
            className="material-filter"
            value={selectedBuilding}
            onChange={(event) => setSelectedBuilding(event.target.value)}
          >
            <option disabled value={""}>
              Edificio
            </option>
            <option value="A">A</option>
          </select>

          {selectedBuilding.trim().length != 0 ? (
            <div>
              <label htmlFor="edificio" className="filter-label">
                Ubicación
              </label>
              <select
                id="loctype"
                className="material-filter"
                value={selectedLocationType}
                onChange={(event) =>
                  setSelectedLocationType(event.target.value)
                }
              >
                <option disabled value="">
                  Ubicación
                </option>
                <option value="Almacen">Almacén</option>
                <option value="Laboratorio">Laboratorio</option>
              </select>
            </div>
          ) : null}

          {selectedLocationType === "Almacen" ? (
            <div>
              <label htmlFor="shelf" className="filter-label">
                Estante
              </label>
              <select
                id="shelf"
                className="material-filter"
                value={selectedShelf}
                onChange={(event) => {
                  setSelectedShelf(
                    shelves.find(
                      (shelf) => shelf.shelf_id == event.target.value,
                    ),
                  );
                }}
              >
                <option disabled value="">
                  Número
                </option>
                {shelves.length != 0
                  ? shelves.map((shelf) => (
                      <option value={shelf.shelf_id}>
                        {shelf.shelf_number}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          ) : null}

          {selectedShelf != "" && selectedLocationType === "Almacen" ? (
            <div>
              <label htmlFor="shelf" className="filter-label">
                Nivel
              </label>
              <select
                id="level"
                className="material-filter"
                value={selectedShelfLevel}
                onChange={(event) => {
                  setSelectedLocation(
                    shelfLevels.find(
                      (level) => level.shelf_level_id == event.target.value,
                    ).shelf_level_id,
                  );
                  setSelectedShelfLevel(
                    shelfLevels.find(
                      (level) => level.shelf_level_id == event.target.value,
                    ),
                  );
                }}
              >
                <option disabled value={""}>
                  Nivel
                </option>
                {shelfLevels.length != 0
                  ? shelfLevels.map((level) => (
                      <option value={level.shelf_level_id}>
                        {level.shelf_level_number}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          ) : null}

          {selectedLocationType == "Laboratorio" ? (
            <div>
              <label htmlFor="shelf" className="filter-label">
                Designación
              </label>
              <select
                id="lab"
                className="material-filter"
                value={selectedLab}
                onChange={(event) => {
                  setSelectedLocation(
                    labs.find((lab) => lab.lab_id == event.target.value).lab_id,
                  );
                  setSelectedLab(
                    labs.find((lab) => lab.lab_id == event.target.value),
                  );
                }}
              >
                <option disabled value={""}>
                  Designación
                </option>
                {labs.length != 0
                  ? labs.map((lab) => (
                      <option value={lab.lab_id}>
                        {lab.lab_name.replace("_", " ")}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  );
}

export default SearchBar;
