import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../constants/api.js";

function AppointmentAdd() {
    const navigate = useNavigate();
    const { id_appointment } = useParams();

    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    const [idUser, setIdUser] = useState("");
    const [idDoctor, setIdDoctor] = useState("");
    const [idService, setIdService] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [bookingHour, setBookingHour] = useState("");

    // Carrega pacientes e médicos ao abrir a tela
    useEffect(() => {
        LoadUsers();
        LoadDoctors();
    }, []);

    useEffect(() => {
        if (idDoctor) {
            LoadServices(idDoctor);
        }
    }, [idDoctor]);

    useEffect(() => {
        console.log("ID do agendamento (string):", id_appointment);
        if (id_appointment) {
            const idParsed = Number(id_appointment);
            console.log("ID do agendamento (convertido):", idParsed);

            if (!isNaN(idParsed)) {
                LoadAppointment(idParsed); // Use o valor convertido
            } else {
                console.error("ID inválido para o agendamento:", id_appointment);
            }
        }
    }, [id_appointment]);


    useEffect(() => {
        console.log("Estado atual:", {
            id_appointment,
            idUser,
            idDoctor,
            idService,
            bookingDate,
            bookingHour,
        });
    }, [id_appointment, idUser, idDoctor, idService, bookingDate, bookingHour]);

    async function LoadUsers() {
        try {
            const response = await api.get("/admin/users");
            if (response.data) setUsers(response.data);
        } catch (error) {
            handleApiError(error, "Erro ao listar pacientes");
        }
    }

    async function LoadDoctors() {
        try {
            const response = await api.get("/doctors");
            if (response.data) setDoctors(response.data);
        } catch (error) {
            handleApiError(error, "Erro ao listar médicos");
        }
    }

    async function LoadServices(id) {
        try {
            const response = await api.get(`/doctors/${id}/services`);

            if (!response.data) {
                setServices([]); // Caso a API não retorne nada
            } else if (Array.isArray(response.data)) {
                setServices(response.data); // Caso seja um array (padrão esperado)
            } else {
                setServices([response.data]); // Caso seja um único objeto
            }
        } catch (error) {
            setServices([]); // Limpa os serviços em caso de erro
            handleApiError(error, "Erro ao listar serviços");
        }
    }

    async function LoadAppointment(id) {
        try {
            const response = await api.get(`/admin/appointments/${id}`);

            // Log para verificar os dados retornados
            console.log("Dados retornados pela API:", response.data);

            if (response.data) {
                const {
                    id_user,
                    id_doctor,
                    id_service,
                    booking_date,
                    booking_hour,
                } = response.data;

                // Log para validar a desestruturação
                console.log("Valores extraídos:", {
                    id_user,
                    id_doctor,
                    id_service,
                    booking_date,
                    booking_hour,
                });

                // Atualize os estados
                setIdUser(id_user || "");
                setIdDoctor(id_doctor || "");
                setIdService(id_service || "");
                setBookingDate(booking_date?.split("T")[0] || "");
                setBookingHour(booking_hour || "");
            } else {
                throw new Error("Nenhum dado encontrado.");
            }
        } catch (error) {
            console.error("Erro ao carregar o agendamento:", error);

            if (error.response?.data.error) {
                if (error.response.status === 401) {
                    navigate("/"); // Redireciona para a página de login se o usuário não estiver autenticado
                } else {
                    alert(error.response.data.error);
                }
            } else {
                alert("Erro ao carregar os dados do agendamento.");
            }
        }
    }

    async function SaveAppointment() {
        if (!idUser || !idDoctor || !idService || !bookingDate || !bookingHour) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        const json = {
            id_appointment: Number(id_appointment),
            id_user: idUser,
            id_doctor: idDoctor,
            id_service: idService,
            booking_date: bookingDate,
            booking_hour: bookingHour,
        };

        console.log("Payload enviado para API:", json);

        try {
            const response = id_appointment > 0 ? await api.put(`/admin/appointments/${id_appointment}`, json)
                :
                await api.post("/admin/appointments", json);

            if (response.data) navigate("/admin/appointments");
        } catch (error) {
            handleApiError(error, "Erro ao salvar dados");
        }
    }

    function handleApiError(error, defaultMessage) {
        if (error.response?.data?.error) {
            if (error.response.status === 401) return navigate("/");
            alert(error.response.data.error);
        } else {
            alert(defaultMessage);
        }
    }

    return (
        <>
            <Navbar />
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-2">
                        <h2>
                            {id_appointment > 0 ? "Editar Agendamento" : "Novo Agendamento"}
                        </h2>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="user" className="form-label">Paciente</label>
                        <div className="form-control mb-2">
                            <select
                                name="user"
                                id="user"
                                value={idUser}
                                onChange={(e) => { console.log("Selecionado usuário:", e.target.value); setIdUser(e.target.value) }}
                            >
                                <option value="">Selecione o paciente</option>
                                {users.map((user) => (
                                    <option key={user.id_user} value={user.id_user}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="doctor" className="form-label">Médico</label>
                        <div className="form-control mb-2">
                            <select
                                name="doctor"
                                id="doctor"
                                value={idDoctor}
                                onChange={(e) => setIdDoctor(e.target.value)}
                            >
                                <option value="">Selecione o médico</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id_doctor} value={doctor.id_doctor}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <label htmlFor="service" className="form-label">Serviços</label>
                        <div className="form-control mb-2">
                            <select
                                name="service"
                                id="service"
                                value={idService}
                                onChange={(e) => setIdService(e.target.value)}
                            >
                                <option value="">Selecione o serviço</option>
                                {services.map((service) => (
                                    <option key={service.id_service} value={service.id_service}>
                                        {service.description}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>

                    <div className="col-6 mt-3">
                        <label htmlFor="bookingDate" className="form-label">Data</label>
                        <input
                            className="form-control"
                            type="date"
                            name="bookingDate"
                            id="bookingDate"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                        />
                    </div>

                    <div className="col-6 mt-3">
                        <label htmlFor="bookingHour" className="form-label">Horário</label>
                        <div className="form-control mb-2">
                            <select
                                name="bookingHour"
                                id="bookingHour"
                                value={bookingHour}
                                onChange={(e) => setBookingHour(e.target.value)}
                            >
                                <option value="00:00">Horário</option>
                                <option value="09:00">09:00</option>
                                <option value="09:30">09:30</option>
                                <option value="10:00">10:00</option>
                                <option value="10:30">10:30</option>
                                <option value="11:00">11:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-12 mt-4">
                        <div className="d-flex justify-content-end">
                            <Link to="/admin/appointments" className="btn btn-outline-primary me-3" type="button">
                                Cancelar
                            </Link>
                            <button onClick={SaveAppointment} className="btn btn-primary" type="button">
                                Salvar Dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AppointmentAdd;
