import { useEffect, useState } from "react";
import { api } from "../../axios/api";

import "./LocationSelector.css";
import "../../assets/styles/common.css";

import LineSubtitle from "../../mini-components/LineSubtitle";
import SelectorInput from "../../mini-components/SelectorInput";

function LocationSelector({
  label,
  selectedLocation,
  setSelectedLocation,
  restricted,
  deact = false,
}) {
  const [shelves, setShelves] = useState([]);
  const [shelfLevels, setShelfLevels] = useState([]);
  const [labs, setLabs] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedLocationType, setSelectedLocationType] = useState("");

  const [selectedShelf, setSelectedShelf] = useState("");
  const [shelfObject, setShelfObject] = useState({});

  const [selectedShelfLevel, setSelectedShelfLevel] = useState("");
  const [shelfLevelObject, setShelfLevelObject] = useState({});

  const [selectedLab, setSelectedLab] = useState("");
  const [labObject, setLabObject] = useState({});

  const [ready, setReady] = useState(false);

  const alreadyStored = (location) => {
    return Object.hasOwn(location, "host_building");
  };

  const availableLocations = () => {
    const locations = ["Almacen", "Laboratorio"].map((type) => {
      if (restricted == true) {
        if (type == "Almacen") {
          return type;
        }
      } else return type;
    });
    return locations;
  };

  const clearFields = () => {
    setShelves([]);
    setShelfLevels([]);
    setLabs([]);
    setSelectedBuilding("");
    setSelectedLocationType("");
    setSelectedShelf("");
    setSelectedShelfLevel("");
    setSelectedLab("");
    setReady(false);
  };

  const findShelf = (shelf_id) => {
    if (shelves.length != 0)
      setShelfObject(shelves.find((shelf) => shelf.shelf_id == shelf_id));
  };

  const findShelfLevel = (shelf_level_id) => {
    if (shelfLevels.length != 0)
      setShelfLevelObject(
        shelfLevels.find(
          (shelfLevel) => shelfLevel.shelf_level_id == shelf_level_id,
        ),
      );
  };

  const findLab = (lab_id) => {
    if (labs.length != 0)
      setLabObject(labs.find((lab) => lab.lab_id == lab_id));
  };

  const getLabs = () => {
    if (selectedLocationType == "Laboratorio")
      api
        .get("/locations/labs", { params: { host_building: selectedBuilding } })
        .then((labs) => setLabs(labs.data))
        .catch((error) => console.error(error));
  };

  const getShelves = () => {
    if (selectedLocationType == "Almacen")
      api
        .get("/locations/shelves", {
          params: { host_building: selectedBuilding },
        })
        .then((shelves) => setShelves(shelves.data))
        .catch((error) => console.error(error));
  };

  const getShelfLevels = () => {
    if (selectedShelf)
      api
        .get("/locations/shelf/levels", { params: { shelf_id: selectedShelf } })
        .then((levels) => setShelfLevels(levels.data))
        .catch((error) => console.error(error));
  };

  const isPayloadReady = () => {
    return !selectedBuilding || !selectedLocationType
      ? false
      : () => {
          if (selectedLocationType == "Almacen")
            return !selectedShelf || !selectedShelfLevel ? false : true;
          else if (selectedLocationType == "Laboratorio")
            return !selectedLab ? false : true;
        };
  };

  const prepareLocationPayload = () => {
    let payload = {};

    if (!selectedBuilding) {
      alert(
        "Por favor, selecciona un edificio para continuar con el registro de ubicación.",
      );
      return;
    }

    if (selectedLocationType === "Almacen") {
      if (!selectedShelf || !selectedShelfLevel) {
        alert("Por favor, completa los datos del estante objetivo.");
        return;
      }

      payload = {
        location_type: selectedLocationType,
        host_building: selectedBuilding,
        shelf_number: shelfObject.shelf_number,
        shelf_id: shelfObject.shelf_id,
        shelf_level_id: shelfLevelObject.shelf_level_id,
        shelf_level_number: shelfLevelObject.shelf_level_number,
      };
    } else if (selectedLocationType === "Laboratorio") {
      if (!selectedLab) {
        alert("Por favor, completa los datos del laboratorio objetivo.");
        return;
      }

      payload = {
        location_type: selectedLocationType,
        host_building: selectedBuilding,
        lab_name: labObject.lab_name,
        lab_id: labObject.lab_id,
      };
    } else {
      alert("Por favor, especifica el tipo de ubicación.");
      return;
    }

    setSelectedLocation(payload);
  };

  useEffect(() => {
    console.log(selectedLocation);
  }, []);

  useEffect(() => {
    if (alreadyStored(selectedLocation) == false) clearFields();
  }, [selectedLocation]);

  useEffect(() => {
    findShelf(selectedShelf);
    getShelfLevels();
  }, [selectedShelf]);

  useEffect(() => {
    findShelfLevel(selectedShelfLevel);
  }, [selectedShelfLevel]);

  useEffect(() => {
    findLab(selectedLab);
  }, [selectedLab]);

  useEffect(() => {
    if (selectedBuilding && selectedLocationType)
      selectedLocationType == "Almacen" ? getShelves() : getLabs();
  }, [selectedLocationType, selectedBuilding]);

  useEffect(
    () => setReady(isPayloadReady()),
    [
      selectedBuilding,
      selectedLocationType,
      selectedShelf,
      selectedShelfLevel,
      selectedLab,
    ],
  );

  return (
    <div>
      <LineSubtitle subtitle={label} />

      <div className="location-container" style={{ gap: "20px" }}>
        <SelectorInput
          id={"Edificio"}
          size={"XS"}
          target={selectedBuilding}
          setter={setSelectedBuilding}
          options={["A"]}
          config={{
            required: true,
            disabled: deact,
          }}
        />

        {selectedBuilding ? (
          <SelectorInput
            id={"Ubicación"}
            size={"S"}
            target={selectedLocationType}
            setter={setSelectedLocationType}
            options={availableLocations()}
            config={{
              required: true,
              disabled: deact,
            }}
          />
        ) : null}

        {selectedLocationType === "Almacen" ? (
          <SelectorInput
            id={"Estante"}
            size={"S"}
            target={selectedShelf}
            setter={setSelectedShelf}
            options={shelves}
            idspec={"shelf_id"}
            opspec={"shelf_number"}
            config={{
              required: true,
              disabled: deact,
            }}
          />
        ) : null}

        {selectedShelf != "" && selectedLocationType === "Almacen" ? (
          <SelectorInput
            id={"Nivel"}
            size={"S"}
            target={selectedShelfLevel}
            setter={setSelectedShelfLevel}
            options={shelfLevels}
            idspec={"shelf_level_id"}
            opspec={"shelf_level_number"}
            config={{
              required: true,
              disabled: deact,
            }}
          />
        ) : null}

        {selectedLocationType == "Laboratorio" ? (
          <SelectorInput
            id={"Designación"}
            size={"M"}
            target={selectedLab}
            setter={setSelectedLab}
            options={labs}
            idspec={"lab_id"}
            opspec={"lab_name"}
            config={{
              required: true,
              disabled: deact,
            }}
          />
        ) : null}

        {ready ? (
          <button
            type="button"
            className="gray-button location-selector-button"
            onClick={() => prepareLocationPayload()}
          >
            Agregar ubicación
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default LocationSelector;
