import React from "react";
import ProctorChart from "../Charts/ProctorChart";
import "./ModalPreview.css";

interface PuntoProctor {
    humedad: number;
    moldeMasSuelo: number;
    golpes: number;
    observaciones?: string;
    pesoSuelo: number;
    densidadHumeda: number;
    densidadSeca: number;
}

interface ModalPreviewProctorProps {
    open: boolean;
    onClose: () => void;
    obra: string;
    muestraId: string;
    clasificacion: string;
    tipoProctor: string;
    norma: string;
    fecha: string;
    hora: string;
    observaciones?: string;
    equipo: {
        pesoMolde: string;
        diametroMolde: string;
        alturaMolde: string;
        volumenMolde: number;
        pesoPison: string;
        alturaCaida: string;
    };
    puntos: PuntoProctor[];
}

const ModalPreviewProctor: React.FC<ModalPreviewProctorProps> = ({
    open,
    onClose,
    obra,
    muestraId,
    clasificacion,
    tipoProctor,
    norma,
    fecha,
    hora,
    observaciones,
    equipo,
    puntos
}) => {
    
    if (!open) return null;

    const fechaInforme = new Date().toLocaleDateString();

    // Buscar punto máximo
    const max = Math.max(...puntos.map(p => p.densidadSeca));
    const opt = puntos.find(p => p.densidadSeca === max);

    const exportarPDF = async () => {

        if (puntos.length === 0) {
            alert("No hay puntos cargados");
            return;
        }

        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;
        const html2canvas = (await import("html2canvas")).default;

        const pdf = new jsPDF("p", "mm", "a4");
        let y = 18;

        //ENCABEZADO
        pdf.setFontSize(14);
        pdf.text("Laboratorio Vial XYZ", 14, y);
        y += 6;
        pdf.setFontSize(11);
        pdf.text("Ensayo Proctor — Curva de Compactación", 14, y);
        y += 10;

        // DATOS ENSAYO
        autoTable(pdf, {
            startY: y,
            head: [["ID Muestra", "Clasificación", "Tipo Proctor", "Norma", "Fecha-Hora"]],
            body: [[
                muestraId || "-",
                clasificacion || "-",
                tipoProctor || "-",
                norma || "-",
                `${fecha} ${hora}`
            ]],
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 120, 212] }
        });

        y = (pdf as any).lastAutoTable.finalY + 8;

        //  EQUIPO
        pdf.setFontSize(11);
        pdf.text("Equipo utilizado", 14, y);
        y += 4;

        autoTable(pdf, {
            startY: y,
            head: [["P. Molde (g)", "Ø (mm)", "Altura (mm)", "Vol. (cm³)", "P. Pisón (kg)", "Caída (mm)"]],
            body: [[
                equipo.pesoMolde,
                equipo.diametroMolde,
                equipo.alturaMolde,
                equipo.volumenMolde,
                equipo.pesoPison,
                equipo.alturaCaida
            ]],
            styles: { fontSize: 9 },
            headStyles: { fillColor: [0, 120, 212] }
        });

        y = (pdf as any).lastAutoTable.finalY + 8;

        //TABLA DE PUNTOS
        pdf.setFontSize(11);
        pdf.text("Resultados de compactación", 14, y);
        y += 4;

        autoTable(pdf, {
            startY: y,
            head: [["H (%)", "P. Suelo (g)", "D. Húmeda (g/cm³)", "D. Seca (g/cm³)", "Golpes", "Obs."]],
            body: puntos.map(p => [
                p.humedad,
                p.pesoSuelo,
                    p.densidadHumeda,
                p.densidadSeca,
                p.golpes,
                p.observaciones || "-"
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [0, 120, 212] }
        });

        y = (pdf as any).lastAutoTable.finalY + 10;

        //CURVA PROCTOR
        const chart = document.querySelector(".modal-chart-container") as HTMLElement;

        if (chart) {
            const originalBg = chart.style.background;
            chart.style.background = "#FFFFFF";

            const canvas = await html2canvas(chart, { scale: 2, backgroundColor: "#FFFFFF" });
            chart.style.background = originalBg;

            const img = canvas.toDataURL("image/png");
            pdf.addImage(img, "PNG", 15, y, 180, 65);
            y += 70;
        }

        //RESUMEN FINAL
        const max = Math.max(...puntos.map(p => p.densidadSeca));
        const opt = puntos.find(p => p.densidadSeca === max);

        pdf.setFontSize(11);
        y += 8;
        pdf.text(`Humedad óptima: ${opt?.humedad.toFixed(2)} %`, 14, y);
        y += 5;
        pdf.text(`Densidad seca máxima: ${max.toFixed(3)} g/cm³`, 14, y);

        //FIRMA / SELLO
        y += 18;
        pdf.setFontSize(10);
        pdf.text("Responsable del ensayo:", 14, y);
        y += 16;
        pdf.line(14, y, 85, y);
        y += 5;
        pdf.text("Firma y aclaración", 30, y);

        y -= 22;
        pdf.rect(120, y, 70, 25);
        pdf.text("Sello del laboratorio", 130, y + 33);

        pdf.save(`Proctor_${muestraId || "muestra"}.pdf`);
    };

    return (
        <div className="modal-overlay">

            <div className="modal-content">

                {/* ENCABEZADO */}
                <header className="modal-header">
                    <div className="modal-logo-placeholder">LOGO</div>
                    <div className="modal-header-text">
                        <h1>Laboratorio Vial XYZ</h1>
                        <h2>Ensayo Proctor – Curva de Compactación</h2>
                        <p><strong>Obra:</strong> {obra || "No especificada"}</p>
                        <p><strong>Fecha de informe:</strong> {fechaInforme}</p>
                    </div>
                </header>

                {/* DATOS DE ENSAYO */}
                <section className="modal-section">
                    <h3>Datos del ensayo</h3>

                    <table className="modal-table">
                        <tbody>
                            <tr><th>ID muestra</th><td>{muestraId}</td></tr>
                            <tr><th>Clasificación</th><td>{clasificacion}</td></tr>
                            <tr><th>Tipo Proctor</th><td>{tipoProctor}</td></tr>
                            <tr><th>Norma</th><td>{norma}</td></tr>
                            <tr><th>Fecha / Hora</th><td>{fecha} - {hora}</td></tr>
                            {observaciones && (
                                <tr><th>Observaciones</th><td>{observaciones}</td></tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* EQUIPO */}
                <section className="modal-section">
                    <h3>Equipo utilizado</h3>

                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>P. Molde (g)</th>
                                <th>Ø (mm)</th>
                                <th>Altura (mm)</th>
                                <th>Vol. (cm³)</th>
                                <th>P. Pisón (kg)</th>
                                <th>Caída (mm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{equipo.pesoMolde}</td>
                                <td>{equipo.diametroMolde}</td>
                                <td>{equipo.alturaMolde}</td>
                                <td>{equipo.volumenMolde}</td>
                                <td>{equipo.pesoPison}</td>
                                <td>{equipo.alturaCaida}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* TABLA DE PUNTOS */}
                <section className="modal-section">
                    <h3>Puntos obtenidos</h3>

                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>H. (%)</th>
                                <th>P. Suelo (g)</th>
                                <th>D. Húm. (g/cm³)</th>
                                <th>D. Seca (g/cm³)</th>
                                <th>Golpes</th>
                                <th>Obs.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {puntos.map((p, i) => (
                                <tr key={i} className={p.densidadSeca === max ? "fila-max" : ""}>
                                    <td>{p.humedad}</td>
                                    <td>{p.pesoSuelo}</td>
                                    <td>{p.densidadHumeda}</td>
                                    <td>{p.densidadSeca}</td>
                                    <td>{p.golpes}</td>
                                    <td>{p.observaciones || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* CURVA */}
                <section className="modal-section">
                    <h3>Curva Proctor</h3>
                    <div className="modal-chart-container">
                        <ProctorChart data={puntos.map(p => ({ humedad: p.humedad, densidadSeca: p.densidadSeca }))} />
                    </div>

                    <div className="modal-resumen">
                        <p><strong>Humedad óptima:</strong> {opt?.humedad.toFixed(2)} %</p>
                        <p><strong>Densidad seca máxima:</strong> {max.toFixed(3)} g/cm³</p>
                    </div>
                </section>

                {/* BOTONES */}
                <footer className="modal-footer">
                    <button className="btn-modal-cancel" onClick={onClose}>Cerrar</button>
                    <button className="btn-modal-export" onClick={exportarPDF}>
                        Exportar PDF
                    </button>
                </footer>

            </div>

        </div>
    );
};

export default ModalPreviewProctor;


