import "./Materials.css"

import searchIcon from "../../assets/images/search.png"
import image from "../../assets/images/image.png"

import { useEffect, useState } from "react";
import { api } from "../../axios/api";
import { useSearchParams } from "react-router-dom";

import Header from "../../components/Header/Header.jsx"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import MaterialCard from "../../components/MaterialCard/MaterialCard.jsx";
import MaterialModal from "../../components/MaterialModal/MaterialModal.jsx";

const normalizeText = text =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function Materials() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState("Todos");
  const [locationFilter, setLocationFilter] = useState("Todos")

  const [searchTerm, setSearchTerm] = useState("");

  const [appliedColor, setAppliedColor] = useState("Todos");
  const [appliedLocation, setAppliedLocation] = useState("Todos");

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const nextPage = () => {
    const newPage = Number(searchParams.get('page')) + 1;
    setSearchParams({ 
      risk: searchParams.get('risk'),
      page: newPage
    })
  }

  const prevPage = () => {
    const newPage = Number(searchParams.get('page')) - 1;
    setSearchParams({ 
      risk: searchParams.get('risk'),
      page: newPage
    })
  }

  const filteredMaterials = materials.filter(material =>
    normalizeText(material.reagent.reagent_name).includes(normalizeText(searchTerm)) &&
    (material.reagent.reagent_risk === appliedColor.toUpperCase() || appliedColor.toUpperCase() === "TODOS") /*&&
    (material.location === appliedLocation || appliedLocation === "Todos")*/
  );

  const deleteMaterial = (id) => {
    setMaterials(
      materials.filter(material => material.reagent_id !== id)
    );
  }

  const getReagents = async (risk, page) => {
    console.log(risk)
    console.log(page)
    setLoading(true);
    try {
      /*let route = risk != "TODOS" ? ('/reagents?risk=' + risk + '&page=' + page) : ('/reagents?page=' + page);*/
      let reagents = await api.get('reagents', {
        params: {
          risk: risk == "TODOS" ? undefined : risk,
          page: page
        }
      });
      setMaterials(reagents.data)
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let reagent_code = "";
    let gotByCode = {};
    let lastKeyTime = 0;

    const handleKeyDown = async (event) => {
        const now = Date.now();

        if (now - lastKeyTime > 100) {
            reagent_code = "";
        }

        if (event.key === "Enter") {
            if (reagent_code.length > 0) {
                console.log(reagent_code)
                gotByCode = await api.get('/reagents/code', {
                  params: {
                    code: reagent_code
                  }
                })
                console.log(gotByCode.data)
                setSelectedMaterial(gotByCode.data)
                reagent_code = "";
            }
        } else if (event.key.length === 1) {
            reagent_code += event.key.toUpperCase();
        }

        lastKeyTime = now;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchParams.has('page') == false && searchParams.has('risk') == false) {
      setSearchParams({
        risk: 'TODOS',
        page: 1
      })
    }
  }, [])

  useEffect(() => {
    /*setSearchParams({
      risk: appliedColor.toUpperCase(),
      page: 1
    })*/
  }, [appliedColor])

  useEffect(() => {
    if(searchParams.get('risk') == null)
        setSearchParams({
          risk: "TODOS",
          page: 1
        })
    else if(searchParams.get('page') == null)
        setSearchParams({
          risk: searchParams.get('risk'),
          page: 1
        })

    getReagents(searchParams.get('risk'), searchParams.get('page'));

  }, [searchParams])

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
                  <option>Verde</option>
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
            <div>
              <button onClick = { prevPage }>&lt;</button>
              <button onClick = { nextPage }>&gt;</button>
            </div>
            <h2 className="materials-subtitle">Resultados</h2>

            {
              loading ?
                (
                  <p className="no-results">
                    Cargando...<br />
                  </p>
                )
                :
                filteredMaterials.length === 0 ?
                  (
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
                  key={material.reagent.reagent_id}
                  image={image}
                  {...material}
                  onClick={() =>
                    setSelectedMaterial(material)
                  }
                />
              ))}

            </div>

            <div>
              <button onClick = { prevPage }>&lt;</button>
              <button onClick = { nextPage }>&gt;</button>
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