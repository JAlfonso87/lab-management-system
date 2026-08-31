import "./Login.css"
import styles from "../SignUp/SignUp.module.css"

import logo from "../../assets/images/logo.png"
import { api } from "../../axios/api";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse ] = useState(null);

  const [visiblePassword, isPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const loginAttempt = async (event) => {
      event.preventDefault();

      if (username == "" || password == "") {

        alert("Debes ingresar usuario y contraseña");
        return;

      } else {

        const userData  = { "username": username, "password": password }
        
        try {
          const response = await api.post('/auth/login', userData)
          if(response.data != "INACTIVE") {
            setResponse(response.data)
            navigate("/home");
          }
          else
            alert("Tu cuenta está pendiente de validación. Ponte en contacto con un administrador.")
        }
        catch (err) {
          if (err.response?.status === 400) 
            alert("ERROR: Usuario y/o contraseña incorrectos.");
          else 
            alert(err);
        }
      }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="logo-container">

          <img
            src={logo}
            alt="Logo del sistema"
            className="logo-img"
          />

        </div>

        <div className="form-container">

          <h1 className="login-title">
            Lab Managment <br /> System
          </h1>

          <p className="login-subtitle">
            Ingresa las credenciales para iniciar sesión
          </p>

          <form className = "login-form" onSubmit = { loginAttempt }>

            <label htmlFor = "username"> Usuario </label>
            <input
              id = "username"
              placeholder = "Ingresa tu usuario"
              type = "text"
              value = { username }
              onChange = { event => setUsername(event.target.value) }
            />

            <label htmlFor="password"> Contraseña </label>
            <div style = {{ display: 'flex', justifyItems: "center"}}>
              <input 
                id = "password" 
                placeholder = "Elige una contraseña" 
                type = { visiblePassword ? "text" : "password" } 
                onChange = {(e) => setPassword(e.target.value)}/>
              <img 
                style = {{marginTop: "5px", backgroundColor: "white", cursor: "pointer", width: "30px", height: "30px", marginLeft: "-50px", zIndex: "2"}} 
                alt = "Mostrar contraseña" 
                className = {styles["header-img"]} src = { visiblePassword ? "/src/assets/images/eye.png" : "/src/assets/images/eye-closed.png"}
                onClick={()=>isPasswordVisible(!visiblePassword)}
              >
            </img>
            </div>

            <button type = "submit">Iniciar sesión</button>

          </form>

        </div>
        
      </div>
      <div style={{marginTop:"20px", display: "flex"}}>
        <p className="login-subtitle" style={{fontSize: "15px"}}>
              ¿Aún no tienes una cuenta? Haz click 
        </p>
        <p 
          className = "login-subtitle" 
          style = {{fontSize: "15px", marginLeft: "5px", cursor: "pointer", color: "green"}}
          onClick = { () => navigate('/signup')}
        >
              aquí 
        </p>
      </div>
    </div>
    
    
  );
}

export default Login;