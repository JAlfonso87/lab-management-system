import styles from"./Unauthorized.module.css"

import { useNavigate } from "react-router-dom";

function Unauthorized() {

  const navigate = useNavigate();

  return (
    <div className = {styles["login-page"]}>

      <div className = {styles["login-container"]}>

        <div className = {styles["form-container"]}>

          <h1 className = {styles["login-title"]}>
            No Autorizado
          </h1>

          <p className = {styles["login-subtitle"]}>
            No tienes autorización para visualizar este material.
          </p>
          
          <div 
            style = {{
              justifyContent: "center"
            }}
          >
                <button 
                  style = {{
                    margin: "20px 0px",
                    backgroundColor: "#E4E4E4",
                    padding: "10px 35px",
                    border: "1px solid #D0D0D0",
                    borderRadius: "5px",
                    cursor: "pointer",
                    boxShadow: "0 0 10px rgb(194, 194, 194)",
                    transition: "0.2s"
                  }} 
                  type = "button" 
                  onClick = {() => navigate('/login')}
                >
                  Volver
                </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Unauthorized;