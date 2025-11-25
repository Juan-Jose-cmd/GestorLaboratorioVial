import React from "react";
import HumedadChartDynamic from "../Charts/HumedadChartDynamic";
import './ModalPreview.css';

// Defino el tipo de cada muestra
interface MuestraHumedad {
    id: string;
    nombreObra: string;
    profundidadDesde: string;
    profundidadHasta: string;
    clasificacion: string;
    pesoHumedo: number;
    pesoSeco: number;
    temperatura: number;
    hora: string;
    fecha: string;
    detalles: string;
    humedad: number;
}

// Defino las props que recibe el modal
interface ModalPreviewProps {

    // Si el modal está abierto o no
    open: boolean; 

    // Función para cerrarlo
    onClose: () => void;   

    // Todas las muestras a mostrar en la tabla
    muestras: MuestraHumedad[];

    // Nombre de la obra (para el encabezado)
    nombreObra: string;                   
}

// Componente principal del Modal
const ModalPreview: React.FC<ModalPreviewProps> = ({
    open,
    onClose,
    muestras,
    nombreObra,
}) => {

    // Si open es false, no dibuja nada
    if (!open) return null;

    // Obtiene fecha de hoy para el informe
    const fechaInforme = new Date().toLocaleDateString();

    const exportarPDF = async () => {

        // Importa dinámicamente
        const jsPDF = (await import("jspdf")).default;

        const autoTable = (await import("jspdf-autotable")).default;

        const html2canvas = (await import("html2canvas")).default;

        // Crea el PDF en formato A4 vertical
        const pdf = new jsPDF("p", "mm", "a4");

        //margen inicial
        let yPosition = 20;

        //LOGO
        // pdf.addImage(logo, "PNG", 10, 10, 30, 30);

        //Nombre del laboratorio
        pdf.setFontSize(14);
        pdf.text("Laboratorio Vial XYZ", 60, yPosition);
        yPosition += 8;

        //Título del informe
        pdf.setFontSize(11);
        pdf.text("Ensayo de Humedad de Suelos", 60, yPosition);
        yPosition += 6;

        //Datos de la obra
        pdf.setFontSize(10);
        pdf.text(`Obra: ${nombreObra}`, 10, yPosition);
        yPosition += 5;

        //Fecha de generación
        pdf.text(`Fecha de informe: ${new Date().toLocaleDateString()}`, 10, yPosition);
        yPosition += 10;

        // TABLA
        autoTable(pdf, {
            startY: yPosition,
            head: [[
                "ID", "Prof. (cm)", "Clasificación", "P. Húmedo", "P. Seco",
                "Temp. °C", "Humedad %", "Fecha", "Hora"
            ]],
            body: muestras.map(m => ([
                m.id,
                `${m.profundidadDesde}-${m.profundidadHasta}`,
                m.clasificacion,
                m.pesoHumedo,
                m.pesoSeco,
                m.temperatura,
                m.humedad,
                m.fecha,
                m.hora
            ])),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 120, 212] }, // Azul profesional
        });

        // Actualiza posicion despues de la tabla
        yPosition = (pdf as any).lastAutoTable.finalY + 10;

        //GRÁFICOS

        //captura los contenedores HTML que ya existen en el modal
        const chartLine = document.querySelector(".modal-section:nth-of-type(2) .modal-chart-container") as HTMLElement;
        const chartBar = document.querySelector(".modal-section:nth-of-type(3) .modal-chart-container") as HTMLElement;

        if (chartLine) {
            const canvasLine = await html2canvas(chartLine);

            const imgLine = canvasLine.toDataURL("image/png");

            pdf.text("Gráfico Línea", 10, yPosition);

            yPosition += 5;

            pdf.addImage(imgLine, "PNG", 10, yPosition, 180, 70);

            yPosition += 75;
        }

        if (chartBar) {
            const canvasBar = await html2canvas(chartBar);

            const imgBar = canvasBar.toDataURL("image/png");

            pdf.text("Gráfico Barras", 10, yPosition);

            yPosition += 5;

            pdf.addImage(imgBar, "PNG", 10, yPosition, 180, 70);
        }

        //Guardar PDF
        pdf.save(`Informe_Humedad_${new Date().toLocaleDateString()}.pdf`);

        //BLOQUE DE FIRMA

        yPosition += 15;

        pdf.setFontSize(10);
        pdf.text("__________________________________________", 10, yPosition);
        yPosition += 5;

        pdf.text("Responsable:", 10, yPosition);
        yPosition += 5;

        pdf.text("Ing. Juan Pérez", 10, yPosition);
        yPosition += 5;

        pdf.text("Laboratorio Vial XYZ", 10, yPosition);

        };

    return (
        //Capa oscura de fondo
        <div className="modal-overlay">

            {/* 7) Contenedor de la "hoja" */}
            <div className="modal-content">
        
                {/* 8) Encabezado del informe */}
                <header className="modal-header">

                    <div className="modal-logo-placeholder">
                        LOGO
                    </div>

                    <div className="modal-header-text">
                        <h1>Laboratorio Vial XYZ</h1>
                        <h2>Ensayo de Contenido de Humedad en Suelos</h2>
                        <p><strong>Obra:</strong> {nombreObra || "No especificada"}</p>
                        <p><strong>Fecha de informe:</strong> {fechaInforme}</p>
                    </div>

                </header>

                {/* 9) Tabla de muestras */}
                <section className="modal-section">
                    <h3>Tabla de resultados</h3>
                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>Muestra</th>
                                <th>Profundidad (cm)</th>
                                <th>Clasificación</th>
                                <th>P. húmedo (g)</th>
                                <th>P. seco (g)</th>
                                <th>Temp. (°C)</th>
                                <th>Humedad (%)</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {muestras.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.id}</td>
                                    <td>{m.profundidadDesde} - {m.profundidadHasta}</td>
                                    <td>{m.clasificacion}</td>
                                    <td>{m.pesoHumedo}</td>
                                    <td>{m.pesoSeco}</td>
                                    <td>{m.temperatura}</td>
                                    <td>{m.humedad}</td>
                                    <td>{m.fecha}</td>
                                    <td>{m.hora}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/*Gráficos al final del informe */}
                <section className="modal-section">
                    <h3>Gráfico de humedad – Línea</h3>
                    <div className="modal-chart-container">
                        <HumedadChartDynamic
                            type="line"
                            data={muestras.map((m) => ({ id: m.id, humedad: m.humedad }))}
                        />
                    </div>
                </section>

                <section className="modal-section">
                    <h3>Gráfico de humedad – Barras</h3>
                    <div className="modal-chart-container">
                        <HumedadChartDynamic
                            type="bar"
                            data={muestras.map((m) => ({ id: m.id, humedad: m.humedad }))}
                        />
                    </div>
                </section>

                {/*Botones de acción */}
                <footer className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>
                        Cerrar
                    </button>
                    <button className="btn-modal-export" onClick={exportarPDF}>
                        Exportar PDF
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModalPreview;
