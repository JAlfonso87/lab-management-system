import "./UserApproval.css";

import { api } from "../../axios/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import LineSubtitle from "../../mini-components/LineSubtitle";
import UserTable from "../../components/UserTable/UserTable";

function UserApproval() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const handleRefresh = async () => {
    await api
      .get("users/inactive")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="edit-stock-page">
      <Header />

      <div className="edit-stock-content">
        <Sidebar />

        <main className="edit-stock-main">
          <h1 className="edit-stock-title">Aprobación de Registros</h1>

          <p className="edit-stock-text">
            A continuación se muestran las cuentas pendientes de aprobación.
            <br />
            Como administrador, puedes gestionar su integración o descarte desde
            esta ventana.
          </p>

          <div className="stocks-container" style={{ marginTop: "25px" }}>
            <LineSubtitle subtitle={"Validaciones pendientes"} />
            {users.length != 0 ? (
              <UserTable
                data={users}
                setter={setUsers}
                handleRefresh={handleRefresh}
              />
            ) : (
              <strong>NO HAY CUENTAS PENDIENTES DE VALIDACIÓN.</strong>
            )}
          </div>

          <button
            className="user-entry-edit-button"
            type="button"
            style={{
              marginTop: "35px",
              width: "150px",
              alignSelf: "center",
            }}
            onClick={() => navigate("/home")}
          >
            Regresar
          </button>
        </main>
      </div>
    </div>
  );
}

export default UserApproval;
