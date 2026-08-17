import "./Login.css"

import logo from "../../assets/images/logo.png"
import axios from 'axios';

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse ] = useState(null);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
  })

  const loginAttempt = async (event) => {
      event.preventDefault();

      if (username == "" || password == "") {
        alert("Debes ingresar usuario y contraseña");
        return;
      } else {
        const userData  = { "username": username, "password": password }
        console.log(userData)
        
        await api.post('/auth/login', userData, { timeout: 5000 })
        .then((res) => {
            setResponse(res.data)
            console.log(response)
            //navigate("/home");
        })
        .catch((err) => console.error(err))

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
            <input
              id = "password"
              placeholder = "Ingresa tu contraseña"
              type = "password"
              value = { password }
              onChange = { event => setPassword(event.target.value) }
            />

            <button type = "submit">Iniciar sesión</button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;