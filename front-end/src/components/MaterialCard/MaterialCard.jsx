import "./MaterialCard.css"

function MaterialCard({
  image,
  name,
  brand,
  weight,
  color,
  location,
  shelf,
  level,
  status,
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
        <p className="material-name">{name}</p>
        <span className="material-brand">Marca: {brand}</span>
        <div>
          <span>Peso: {weight}</span>
          <span>Color: {color}</span>
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
            <strong>{status}</strong>
          </p>
          <span className="material-stock">Stock: {stock}</span>
        </div>
      </div>
    </div>
  );

}

export default MaterialCard;