import styles from"./SignUp.module.css"

import axios from 'axios';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate();

  const [lastName, setLastname] = useState("")
  const [middleName, setMiddlename] = useState("")
  const [firstName, setFirstname] = useState("")

  const [phoneNumber, setPhoneNumber] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState("A")
  const [labs, setLabs] = useState([])
  const [selectedLab, setSelectedLab] = useState("ALIMENTOS")

  const [visiblePassword, isPasswordVisible] = useState(false);
  
  const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
  })

  const signUpAttempt = async () => {
    event.preventDefault()
    let fields = [selectedLab, firstName, lastName, username, password];
    let isReady = fields.every((field) => field.length != 0);

    if(isReady) {
      let check = await api.get('/users/check', { params: { username: username }})

      if(check.data == 0) {
        try {
          await api.post('/users/signup', 
            {
              labName: selectedLab,
              firstName: firstName,
              ...(middleName.length > 0 && {middleName: middleName}),
              lastName: lastName,
              ...(phoneNumber.length > 0 && {phoneNumber: phoneNumber}),
              username: username,
              password: password
            }
          )
        } catch (e) {
          console.error(e);
        } finally {
          navigate('/login');
          alert('Tu cuenta está pendiente de validación. Ponte en contacto con un administrador.');
        }

      }
      else
        alert("El nombre de usuario ya está en uso. Intenta uno diferente.");

    }
    else
      alert("Por favor, completa todos los campos requeridos antes de continuar.");
  }

  const getLabs = async () => {
    setLoading(true);
    try {
      let route = ('/locations/'+ building + '/labs');
      let labs = await api.get(route);
      setLabs(labs.data)
    }
    finally {
      setLoading(false);
    }
  } 

  useEffect(() => {
    getLabs();
  }, [building])

  return (
    <div className = {styles["login-page"]}>

      <div className = {styles["login-container"]}>

        <div className = {styles["form-container"]}>

          <h1 className = {styles["login-title"]}>
            Forma de <br /> Registro
          </h1>

          <p className = {styles["login-subtitle"]}>
            Completa la siguiente información para registrarte en el sistema:
          </p>
          <form className = {styles["login-form"]} onSubmit = { signUpAttempt }>
            <p className = {styles["login-subtitle"]} style={{fontSize: "12px"}}>
              Los campos necesarios están marcados por '*'
            </p>
            <strong 
              style = {{
                alignSelf: 'start',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >Datos personales:</strong>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor = "last_name">*Apellido Paterno </label>
                <input
                  id = "last_name"
                  placeholder = "Apellido Paterno"
                  type = "text"
                  onChange = {(e) => setLastname(e.target.value)}
                />
              </div>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor = "middle_name">Apellido Materno</label>
                <input
                  id = "middle_name"
                  placeholder = "Apellido Materno (Opcional)"
                  type = "text"
                  onChange = {(e) => setMiddlename(e.target.value)}
                />
              </div>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                  <label htmlFor = "first_name">*Nombre(s) </label>
                  <input
                    style={{width: '280px'}}
                    id = "first_name"
                    placeholder = "Nombre(s)"
                    type = "text"
                    onChange = {(e) => setFirstname(e.target.value)}
                  />
              </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                  <label htmlFor = "phone_number">Número de teléfono </label>
                  <input
                    id = "phone_number"
                    placeholder = "Número de teléfono (Opcional)"
                    type = "tel"
                    pattern = "[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    maxLength = {12}
                    onChange = {(e) => setPhoneNumber(e.target.value)}
                  />
              </div>
              <label htmlFor = "phone_number" style = {{alignSelf: 'center', marginLeft: '20px'}}> 
                Es importante cumplir con el formato: "555-555-5555" 
              </label>
            </div>
            
            <strong 
              style = {{
                alignSelf: 'start',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >Cuenta de Usuario:</strong>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: "center"}}>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor="username">*Nombre de Usuario </label>
                <input
                  id = "username"
                  placeholder = "Elige un nombre de usuario"
                  onChange = {(e) => setUsername(e.target.value)}
                />
              </div>

              <div style = {{ display: 'flex', flexDirection: 'column' }}>

                <label htmlFor = "password">*Contraseña </label>
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

              </div>

            </div>

            <strong 
              style = {{
                alignSelf: 'start',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >Información de laboratorio asignado:</strong>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor = "last_name"> *Edificio </label>
                <select className = {styles["login-menu"]} onChange={(e) => setBuilding(e.target.value)}>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>
              
              <div style = {{display: 'flex', flexDirection: 'column'}}>
                <label htmlFor = "last_name"> *Laboratorios </label>
                <select id = "lab-selector" style = {{width: "280px"}} className = {styles["login-menu"]} onChange={(e) => setSelectedLab(e.target.value)}>
                    {
                      labs.map((lab) => (
                        <option key = {lab.lab_name} value = {lab.lab_name}>
                          {lab.lab_name.replace("_"," ")}
                        </option>
                      ))
                    }
                </select>
              </div>
            </div>
            <div style = {{display: "flex", width: "100%", gap: "15px", justifyContent: "end"}}>
                <button style = {{backgroundColor: "red", color: "white", marginBottom: "25px"}} type = "button" onClick = {() => navigate('/login')}>Cancelar</button>
                <button style = {{marginBottom: "25px"}} type = "submit">Crear cuenta</button>
            </div>
          </form>
          
        </div>

      </div>

    </div>
  );
}

export default SignUp;