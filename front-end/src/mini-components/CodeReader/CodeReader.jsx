import { useEffect } from "react";
import { api } from "../../axios/api";

function CodeReader({ setter }) {
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
          gotByCode = await api.get("/reagents/code", {
            params: {
              code: reagent_code,
            },
          });
          setter(gotByCode.data);
          reagent_code = "";
        }

        setter(gotByCode.data);
        reagent_code = "";
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
}
export default CodeReader;
