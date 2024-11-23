import Navbar from "../../components/navbar/navbar.jsx";
import "./appointments.css"
import { Link, useNavigate } from "react-router-dom";
import { doctors } from "../../constants/data.js";
import Appointment from "../../components/appointment/appointment.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";

function Appointments() {

    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);

    function ClickEdit(id_appointment) {
        navigate("/admin/appointments/" + id_appointment);
    }

    function ClickDelete(id_appointment) {
        console.log("Excluir" + id_appointment);
    }

    async function LoadAppointments() {
        try {
            const response = await api.get("/admin/appointments");

            if (response.data) {
                setAppointments(response.data);
            }
        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401) {
                    return navigate("/");
                }
            }
            else
                alert("Erro ao buscar agendamentos. Tente novamente mais tarde.")
        }
    }

    useEffect(() => {
        LoadAppointments();
    }, []);

    return <div className="container-fluid mt-page">
        <Navbar />

        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h2 className="d-inline">Agendamentos</h2>
                <Link to="/appointments/add" className="btn btn-outline-primary ms-5 mb-2">
                    Novo Agendamento
                </Link>
            </div>

            <div className="d-flex justify-content-end">
                <input type="date" className="form-control" id="startDate" />
                <span className="m-2">Até</span>
                <input type="date" className="form-control" id="endDate" />

                <div className="form-control ms-3 me-3">
                    <select name="doctor" id="doctor">
                        <option value="">Todos os médicos</option>

                        {
                            doctors.map((doctor) => {
                                return <option key={doctor.id_doctor} value={doctor.id_doctor}>{doctor.name}</option>
                            })
                        }

                    </select>
                </div>
                <button className="btn btn-primary" type="button">Filtrar</button>
            </div>
        </div>

        <div>
            <table className="table table-hover mt-4">
                <thead>
                    <tr>
                        <th scope="col">Paciente</th>
                        <th scope="col">Médico</th>
                        <th scope="col">Serviço</th>
                        <th scope="col">Data/Hora</th>
                        <th scope="col" className="text-end">Valor</th>
                        <th scope="col" className="col-buttons"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        appointments.map((ap) => {
                            return <Appointment key={ap.id_appointment}
                                id_appointment={ap.id_appointment}
                                user={ap.name}
                                doctor={ap.doctor}
                                service={ap.service}
                                booking_date={ap.booking_date}
                                booking_hour={ap.booking_hour}
                                price={ap.price}
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

export default Appointments;