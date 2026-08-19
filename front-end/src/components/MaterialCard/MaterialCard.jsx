import "./MaterialCard.css"

function MaterialCard({
  image,
  reagent,
  total_stock,
  locations,
  onClick
}) {

  return (
    <div
      className="material-card"
      onClick={onClick}
    >
      <img
        src={image}
        alt="Imagen del material"
        className="material-img"
      />

      <div className="material-info">
        <p className="material-name">{reagent.reagent_name}</p>
        <span className="material-brand">Marca: {reagent.reagent_brand}</span>
        <div>
          <span>Peso: {reagent.reagent_netweight}</span>
          <span>Riesgo: {reagent.reagent_risk}</span>
        </div>
      </div>

      <div className="location-info">
        <p className="material-location"></p>
        <div>
          <span className="material-shelf">Estante: </span>
          <span className="material-level">Nivel: </span>
        </div>
      </div>

      <div className="stock-info">
        <div>
          <p className="material-status">
            <strong>{total_stock != 0? "DISPONIBLE" : "AGOTADO"}</strong>
          </p>
          <span className="material-stock">Stock: {total_stock}</span>
        </div>
      </div>
    </div>
  );

}

export default MaterialCard;