import Navbar from "../../components/navbar/navbar.jsx";
import "./appointments.css";
import { Link, useNavigate } from "react-router-dom";
import Appointment from "../../components/appointment/appointment.jsx";
import { useEffect, useState, useMemo } from "react";
import api from "../../constants/api.js";

function Appointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]); // <--- estado dos médicos
    const [page, setPage] = useState(1);
    const limit = 10;
    const [total, setTotal] = useState(0);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    const [startDate, setStartDate] = useState(localStorage.getItem("startDate") || "");
    const [endDate, setEndDate] = useState(localStorage.getItem("endDate") || "");
    const [doctorId, setDoctorId] = useState(localStorage.getItem("doctorId") || "");
    const [loading, setLoading] = useState(false);

    // Carrega médicos do backend quando o componente monta
    useEffect(() => {
        async function loadDoctors() {
            try {
                const response = await api.get("/doctors");
                setDoctors(response.data);
            } catch (error) {
                console.error("Erro ao carregar médicos", error);
            }
        }
        loadDoctors();
    }, []);

    useEffect(() => {
        localStorage.setItem("startDate", startDate);
        localStorage.setItem("endDate", endDate);
        localStorage.setItem("doctorId", doctorId);
        setPage(1);
    }, [startDate, endDate, doctorId]);

    useEffect(() => {
        LoadAppointments();
    }, [page, startDate, endDate, doctorId]);

    async function LoadAppointments() {
        setLoading(true);
        try {
            const response = await api.get("/admin/appointments", {
                params: {
                    page,
                    limit,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    doctorId: doctorId || undefined,
                },
            });

            if (response.data) {
                const { data, total } = response.data;

                const newTotalPages = Math.ceil(total / limit);
                if (page > newTotalPages && newTotalPages > 0) {
                    setPage(newTotalPages);
                    return;
                }

                setAppointments(data);
                setTotal(total);
            }
        } catch (error) {
            if (error.response?.data.error && error.response.status === 401) {
                return navigate("/");
            } else {
                alert("Erro ao buscar agendamentos. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleClearFilters() {
        setStartDate("");
        setEndDate("");
        setDoctorId("");
        localStorage.removeItem("startDate");
        localStorage.removeItem("endDate");
        localStorage.removeItem("doctorId");
        setPage(1);
    }

    function ClickEdit(id_appointment) {
        navigate("/admin/appointments/" + id_appointment);
    }

    function ClickDelete(id_appointment) {
        console.log("Excluir", id_appointment);
    }

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

                <div className="d-flex justify-content-end align-items-center gap-2">
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>Até</span>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    <div className="form-control p-0 ms-2 me-2">
                        <select
                            className="form-select border-0"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                        >
                            <option value="">Todos os médicos</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id_doctor} value={doctor.id_doctor}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn btn-outline-secondary" onClick={handleClearFilters}>
                        Limpar
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
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Carregando...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Nenhum agendamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((ap) => (
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center my-3 gap-3">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page >= totalPages}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}

export default Appointments;
