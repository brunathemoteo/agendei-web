import "./navbar.css"
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-white.png";
import api from "../../constants/api";

function Navbar() {

    const navigate = useNavigate();

    function Logout() {
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("sessionEmail");
        localStorage.removeItem("sessionName");
        delete api.defaults.headers.common['Authorization'];

        navigate("/");
    }

    return <nav className="navbar fixed-top navbar-expand-lg bg-primary" data-bs-theme="dark">

        <div className="container-fluid">
            <Link className="navbar-brand" to="/appointments" >
                <img className="navbar-logo" src={logo} />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active fw-bold" : "nav-link"
                            }
                            to="/admin/appointments"
                        >
                            Agendamentos
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active fw-bold" : "nav-link"
                            }
                            to="/doctors"
                        >
                            Médicos
                        </NavLink>
                    </li>
                </ul>

                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {localStorage.getItem("sessionName")}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="#">Meu Perfil</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={Logout}>Desconectar</button></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

        </div>

    </nav >
}

export default Navbar;