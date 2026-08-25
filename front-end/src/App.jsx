import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Materials from "./pages/Materials/Materials"
import AddMaterial from "./pages/AddMaterial/AddMaterial"
import TransferStock from "./pages/TransferStock/TransferStock"
import SignUp from "./pages/SignUp/SignUp"
import Restock from "./pages/Restock/Restock"
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
      <Link to="/transfer-stock">
        Transferir
      </Link>
      <Link to="/restock">
        Restock
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
          path="/transfer-stock"
          element={<TransferStock />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/restock"
          element={<Restock />}
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