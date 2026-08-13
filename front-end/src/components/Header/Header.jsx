import "./Header.css"
import logo from "../../assets/images/logo.png"

function Header() {
  return (
    <header className="header-content">

      <img
        src={logo}
        alt="Logo del sistema"
        className="header-img"
      />
      <span>LMS | Lab Management System</span>

    </header>
  );
}

export default Header;