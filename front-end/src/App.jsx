import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Materials from "./pages/Materials/Materials"
import AddMaterial from "./pages/AddMaterial/AddMaterial"
import EditMaterial from "./pages/EditMaterial/EditMaterial"

function App() {
  return (
    <>
      <Link to="/login">
        Login
      </Link>
      <Link to="/home">
        Home
      </Link>
      <Link to = "/materials">
        Materiales
      </Link>
      <Link to="/add-material">
        Crear
      </Link>
      <Link to="/edit-material">
        Editar
      </Link>

      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/home"
          element={<Home />}
        />
        <Route
          path="/materials"
          element={<Materials />}
        />
        <Route
          path="/add-material"
          element={<AddMaterial />}
        />
        <Route
          path="/edit-material"
          element={<EditMaterial />}
        />
      </Routes>
    </>
  );
}

export default App;