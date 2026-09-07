import { useEffect, useState } from "react";
import "../assets/styles/common.css";

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
    if (returnType == "object") {
      const selected = options.find(
        (option) => String(option[idspec]) === event.target.value,
      );

      setter(selected);
    } else {
      setter(event.target.value);
    }
  };

  useEffect(() => {
    if (size == "XS") setStyle("input-XS");
    if (size == "S") setStyle("input-S");
    if (size == "M") setStyle("input-M");
    if (size == "L") setStyle("input-L");
    if (size == "XXL") setStyle("input-XXL");
  }, []);

  return (
    <div className="input-label">
      <label htmlFor={id}>{id}</label>
      <select
        id={id}
        value={target}
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
                value={option[idspec] ?? option}
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
