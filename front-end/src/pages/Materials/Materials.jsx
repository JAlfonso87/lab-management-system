import styles from "./Materials.module.css";

import image from "../../assets/images/image.png";

import { useEffect, useState } from "react";
import { api } from "../../axios/api";
import { useSearchParams } from "react-router-dom";

import {
  Header,
  Sidebar,
  MaterialCard,
  MaterialModal,
} from "../../components/Components";
import { Paginator, CodeReader } from "../../mini-components/Minicomponents";

import SearchBar from "./SearchBar/SearchBar.jsx";

const normalizeText = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function Materials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [riskFilter, setRiskFilter] = useState("Todos");
  const [locationFilter, setLocationFilter] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [reagentCount, setReagentCount] = useState(0);

  //obtiene un conteo de materiales que cumplen con los filtros
  const getReagentCount = (params) => {
    api
      .get("/reagents/count", { params })
      .then((response) => setReagentCount(Number(response.data)))
      .catch((error) => console.error(error));
  };

  const filteredMaterials = materials.filter(
    (material) =>
      normalizeText(material.reagent.reagent_name).includes(
        normalizeText(searchTerm),
      ) &&
      (material.reagent.reagent_risk === riskFilter.toUpperCase() ||
        riskFilter.toUpperCase() === "TODOS"),
  );

  const deleteMaterial = (id) => {
    setMaterials(materials.filter((material) => material.reagent_id !== id));
  };

  //obtiene los reactivos que cumplen con los filtros
  const getReagents = async (risk, page, loc) => {
    setLoading(true);
    try {
      let reagents = await api.get("reagents", {
        params: {
          risk: risk == "TODOS" ? undefined : risk,
          page: page,
          loc: loc,
        },
      });
      setMaterials(reagents.data);
    } finally {
      setLoading(false);
    }
  };

  //reinicia el conteo de página al cambiar los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [riskFilter, locationFilter]);

  //construye la nueva URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (riskFilter) {
      params.set("risk", riskFilter.toUpperCase());
    }
    if (locationFilter != null) {
      params.set("loc", locationFilter.toString());
    }
    params.set("page", currentPage.toString());
    setSearchParams(params);
  }, [riskFilter, locationFilter, currentPage]);

  //monitoriza y envía los parámetros de búsqueda
  useEffect(() => {
    const risk = searchParams.get("risk");
    const page = searchParams.get("page");
    const loc = searchParams.get("loc");

    if (risk == null || page == null) {
      setSearchParams({
        risk: risk ?? "TODOS",
        page: page ?? "1",
        ...(loc != null && { loc }),
      });
      return;
    }

    getReagentCount({
      risk: risk.toUpperCase() === "TODOS" ? undefined : risk.toUpperCase(),
      lid: loc ?? undefined,
    });

    getReagents(risk, page, loc);
  }, [searchParams]);

  useEffect(() => getReagentCount({}), []);

  return (
    <div className={styles["materials-page"]}>
      <CodeReader setter={setSelectedMaterial} />
      <Header />

      <div className={styles["materials-content"]}>
        <Sidebar />

        <main className={styles["main-section"]}>
          <h1 className={styles["materials-title"]}>Materiales</h1>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setRiskFilter={setRiskFilter}
            setLocationFilter={setLocationFilter}
          />

          <section className={styles["materials-section"]}>
            <Paginator
              index={currentPage}
              setter={setCurrentPage}
              count={reagentCount}
            />
            <h2 className={styles["materials-subtitle"]}>Resultados</h2>

            {loading ? (
              <p className={styles["no-results"]}>
                Cargando...
                <br />
              </p>
            ) : filteredMaterials.length === 0 ? (
              <p className={styles["no-results"]}>
                No se encontraron resultados relacionados a:
                <br />
                Busqueda: <strong>{searchTerm}</strong> <br />
                Color: <strong>{riskFilter}</strong> <br />
              </p>
            ) : null}

            <div className={styles["cards-container"]}>
              {filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.reagent.reagent_id}
                  image={image}
                  {...material}
                  onClick={() => setSelectedMaterial(material)}
                />
              ))}
            </div>

            <Paginator
              index={currentPage}
              setter={setCurrentPage}
              count={reagentCount}
            />
          </section>

          {selectedMaterial !== null && (
            <MaterialModal
              material={selectedMaterial}
              image={image}
              onClose={() => setSelectedMaterial(null)}
              onDelete={deleteMaterial}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Materials;
