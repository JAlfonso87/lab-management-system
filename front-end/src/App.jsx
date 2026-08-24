import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Materials from "./pages/Materials/Materials"
import AddMaterial from "./pages/AddMaterial/AddMaterial"
import EditStockMaterial from "./pages/EditStockMaterial/EditStockMaterial"
import SignUp from "./pages/SignUp/SignUp"
import NewRequest from "./pages/NewRequest/NewRequest"

function App() {
  return (
    <>
      <Link to="/login">
        Login
      </Link>
      <Link to="/signup">
        Signup
      </Link>
      <Link to="/home">
        Home
      </Link>
      <Link to="/materials">
        Materiales
      </Link>
      <Link to="/add-material">
        Crear
      </Link>
      <Link to="/edit-stock-material">
        Editar
      </Link>
      <Link to="/new-request">
        Nueva solicitud
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
          path="/edit-stock-material"
          element={<EditStockMaterial />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/new-request"
          element={<NewRequest />}
        />
      </Routes>
    </>
  );
}

export default App;