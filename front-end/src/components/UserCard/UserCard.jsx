import { useEffect } from "react";
import styles from "./UserCard.module.css"

function UserCard({
  image,
  user,
  onClick
}) {

  return (
    <div
      className = {styles["user-card"]}
    >
      <img
        src={image}
        alt="Imagen del material"
        className = {styles["user-card-img"]}
      />

      <div className = {styles["user-card-info"]}>
        <span className={styles["user-card-entry-desc"]}><strong>Nombre/s</strong></span>
        <p className={styles["user-card-name"]}>{user?.user_first_name + " " + user?.user_last_name + (user?.user_middle_name ? " " + user?.user_middle_name: "")}</p>
        
        <span className={styles["user-card-entry-desc"]}><strong>Nombre de Usuario</strong></span>
        <p className={styles["user-card-name"]}>{user.user_username}</p>

        <span className={styles["user-card-entry-desc"]}><strong>Laboratorio Asignado:</strong></span>
        <p className={styles["user-card-name"]}>{"LABORATORIO DE " + user.labs.lab_name}</p>

        <span className={styles["user-card-entry-desc"]}><strong>Contacto:</strong></span>
        <div>
          <span 
            className = {styles["user-card-name"]}
            style = {{justifySelf: "center"}}
          > 
            {user.user_phone_number}
          </span>
        </div>
        <div>
          <button
                className = {styles["user-card-button"]}
                type="button"
                style = { {marginBottom: "15px"} }
                onClick = { () => onClick(user) }
              >
                Editar Información
          </button>
        </div>
      </div>

    </div>
  );

}

export default UserCard;