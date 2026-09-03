import { useNavigate } from "react-router-dom";
import styles from "./UserModal.module.css";
import { useEffect, useState } from "react";
import { api } from "../../axios/api";

function UserModal({ user, image, onClose, onRefresh }) {
  const [lastName, setLastname] = useState("");
  const [middleName, setMiddlename] = useState("");
  const [firstName, setFirstname] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState("A");
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});

  const [visiblePassword, isPasswordVisible] = useState(false);

  const [changePassword, setChangePassword] = useState(false);

  const getLabs = async () => {
    setLoading(true);
    try {
      let labs = await api.get("/locations/labs", {
        params: {
          host_building: building,
        },
      });
      setLabs(labs.data);
    } finally {
      setLoading(false);
    }
  };

  const clearHooks = () => {
    setFirstname("");
    setLastname("");
    setMiddlename("");
    setPhoneNumber("");
    setUsername("");
    setPassword("");
    setSelectedLab({});
    setLabs([]);
    setBuilding("");
  };

  const handleUpdate = async () => {
    event.preventDefault();
    const data = {
      user_data: {
        user_first_name: firstName,
        user_last_name: lastName,
        user_middle_name: middleName.length != 0 ? middleName : undefined,
        user_phone_number: phoneNumber,
        user_username: username,
        user_password: password.length != 0 ? password : undefined,
      },
      lab_data: {
        lab_id: selectedLab.lab_id,
      },
    };
    await api
      .post("/users/user/update", data, {
        params: {
          id: user.user_id,
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("El usuario se ha actualizado con éxito.");
        clearHooks();
        onClose({});
        onRefresh();
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setLastname(user.user_last_name ?? "");
    setMiddlename(user.user_middle_name ?? "");
    setFirstname(user.user_first_name ?? "");
    setPhoneNumber(user.user_phone_number ?? "");
    setUsername(user.user_username ?? "");
    setBuilding(user.labs.host_building ?? "");
    setSelectedLab(user.labs ?? {});

    if (building.length != 0) getLabs();
  }, []);

  useEffect(() => {
    getLabs();
  }, [building]);

  return (
    <div className="modal-overlay" onClick={() => onClose({})}>
      <div
        className={styles["user-modal-content"]}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-top">
          <h1 className="modal-material-title">
            {"Modificando Usuario: "}
            <strong style={{ marginLeft: "15px" }}>{user.user_username}</strong>
          </h1>
          <button
            type="button"
            className="modal-close-button"
            aria-label="Cerrar"
            onClick={() => onClose({})}
          >
            X
          </button>
        </div>

        <form className={styles["user-modal-form"]} onSubmit={handleUpdate}>
          <strong
            style={{
              alignSelf: "start",
              marginBottom: "10px",
            }}
          >
            Datos personales:
          </strong>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="last_name">*Apellido Paterno </label>
              <input
                id="last_name"
                placeholder="Apellido Paterno"
                type="text"
                required={true}
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="middle_name">Apellido Materno</label>
              <input
                id="middle_name"
                placeholder="Apellido Materno"
                type="text"
                value={middleName}
                onChange={(e) => setMiddlename(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="first_name">*Nombre(s) </label>
              <input
                style={{ width: "280px" }}
                id="first_name"
                placeholder="Nombre(s)"
                type="text"
                required={true}
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="phone_number">Número de teléfono </label>
              <input
                id="phone_number"
                placeholder="Número de teléfono"
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                maxLength={12}
                required={true}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <label
              htmlFor="phone_number"
              style={{ alignSelf: "center", marginLeft: "20px" }}
            >
              Es importante cumplir con el formato: "555-555-5555"
            </label>
          </div>

          <strong
            style={{
              alignSelf: "start",
              marginBottom: "10px",
            }}
          >
            Cuenta de Usuario:
          </strong>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="username">*Nombre de Usuario </label>
              <input
                id="username"
                placeholder="Elige un nombre de usuario"
                value={username}
                required={true}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {changePassword == true ? (
              <div
                style={{ display: "flex", flexDirection: "row", gap: "20px" }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor="password">*Contraseña </label>
                  <div style={{ display: "flex", justifyItems: "center" }}>
                    <input
                      id="password"
                      placeholder="Elige una contraseña"
                      style={{
                        width: "250px",
                      }}
                      type={visiblePassword ? "text" : "password"}
                      required={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <img
                      style={{
                        marginTop: "5px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        width: "30px",
                        height: "30px",
                        marginLeft: "-50px",
                        zIndex: "2",
                      }}
                      alt="Mostrar contraseña"
                      className={styles["header-img"]}
                      src={
                        visiblePassword
                          ? "/src/assets/images/eye.png"
                          : "/src/assets/images/eye-closed.png"
                      }
                      onClick={() => isPasswordVisible(!visiblePassword)}
                    ></img>
                  </div>
                </div>
                <button
                  className={styles["user-modal-button"]}
                  type="button"
                  style={{
                    width: "180px",
                    alignSelf: "center",
                    marginTop: "5px",
                  }}
                  onClick={() => setChangePassword(false)}
                >
                  Conservar Contraseña
                </button>
              </div>
            ) : (
              <button
                className={styles["user-modal-button"]}
                type="button"
                style={{
                  width: "180px",
                  alignSelf: "center",
                  marginTop: "5px",
                }}
                onClick={() => setChangePassword(true)}
              >
                Cambiar Contraseña
              </button>
            )}
          </div>

          <strong
            style={{
              alignSelf: "start",
              marginBottom: "10px",
            }}
          >
            Laboratorio asignado:
          </strong>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="last_name"> *Edificio </label>
              <select
                className={styles["user-modal-menu"]}
                value={building}
                required={true}
                onChange={(e) => setBuilding(e.target.value)}
              >
                <option>A</option>
                <option>B</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="last_name"> *Laboratorios </label>
              <select
                id="lab-selector"
                style={{ width: "280px" }}
                className={styles["user-modal-menu"]}
                required={true}
                value={selectedLab?.lab_name ?? ""}
                onChange={(e) => {
                  const lab = labs.find(
                    (lab) => lab.lab_name === e.target.value,
                  );
                  setSelectedLab(lab ?? {});
                }}
              >
                {labs.map((lab) => (
                  <option key={lab.lab_name} value={lab.lab_name}>
                    {lab.lab_name.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <button
              className={styles["user-modal-button"]}
              style={{ marginTop: "25px" }}
              type="submit"
            >
              Confirmar Modificación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
