import { useEffect, useState } from "react";
import "../assets/styles/common.css";

function TextInput({ id, type, size, target, setter, config }) {
  const [style, setStyle] = useState("");

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
      <input
        id={id}
        placeholder={id}
        type={type}
        className={style}
        value={target}
        onChange={(event) => setter(event.target.value)}
        {...config}
      />
    </div>
  );
}
export default TextInput;
