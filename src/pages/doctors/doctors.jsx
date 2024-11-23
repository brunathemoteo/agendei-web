import Navbar from "../../components/navbar/navbar.jsx";
import "./doctors.css"
import { Link, useNavigate } from "react-router-dom";
import { appointments, doctors } from "../../constants/data.js";
import Appointment from "../../components/appointment/appointment.jsx";
import Doctor from "../../components/doctor/doctor.jsx";

function Doctors() {

    const navigate = useNavigate();

    function ClickEdit(id_doctor) {
        navigate("/doctors/edit/" + id_doctor);
    }

    function ClickDelete(id_doctor) {
        console.log("Excluir" + id_doctor);
    }

    return <div className="container-fluid mt-page">
        <Navbar />

        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h2 className="d-inline">Médicos</h2>
                <Link to="/appointments/add" className="btn btn-outline-primary ms-5 mb-2">
                    Novo Médico
                </Link>
            </div>

            <div className="d-flex justify-content-end">
                <input className="form-control ms-3 me-3 custom-width" type="text" placeholder="Buscar por nome do médico" />
                <button className="btn btn-primary">Filtrar</button>
            </div>
        </div>

        <div>
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope="col">Médico</th>
                        <th scope="col" className="col-buttons"></th>
                        <th scope="col">Especialidade</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        doctors.map((doctor) => {
                            return <Doctor key={doctor.id_doctor}
                                id_doctor={doctor.id_doctor}
                                name={doctor.name}
                                specialty={doctor.specialty}
                                clickEdit={ClickEdit}
                                clickDelete={ClickDelete}
                            />
                        })
                    }
                </tbody>
            </table>
        </div>

    </div>
}

export default Doctors;