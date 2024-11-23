function Appointment(props) {
    // Cria um objeto Date combinando a data e o horário
    const createDate = (dateString, timeString) => {
        if (!dateString || !timeString) return null;

        // Remove a parte do horário da data original e substitui pelo `booking_hour`
        const isoDateWithTime = dateString.split("T")[0] + "T" + timeString;
        const dt = new Date(isoDateWithTime);

        // Verifica se o objeto Date criado é válido
        return isNaN(dt.getTime()) ? null : dt;
    };

    // Criação da data e hora combinadas
    const dt = createDate(props.booking_date, props.booking_hour);

    return (
        <tr>
            <td>{props.user}</td>
            <td>{props.doctor}</td>
            <td>{props.service}</td>
            <td>
                {dt
                    ? `${new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                    }).format(dt)} às ${props.booking_hour}`
                    : "Data inválida"}
            </td>
            <td className="text-end">
                {props.price
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(props.price)
                    : "Preço não disponível"}
            </td>
            <td className="text-end">
                <div className="d-inline me-3">
                    <button
                        onClick={() => props.clickEdit(props.id_appointment)}
                        className="btn btn-sm btn-primary"
                        aria-label="Editar Agendamento"
                        title="Editar Agendamento"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                </div>
                <button
                    onClick={() => props.clickDelete(props.id_appointment)}
                    className="btn btn-sm btn-danger"
                    aria-label="Excluir Agendamento"
                    title="Excluir Agendamento"
                >
                    <i className="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    );
}

export default Appointment;
