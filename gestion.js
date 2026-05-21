const pacientes = [
  {
    id: 1,
    nombre: "Lucía Gómez",
    cobertura: "IOMA",
    servicio: "Kinesiología respiratoria pediátrica",
    fecha: "2026-05-22",
    hora: "17:30",
    estado: "Confirmado",
    docsFaltantes: ["Orden médica"],
    pago: "Pendiente",
    importe: 4200,
    nuevo: true
  },
  {
    id: 2,
    nombre: "Martín Pérez",
    cobertura: "Particular",
    servicio: "Rehabilitación postoperatoria de rodilla",
    fecha: "2026-05-23",
    hora: "14:00",
    estado: "Confirmado",
    docsFaltantes: [],
    pago: "Pagado",
    importe: 5400,
    nuevo: false
  },
  {
    id: 3,
    nombre: "Carla Díaz",
    cobertura: "SANCOR",
    servicio: "Kinesiología de piso pélvico",
    fecha: "2026-05-24",
    hora: "17:30",
    estado: "Alternativa",
    docsFaltantes: ["DNI"],
    pago: "Pendiente",
    importe: 4300,
    nuevo: true
  },
  {
    id: 4,
    nombre: "Jorge López",
    cobertura: "Medife",
    servicio: "Rehabilitación respiratoria adultos",
    fecha: "2026-05-25",
    hora: "17:30",
    estado: "Asistió",
    docsFaltantes: [],
    pago: "Pagado",
    importe: 3800,
    nuevo: false
  },
  {
    id: 5,
    nombre: "Ana Romero",
    cobertura: "PAMI",
    servicio: "Kinesiología general",
    fecha: "2026-05-26",
    hora: "08:00",
    estado: "Inasistencia",
    docsFaltantes: ["Estudios"],
    pago: "Pendiente",
    importe: 3600,
    nuevo: false
  },
  {
    id: 6,
    nombre: "Pedro Suárez",
    cobertura: "OSPE",
    servicio: "Neurorehabilitación",
    fecha: "2026-05-26",
    hora: "09:00",
    estado: "Confirmado",
    docsFaltantes: [],
    pago: "Pendiente",
    importe: 6200,
    nuevo: false
  }
];

const coverageStyles = {
  Particular: "badge-particular",
  PAMI: "badge-pami",
  IOMA: "badge-ioma",
  SANCOR: "badge-sancor",
  Medife: "badge-medife",
  OSPE: "badge-ospe"
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
};

const formatDate = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  }).format(date);
};

const groupBy = (items, keyFn) => {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
};

const renderMetrics = () => {
  const totalTurnos = pacientes.length;
  const nuevos = pacientes.filter((item) => item.nuevo).length;
  const inasistencias = pacientes.filter((item) => item.estado === "Inasistencia").length;
  const ingresos = pacientes.reduce((sum, item) => sum + item.importe, 0);

  document.querySelector("#metric-turnos").textContent = totalTurnos;
  document.querySelector("#metric-nuevos").textContent = nuevos;
  document.querySelector("#metric-inasistencias").textContent = inasistencias;
  document.querySelector("#metric-ingresos").textContent = formatCurrency(ingresos);
};

const renderWeeklySummary = () => {
  const summaryBody = document.querySelector("#weekly-summary tbody");
  const days = ["2026-05-22", "2026-05-23", "2026-05-24", "2026-05-25", "2026-05-26"];
  const grouped = groupBy(pacientes, (item) => item.fecha);

  summaryBody.innerHTML = days
    .map((date) => {
      const items = grouped[date] || [];
      const nuevos = items.filter((item) => item.nuevo).length;
      const inasistencias = items.filter((item) => item.estado === "Inasistencia").length;
      const ingresos = items.reduce((sum, item) => sum + item.importe, 0);
      return `<tr>
        <td>${formatDate(date)}</td>
        <td>${items.length}</td>
        <td>${nuevos}</td>
        <td>${inasistencias}</td>
        <td>${formatCurrency(ingresos)}</td>
      </tr>`;
    })
    .join("");
};

const renderDailyAgenda = () => {
  const agendaBody = document.querySelector("#daily-agenda tbody");
  agendaBody.innerHTML = pacientes
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))
    .map((item) => {
      const badgeClass = coverageStyles[item.cobertura] || "badge-particular";
      const missing = item.docsFaltantes.length ? item.docsFaltantes.join(", ") : "Completo";
      return `<tr>
        <td>${formatDate(item.fecha)}</td>
        <td>${item.hora}</td>
        <td>${item.nombre}</td>
        <td>${item.servicio}</td>
        <td><span class="status-badge ${badgeClass}">${item.cobertura}</span></td>
        <td>${item.estado}${item.docsFaltantes.length ? ` · <strong>Docs: ${missing}</strong>` : ""}</td>
        <td>${item.pago} · ${formatCurrency(item.importe)}</td>
      </tr>`;
    })
    .join("");
};

const setWhatsAppMessages = () => {
  const baseUrl = "https://wa.me/5491132016039?text=";
  const mensajeConfirmacion = "Hola %nombre%, tu turno en Kareh está confirmado para el %fecha% a las %hora%. Por favor trae DNI, orden médica y estudios. Responde si podés asistir.";
  const mensajeDocumentacion = "Hola %nombre%, antes del turno necesitamos tu DNI y orden médica. Mandanos los archivos por WhatsApp o confirmá cuándo los traés al consultorio.";
  const mensajePago = "Hola %nombre%, te recordamos el pago del turno programado para el %fecha%. Podés abonarlo en el consultorio o por transferencia. Avísanos si querés link de pago.";
  const mensajeCobertura = "Hola, tenemos turnos para kinesiología en Bella Vista. Atendemos PAMI, IOMA, SANCOR, Medife, OSPE y particulares. ¿Qué obra social tenés?";

  document.querySelector("#message-confirmacion").textContent = mensajeConfirmacion;
  document.querySelector("#message-documentacion").textContent = mensajeDocumentacion;
  document.querySelector("#message-pago").textContent = mensajePago;
  document.querySelector("#message-cobertura").textContent = mensajeCobertura;

  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const text = document.querySelector(`#${targetId}`).textContent;
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = "Copiado";
        setTimeout(() => {
          button.textContent = "Copiar mensaje";
        }, 1200);
      });
    });
  });
};

const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadJSON = () => {
  const content = JSON.stringify(pacientes, null, 2);
  downloadFile(content, "pacientes-kareh.json", "application/json;charset=utf-8");
};

const downloadCSV = () => {
  const header = ["id", "nombre", "cobertura", "servicio", "fecha", "hora", "estado", "docsFaltantes", "pago", "importe", "nuevo"];
  const rows = pacientes.map((item) => [
    item.id,
    item.nombre,
    item.cobertura,
    item.servicio,
    item.fecha,
    item.hora,
    item.estado,
    `"${item.docsFaltantes.join("; ")}"`,
    item.pago,
    item.importe,
    item.nuevo
  ]);
  const csv = [header.join(";"), ...rows.map((row) => row.join(";"))].join("\n");
  downloadFile(csv, "pacientes-kareh.csv", "text/csv;charset=utf-8");
};

const initDashboard = () => {
  renderMetrics();
  renderWeeklySummary();
  renderDailyAgenda();
  setWhatsAppMessages();
  document.querySelector("#download-json").addEventListener("click", downloadJSON);
  document.querySelector("#download-csv").addEventListener("click", downloadCSV);
};

window.addEventListener("DOMContentLoaded", initDashboard);
