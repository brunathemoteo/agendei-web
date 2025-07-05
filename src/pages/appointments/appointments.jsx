import Navbar from "../../components/navbar/navbar.jsx";
import "./appointments.css";
import { Link, useNavigate } from "react-router-dom";
import { doctors } from "../../constants/data.js";
import Appointment from "../../components/appointment/appointment.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";

function Appointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10; // quantidade de registros por página
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / limit);

    function ClickEdit(id_appointment) {
        navigate("/admin/appointments/" + id_appointment);
    }

    function ClickDelete(id_appointment) {
        console.log("Excluir" + id_appointment);
    }

    async function LoadAppointments() {
        try {
            const response = await api.get("/admin/appointments", {
                params: {
                    page,
                    limit
                }
            });

            if (response.data) {
                setAppointments(response.data.data);
                setTotal(response.data.total);
            }
        } catch (error) {
            if (error.response?.data.error && error.response.status === 401) {
                return navigate("/");
            } else {
                alert("Erro ao buscar agendamentos. Tente novamente mais tarde.");
            }
        }
    }

    useEffect(() => {
        LoadAppointments();
    }, [page]);

    return (
        <div className="container-fluid mt-page">
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
                            {doctors.map((doctor) => (
                                <option key={doctor.id_doctor} value={doctor.id_doctor}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" type="button">
                        Filtrar
                    </button>
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
                        {appointments.map((ap) => (
                            <Appointment
                                key={ap.id_appointment}
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação simples */}
            <div className="d-flex justify-content-center align-items-center my-3 gap-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= totalPages}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}

export default Appointments;
