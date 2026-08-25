import { useEffect, useState } from "react";
import { api } from "../../axios/api";

import "./LocationSelector.css"

function LocationSelector({
    label,
    selectedLocation,
    setSelectedLocation,
    restricted
}) 
{
    const [shelves, setShelves] = useState([]);
    const [shelfLevels, setShelfLevels] = useState([]);
    const [labs, setLabs] = useState([]);

    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [selectedLocationType, setSelectedLocationType] = useState("");

    const [selectedShelf, setSelectedShelf] = useState("")
    const [shelfObject, setShelfObject] = useState({});

    const [selectedShelfLevel, setSelectedShelfLevel] = useState("")
    const [shelfLevelObject, setShelfLevelObject] = useState({})

    const [selectedLab, setSelectedLab] = useState("")

    const [ready, setReady] = useState(false);

    const alreadyStored = (location) => {
        return Object.hasOwn(location, "host_building");
    }

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
    }

    const findShelf = (shelf_id) => {
        if(shelves.length != 0)
            setShelfObject(shelves.find(shelf => shelf.shelf_id == shelf_id))
    }

    const findShelfLevel = (shelf_level_id) => {
        if(shelfLevels.length != 0) 
            setShelfLevelObject(shelfLevels.find(shelfLevel => shelfLevel.shelf_level_id == shelf_level_id))
    }

    const isPayloadReady = () => {
        return (!selectedBuilding || !selectedLocationType) ? false : (() => {
            if(selectedLocationType == "Almacen")
                return (!selectedShelf || !selectedShelfLevel) ? false : true;

            else if(selectedLocationType == "Laboratorio") 
                return (!selectedLab) ? false : true;
        })
    }

    const prepareLocationPayload = () => {
        let payload = {};

        if(!selectedBuilding){
            alert("Por favor, selecciona un edificio para continuar con el registro de ubicación.")
            return
        }

        if(selectedLocationType === "Almacen"){
            if(!selectedShelf || !selectedShelfLevel) {
                alert("Por favor, completa los datos del estante objetivo.")
                return
            }

            payload = {
                "location_type": selectedLocationType,
                "host_building": selectedBuilding,
                "shelf_number": shelfObject.shelf_number,
                "shelf_level_id": shelfLevelObject.shelf_level_id,
                "shelf_level_number": shelfLevelObject.shelf_level_number,
            }

        } 
        else if (selectedLocationType === "Laboratorio") {
            if(!selectedLab) {
                alert("Por favor, completa los datos del laboratorio objetivo.")
                return
            }

            payload = {
                "location_type": selectedLocationType,
                "host_building": selectedBuilding,
                "lab_name": selectedLab
            }
        } 
        else
        {
            alert("Por favor, especifica el tipo de ubicación.")
            return
        }

        setSelectedLocation(payload);
    }

    const getLabs = () => {
        if(selectedLocationType == "Laboratorio")
            api.get('/locations/labs', { params: { host_building: selectedBuilding } } )
            .then((labs) => setLabs(labs.data))
            .catch((error) => console.error(error))
    }

    const getShelves = () => {
        if(selectedLocationType == "Almacen")
            api.get('/locations/shelves', { params: { host_building: selectedBuilding } } )
            .then((shelves) => setShelves(shelves.data))
            .catch((error) => console.error(error))
    }
    
    const getShelfLevels = () => {
        if(selectedShelf) 
            api.get('/locations/shelf/levels', { params: { shelf_id: selectedShelf } } )
            .then((levels) => setShelfLevels(levels.data))
            .catch((error) => console.error(error))
    }
    
    useEffect(() => {
        if(alreadyStored(selectedLocation) == false)
            clearFields();
    }, [selectedLocation])

    useEffect(() => {
        findShelf(selectedShelf)
        getShelfLevels()
    }, [selectedShelf])

    useEffect(() => { getShelves() }, [selectedLocationType, selectedBuilding])
    useEffect(() => findShelfLevel(selectedShelfLevel), [selectedShelfLevel])
    useEffect(() => setReady(isPayloadReady()), [selectedBuilding, selectedLocationType, selectedShelf, selectedShelfLevel, selectedLab])

    return (
        <div className="material-location">
            <div className="subtitle-container">
                <hr className="add-material-left-line" />
                <h2 className="subtitle-text">{label}</h2>
                <hr className="add-material-right-line" />
            </div>

            <div className="location-container">
                <div className="building-input-container input-label">
                    <label htmlFor="building">Edificio</label>
                    <select
                        id="building"
                        className="building-input"
                        value = { selectedBuilding }
                        onChange = {event => setSelectedBuilding(event.target.value)}
                        //disabled = { alreadyStored(selectedLocation) }
                    >
                        <option value = "" disabled>Edificio</option>
                        <option value = "A">A</option>
                    </select>
                </div>
                
                { 
                  selectedBuilding ? (
                    <div className="location-input-container input-label">
                      <label htmlFor="location">Ubicación</label>
                      <select
                        id="location"
                        className="location-input"
                        value={selectedLocationType}
                        onChange={event => setSelectedLocationType(event.target.value) }
                        //disabled = { alreadyStored(selectedLocation) }
                      > 
                        <option value="" disabled>Ubicación</option>
                        {
                            ["Almacen", "Laboratorio"].map((type) => 
                                restricted == true? 
                                ( (type == "Almacen") ? (<option value={type}>{type}</option>) : null ) 
                                :
                                ( <option value={type}>{type}</option> )
                            )
                        }

                      </select>
                    </div>
                  ) : null
                }
                

                {
                  selectedLocationType === "Almacen" ? (
                  <>
                    <div className="shelf-input-container input-label">
                      <label htmlFor="shelf">Estante</label>
                      <select 
                        value = {selectedShelf} 
                        className = "shelf-input" 
                        onChange = {event => setSelectedShelf(event.target.value)}
                        //disabled = { alreadyStored(selectedLocation) }
                        >
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
                  selectedShelf != "" && selectedLocationType === "Almacen" ? 
                  (
                    <div className="level-input-container input-label">
                      <label htmlFor="level">Nivel</label>
                      <select 
                        value = {selectedShelfLevel} 
                        className = "level-input" 
                        onChange = {event => setSelectedShelfLevel(event.target.value)}
                        //disabled = { alreadyStored(selectedLocation) }
                        >
                          <option value = "" disabled>Nivel</option>
                          {
                            shelfLevels.map((level) => (
                              <option key = {level.shelf_level_number} value = {level.shelf_level_id}>
                                {level.shelf_level_number}
                              </option>
                            ))
                          }
                      </select>
                    </div>
                  ) : null
                }

                {
                    ready ? (
                        <button
                            type = "button"
                            className = "location-selector-button"
                            onClick = {() => prepareLocationPayload()}
                            //disabled = { alreadyStored(selectedLocation) }
                        >
                        Agregar ubicación
                        </button>
                    ) : null
                }
              </div>
        </div>
    )
}

export default LocationSelector;