import { useEffect, useState } from "react";
import "../../assets/styles/common.css";
/*
- Nombre del Componente: "SelectorInput"
- Función: 
    Generar un campo de selección reutilizable para distintos tamaños y tipos de retorno.
- Parámetros:
  - id (string): 
      Nombre identificador del componente.
  - size (string): 
      Preset de tamaño para el componente (XS, S, M, L, XXL)
  - target (useState: Valor): 
      Variable (derivada de useState) que almacena el valor seleccionado.
  - setter (useState: Función Actualizadora): 
      Función (derivada de useState) que actualiza el valor seleccionado.
  - options (array): 
      Arreglo que almacena todas las opciones que serán desplegadas en el componente.
  - idspec (string): 
      Cuando aplica, toma uno de los atributos de un objeto (opción) y lo define como identificador interno de la opción.
  - opspec (string): 
      Cuando aplica, toma uno de los atributos de un objeto (opción) y lo define como nombre externo de la opción.
  - returnType (string): 
      Permite definir el tipo de selección que llevará a cabo el componente (tipo "object" devuelve un objeto completo)
  - config (object): 
      Permite añadir configuraciones adicionales al selector, como condiciones específicas de desactivación, por ejemplo.
*/

function SelectorInput({
  id,
  size,
  target,
  setter,
  options,
  idspec,
  opspec,
  returnType,
  config,
}) {
  const [style, setStyle] = useState("");

  const returnLoader = (event) => {
    const selection =
      returnType == "object"
        ? options.find((option) => option[opspec] == event.target.value)
        : event.target.value;
    setter(selection);
  };

  useEffect(() => {
    setStyle("input-" + size);
  }, []);

  return (
    <div className="input-label">
      <label htmlFor={id}>{id}</label>
      <select
        id={id}
        value={returnType == "object" ? target[opspec] : target}
        className={style}
        onChange={(event) => returnLoader(event)}
        {...config}
      >
        <option value="" disabled>
          {id}
        </option>
        {options.length != 0
          ? options.map((option) => (
              <option
                key={option[idspec] ?? option}
                value={option[opspec] ?? option}
              >
                {String(option[opspec] ?? option)
                  .toUpperCase()
                  .replace("_", " ")}
              </option>
            ))
          : null}
      </select>
    </div>
  );
}
export default SelectorInput;
