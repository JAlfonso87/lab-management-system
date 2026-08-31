import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"
import Materials from "./pages/Materials/Materials"
import AddMaterial from "./pages/AddMaterial/AddMaterial"
import TransferStock from "./pages/TransferStock/TransferStock"
import SignUp from "./pages/SignUp/SignUp"
import Restock from "./pages/Restock/Restock"
import NewRequest from "./pages/NewRequest/NewRequest"
import User from "./pages/User/User"
import UserApproval from "./pages/UserApproval/UserApproval"
import Unauthorized from "./pages/Unauthorized/Unauthorized"
import UserProtectedRoutes from "./permissions/UserProtectedRoutes"
import AdminProtectedRoutes from "./permissions/AdminProtectedRoutes"

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route element={<UserProtectedRoutes />}>
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
          <Route
            path="/user"
            element={<User />}
          />

          <Route element={<AdminProtectedRoutes />}>
            <Route
              path="/admin/approve"
              element={<UserApproval />}
            />
          </Route>
        </Route>



      </Routes>
    </>
  );
}

export default App;