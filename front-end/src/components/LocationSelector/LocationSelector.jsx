import { useEffect, useState } from "react";

import "./LocationSelector.css";
import "../../assets/styles/common.css";

import {
  LineSubtitle,
  SelectorInput,
  LocationManager,
} from "../../mini-components/Minicomponents";

import { PropertyValidator } from "../../assets/utils/PropertyValidator";

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

  const [selectedShelf, setSelectedShelf] = useState();
  const [selectedShelfLevel, setSelectedShelfLevel] = useState();
  const [selectedLab, setSelectedLab] = useState();

  const [ready, setReady] = useState(false);

  const alreadyStored = (location) => {
    return Object.hasOwn(location, "host_building");
  };

  const availableLocations = () => {
    const locations = ["Almacen", "Laboratorio"].filter((type) => {
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
    let required = [];

    if (selectedLocationType === "Almacen")
      required = [
        selectedLocationType,
        selectedBuilding,
        selectedShelf,
        selectedShelfLevel,
      ];

    if (selectedLocationType === "Laboratorio")
      required = [selectedLocationType, selectedBuilding, selectedLab];

    if (PropertyValidator(required) == false) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    let payload = {};

    if (selectedLocationType === "Almacen") {
      payload = {
        location_type: selectedLocationType,
        host_building: selectedBuilding,
        shelf_number: selectedShelf.shelf_number,
        shelf_id: selectedShelf.shelf_id,
        shelf_level_id: selectedShelfLevel.shelf_level_id,
        shelf_level_number: selectedShelfLevel.shelf_level_number,
      };
    } else if (selectedLocationType === "Laboratorio") {
      payload = {
        location_type: selectedLocationType,
        host_building: selectedBuilding,
        lab_name: selectedLab.lab_name,
        lab_id: selectedLab.lab_id,
      };
    }

    setSelectedLocation(payload);
  };

  useEffect(() => {
    if (alreadyStored(selectedLocation) == false) clearFields();
  }, [selectedLocation]);

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
            returnType={"object"}
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
            returnType={"object"}
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
            returnType={"object"}
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
