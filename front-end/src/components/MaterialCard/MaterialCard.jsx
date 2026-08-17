import "./MaterialCard.css"

function MaterialCard({
  image,
  reagent_name,
  reagent_brand,
  reagent_netweight,
  reagent_risk,
  location,
  shelf,
  level,
  reagent_status,
  stock,
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
        <p className="material-name">{reagent_name}</p>
        <span className="material-brand">Marca: {reagent_brand}</span>
        <div>
          <span>Peso: {reagent_netweight}</span>
          <span>Color: {reagent_risk}</span>
        </div>
      </div>

      <div className="location-info">
        <p className="material-location">{location}</p>
        <div>
          <span className="material-shelf">Estante: {shelf}</span>
          <span className="material-level">Nivel: {level}</span>
        </div>
      </div>

      <div className="stock-info">
        <div>
          <p className="material-status">
            <strong>{reagent_status}</strong>
          </p>
          <span className="material-stock">Stock: {stock}</span>
        </div>
      </div>
    </div>
  );

}

export default MaterialCard;