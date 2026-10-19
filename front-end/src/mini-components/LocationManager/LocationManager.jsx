import { useEffect } from "react";
import { api } from "../../axios/api";
import { PropertyValidator } from "../../assets/utils/PropertyValidator";

function LocationManager({
  selectedLocationType,
  selectedBuilding,
  selectedShelf,
  setShelves,
  setShelfLevels,
  setLabs,
}) {
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
        .then((shelves) => {
          console.log(shelves);
          setShelves(shelves.data);
        })
        .catch((error) => console.error(error));
  };

  const getShelfLevels = () => {
    if (selectedShelf)
      api
        .get("/locations/shelf/levels", {
          params: { shelf_id: selectedShelf.shelf_id },
        })
        .then((levels) => {
          console.log(levels);
          setShelfLevels(levels.data);
        })
        .catch((error) => console.error(error));
  };

  useEffect(() => {
    getShelfLevels();
  }, [selectedShelf]);

  useEffect(() => {
    if (PropertyValidator([selectedBuilding, selectedLocationType]))
      selectedLocationType == "Almacen" ? getShelves() : getLabs();
  }, [selectedLocationType, selectedBuilding]);
}
export default LocationManager;
