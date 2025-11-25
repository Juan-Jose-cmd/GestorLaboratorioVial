import { useState, useEffect } from "react";
import HumedadChartDynamic from "../../../../../components/Charts/HumedadChartDynamic";
import ModalPreview from "../../../../../components/Modal/ModalPreview";
import './Humedad.css';

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

const Humedad = () => {

    //Abrir cerrar modal
    const [modalOpen, setModalOpen] = useState(false);

    // Estados del formulario
    const [id, setId] = useState("");
    const [nombreObra, setNombreObra] = useState("");
    const [profDesde, setProfDesde] = useState("");
    const [profHasta, setProfHasta] = useState("");
    const [clasificacion, setClasificacion] = useState("");
    const [pesoHumedo, setPesoHumedo] = useState<number | "">("");
    const [pesoSeco, setPesoSeco] = useState<number | "">("");
    const [temperatura, setTemperatura] = useState(110);
    const [hora, setHora] = useState("");
    const [fecha, setFecha] = useState("");
    const [detalles, setDetalles] = useState("");

    // Resultado del cálculo
    const [humedad, setHumedad] = useState<number | null>(null);

    const [muestras, setMuestras] = useState<MuestraHumedad[]>([]);

    const [tipoGrafico, setTipoGrafico] = useState("bar");

    useEffect(() => {
        const stored = localStorage.getItem("muestras_humedad");
        if (stored) {
            setMuestras(JSON.parse(stored));
        }
    }, []);

    const calcularHumedad = () => {

        // Validación
        if (!pesoHumedo || !pesoSeco || pesoSeco === 0) {
            alert("Complete los pesos correctamente ");
            return;
        }

        if (!nombreObra) {
            alert("Debe ingresar el nombre de la obra 🏗️");
            return;
        }

        // Cálculo
        const resultado = ((Number(pesoHumedo) - Number(pesoSeco)) / Number(pesoSeco)) * 100;
        const humedadFinal = Number(resultado.toFixed(2));
        setHumedad(humedadFinal);

        // Crear objeto MÉDIPTO / Muestra COMPLETA 
        const nuevaMuestra: MuestraHumedad = {
            id: id || `M-${muestras.length + 1}`,
            nombreObra,
            profundidadDesde: profDesde,
            profundidadHasta: profHasta,
            clasificacion,
            pesoHumedo: Number(pesoHumedo),
            pesoSeco: Number(pesoSeco),
            temperatura,
            hora,
            fecha,
            detalles,
            humedad: humedadFinal,
        };

        // Guardar en estado
        const nuevasMuestras = [...muestras, nuevaMuestra];
        setMuestras(nuevasMuestras);

        // Guardar en LocalStorage
        localStorage.setItem("muestras_humedad", JSON.stringify(nuevasMuestras));
    };


    const borrarMuestras = () => {

        const confirmacion = confirm("¿Seguro que desea borrar TODAS las muestras almacenadas?");
        
        if (!confirmacion) return;

        localStorage.removeItem("muestras_humedad");
        setMuestras([]);
        setHumedad(null);
    };


    return(
        <div className="form-container">
            <form className="form-card">

                <h2>Ensayo de Humedad del Suelo</h2>

                <label>Identificador de la muestra</label>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} />

                <label>Nombre de la Obra</label>
                <input
                    type="text"
                    value={nombreObra}
                    onChange={(e) => setNombreObra(e.target.value)}
                    placeholder="Ej: Ruta Provincial 2 - Tramo Km 21 al 40"
                />

                <label>Profundidad de muestreo (cm)</label>
                <div className="double-input">
                    <input type="number" value={profDesde} onChange={(e) => setProfDesde(e.target.value)} placeholder="Desde" />
                    <input type="number" value={profHasta} onChange={(e) => setProfHasta(e.target.value)} placeholder="Hasta" />
                </div>

                <label>Clasificación del suelo</label>
                <select value={clasificacion} onChange={(e) => setClasificacion(e.target.value)}>
                    <option value="">Seleccione tipo</option>
                    <option>Arcilla</option>
                    <option>Limo</option>
                    <option>Arena</option>
                    <option>Grava</option>
                    <option>Mixto</option>
                </select>

                <label>Peso húmedo (g)</label>
                <input type="number" value={pesoHumedo} onChange={(e) => setPesoHumedo(Number(e.target.value))} />

                <label>Peso seco (g)</label>
                <input
                    type="number"
                    value={pesoSeco}
                    onChange={(e) => {
                        const value = Number(e.target.value);
    
                        if (value > Number(pesoHumedo)) {
                            alert("El peso seco no puede ser mayor al peso húmedo");
                            return;
                        }

                        setPesoSeco(value);
                    }}
                />

                <label>Temperatura de secado (°C)</label>
                <input type="number" value={temperatura} onChange={(e) => setTemperatura(Number(e.target.value))} />

                <label>Hora de extracción</label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />

                <label>Fecha de extracción</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

                <label>Detalles (opcional)</label>
                <textarea value={detalles} onChange={(e) => setDetalles(e.target.value)} />

                <button type="button" className="btn-calcular" onClick={calcularHumedad}>
                    Calcular Humedad
                </button>

                {humedad !== null && (
                    <h3 style={{ color: "#64FFDA", marginTop: "1rem", textAlign: "center" }}>
                        Humedad: <span>{humedad}%</span>
                    </h3>
                )}

                {muestras.length > 0 && (
                    <>
                        <label style={{ marginTop: "2rem" }}>Tipo de gráfico</label>
                        <select
                            value={tipoGrafico}
                            onChange={(e) => setTipoGrafico(e.target.value)}
                            style={{
                                background: "#0A192F",
                                border: "1px solid #233554",
                                color: "#D9E2EC",
                                padding: ".5rem",
                                borderRadius: "6px",
                                marginBottom: "1rem"
                            }}
                        >
                            <option value="bar">Barras</option>
                            <option value="line">Línea</option>
                            <option value="scatter">Puntos</option>
                        </select>

                        <h3 style={{ textAlign: "center", color: "#64FFDA" }}>Gráfica de Humedad</h3>
                        <HumedadChartDynamic type={tipoGrafico} data={muestras} />

                        <button
                            type="button"
                            className="btn-borrar"
                            onClick={borrarMuestras}
                        >
                            Borrar todas las muestras
                        </button>

                        <button
                            type="button"
                            className="btn-calcular"  // o un nuevo estilo si querés
                            onClick={() => setModalOpen(true)}
                            style={{ marginTop: "1rem" }}
                        >
                            Vista preliminar de informe
                        </button>
                    </>
                )}

            </form>

            {/*redenrizado de modal*/}
            <ModalPreview
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                muestras={muestras}
                nombreObra={nombreObra}
            />

        </div>
    );
};

export default Humedad;
