import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../constants/api";

function DoctorAdd() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [icon, setIcon] = useState("F"); // valor padrão feminino
    const [msg, setMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            const payload = { name, specialty, icon };
            console.log("Enviando:", payload);

            await api.post("/doctors", payload);
            navigate("/doctors");
        } catch (error) {
            console.error("Erro ao cadastrar médico:", error);
            if (error.response?.data?.error) {
                setMsg(error.response.data.error);
            } else {
                setMsg("Erro ao cadastrar médico. Tente novamente.");
            }
        }
    }

    return (
        <div className="container mt-page">
            <h2>Novo Médico</h2>

            {msg && <div className="alert alert-danger">{msg}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Especialidade</label>
                    <input
                        className="form-control"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Sexo</label>
                    <select
                        className="form-select"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        required
                    >
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    Cadastrar Médico
                </button>
            </form>
        </div>
    );
}

export default DoctorAdd;
