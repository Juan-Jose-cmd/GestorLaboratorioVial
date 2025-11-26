import { useState, useEffect } from "react";
import ProctorChart from "../../../../../components/Charts/ProctorChart";
import ModalPreviewProctor from "../../../../../components/Modal/ModalPreviewProctor.tsx";
import './Proctor.css';

// Tipo de ensayo
type TipoProctor = "Normal" | "Modificado";
type NormaProctor = "IRAM" | "ASTM";

interface EnsayoProctor {
    obra: string;
    muestraId: string;
    clasificacion: string;
    tipoProctor: TipoProctor;
    norma: NormaProctor;
    fecha: string;
    hora: string;
    observaciones?: string;
}

interface EquipoProctor {
    pesoMolde: number;     
    diametroMolde: number;  
    alturaMolde: number;  
    volumenMolde: number;   
    pesoPison: number;   
    alturaCaida: number;    
}

interface PuntoProctor {
    pesoHumedo?: number;
    pesoSeco?: number;
    humedad: number;
    moldeMasSuelo: number;
    golpes: number;
    observaciones?: string;
    pesoSuelo: number;
    densidadHumeda: number;
    densidadSeca: number;
}

interface ProctorData {
    general: EnsayoProctor;
    equipo: EquipoProctor;
    puntos: PuntoProctor[];
}

const Proctor = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const [obra, setObra] = useState('');
    const [muestraId, setMuestraId] = useState('');
    const [clasificacion, setClasificacion] = useState('');
    const [tipoProctor, setTipoProctor] = useState('');
    const [norma, setNorma] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [observaciones, setObservaciones] = useState("");
    
    const [pesoMolde, setPesoMolde] = useState('');          //g
    const [diametroMolde, setDiametroMolde] = useState('');  //mm
    const [alturaMolde, setAlturaMolde] = useState('');      //mm
    const [volumenMolde, setVolumenMolde] = useState(0);      //cm3
    const [pesoPison, setPesoPison] = useState('');          //kg
    const [alturaCaida, setAlturaCaida] = useState('');      // mm

    const [humedad, setHumedad] = useState('');
    const [moldeMasSuelo, setMoldeMasSuelo] = useState('');
    const [golpes, setGolpes] = useState('');
    const [obsPunto, setObsPunto] = useState("");
    const [pesoSuelo, setPesoSuelo] = useState(0);
    const [densidadHumeda, setDensidadHumeda] = useState(0);
    const [densidadSeca, setDensidadSeca] = useState(0);

    const [modoHumedad, setModoHumedad] = useState("manual");

    const [pesoHumedoP, setPesoHumedoP] = useState("");
    const [pesoSecoP, setPesoSecoP] = useState("");

    const [puntos, setPuntos] = useState<PuntoProctor[]>([]);

    //Determina la densidad maxima
    const maxDensidadSeca = puntos.length > 0 
        ? Math.max(...puntos.map(p => p.densidadSeca))
        : 0;

    useEffect( () =>{
        
        //Covierto los string en numeros
        const dmm = Number(diametroMolde);
        const hmm = Number(alturaMolde);

        if (dmm > 0 && hmm > 0) {
            //Convertir mm a cm (el calculo es dmm/10/2 para obter radio)
            const radio = dmm / 20;
            const altura = hmm /10;

            //Luego calculo el volumen (pi * r2 * h)
            const volumen = Math.PI * Math.pow(radio, 2) * altura;

            //Guardo con 2 decimales
            setVolumenMolde(Number(volumen.toFixed(2)));
            
        }else { //Si no hay o flata datos que resetee
            setVolumenMolde(0);
        }

    }, [diametroMolde, alturaMolde]);

    const calcularPunto = () => {

        if (!moldeMasSuelo || !golpes || !pesoMolde || volumenMolde === 0) {
            alert('Complete los datos del punto y el equipo primero')
            return;
        };

        let humedadNum = 0;

        if (modoHumedad === "manual") {
            if (!humedad) {
                alert("Ingrese la humedad manual.");
                return;
            }

            humedadNum = Number(humedad);
    
            } else {
                if (!pesoHumedoP || !pesoSecoP || Number(pesoSecoP) === 0) {
                    alert("Complete los pesos húmedo y seco para calcular la humedad.");
                    return;
                }
        
                humedadNum = ((Number(pesoHumedoP) - Number(pesoSecoP)) / Number(pesoSecoP)) * 100;

                setHumedad(humedadNum.toFixed(2));
            }

        const moldeMasSueloNum = Number(moldeMasSuelo);
        const pesoMoldeNum = Number(pesoMolde);
        const pesoSueloCalc = moldeMasSueloNum - pesoMoldeNum;

        const densHumedaCalc = pesoSueloCalc / volumenMolde;
        const densSecaCalc = densHumedaCalc / (1 + humedadNum / 100);

        setPesoSuelo(Number(pesoSueloCalc.toFixed(2)));
        setDensidadHumeda(Number(densHumedaCalc.toFixed(3)));
        setDensidadSeca(Number(densSecaCalc.toFixed(3)));
    }

    const guardarPunto = () => {

        if (!humedad || !moldeMasSuelo || !golpes) {
            alert('Complete los campos del punto antes de guardad');
            return;
        }

        if (densidadHumeda === 0 || densidadSeca === 0) {
            alert('Primero calcule el punto antes de guardar');
            return;
        }

        //Creo el objeto 'Punto'
        const nuevoPunto: PuntoProctor = {
            pesoHumedo: modoHumedad === "calcular" ? Number(pesoHumedoP) : undefined,
            pesoSeco: modoHumedad === "calcular" ? Number(pesoSecoP) : undefined,
            humedad: Number(humedad),
            moldeMasSuelo: Number(moldeMasSuelo),
            golpes: Number(golpes),
            observaciones: obsPunto || '',
            pesoSuelo,
            densidadHumeda,
            densidadSeca,
        };

        //Agrego a la lista
        setPuntos([...puntos, nuevoPunto]);

        //Limpiar inputs
        setHumedad("");
        setMoldeMasSuelo("");
        setGolpes("");
        setObsPunto("");

        // Limpiar valores calculados
        setPesoSuelo(0);
        setDensidadHumeda(0);
        setDensidadSeca(0);

        alert('Punto agregado correctamente')
    }

    const eliminarPunto = (index: number) => {
        
        const nuevosPuntos = puntos.filter((_, i) => i !== index);

        setPuntos(nuevosPuntos);

    };

    return (
        <div className="proctor-container">
            <h2>Ensayo Proctor</h2>

            {/*Datos generales*/}
            <section className="proctor-section">
                <h3>Datos generales del ensayo</h3>

                <div className="proctor-grid">

                    <div className="field">

                        <label>Nombre de la obra</label>
                        <input
                            type="text"
                            value={obra}
                            onChange={(e) => setObra(e.target.value)}
                        />

                    </div>

                    <div className="field">

                        <label>ID de muestra</label>
                        <input
                            type="text"
                            value={muestraId}
                            onChange={(e) => setMuestraId(e.target.value)}
                        />

                    </div>

                    <div className="field">

                        <label>Clasificación preliminar</label>
                        <input
                            type="text"
                            value={clasificacion}
                            onChange={(e) => setClasificacion(e.target.value)}
                            placeholder="Ej: Arcilla arenosa"
                        />

                    </div>

                    <div className="field">

                        <label>Tipo de Proctor</label>
                        <select
                            value={tipoProctor}
                            onChange={(e) => setTipoProctor(e.target.value as TipoProctor)}
                        >
                            <option value="">Seleccione...</option>
                            <option value="Normal">Normal</option>
                            <option value="Modificado">Modificado</option>
                        </select>

                    </div>

                    <div className="field">

                        <label>Norma</label>
                        <select
                            value={norma}
                            onChange={(e) => setNorma(e.target.value as NormaProctor)}
                        >
                            <option value="">Seleccione...</option>
                            <option value="IRAM">IRAM</option>
                            <option value="ASTM">ASTM</option>
                        </select>
                    </div>

                    <div className="field">

                        <label>Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />

                    </div>

                    <div className="field">

                        <label>Hora</label>
                        <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        />

                    </div>
                </div>

                <div className="field">

                    <label>Observaciones</label>
                    <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />

                </div>
            </section>

            {/*DATOS DEL EQUIPO */}
            <section className="proctor-section">

                <h3>Datos del equipo Proctor</h3>

                <div className="proctor-grid">

                    <div className="field">

                        <label>Peso del molde vacío (g)</label>
                        <input
                            type="number"
                            value={pesoMolde}
                            onChange={(e) => setPesoMolde(e.target.value)}
                        />

                    </div>

                    <div className="field">

                        <label>Diámetro del molde (mm)</label>
                        <input
                            type="number"
                            value={diametroMolde}
                            onChange={(e) => setDiametroMolde(e.target.value)}
                            placeholder="Ej: 102"
                        />

                    </div>

                    <div className="field">

                        <label>Altura del molde (mm)</label>
                        <input
                            type="number"
                            value={alturaMolde}
                            onChange={(e) => setAlturaMolde(e.target.value)}
                            placeholder="Ej: 116"
                        />
                    </div>

                    <div className="field">

                        <label>Volumen del molde (cm³)</label>
                        <input
                            type="number"
                            value={volumenMolde}
                            readOnly
                        />

                    </div>

                    <div className="field">

                        <label>Peso del pisón (kg)</label>
                        <input
                            type="number"
                            value={pesoPison}
                            onChange={(e) => setPesoPison(e.target.value)}
                            placeholder="Ej: 2.5 o 4.5"
                        />
                    </div>

                    <div className="field">

                        <label>Altura de caída (mm)</label>
                        <input
                            type="number"
                            value={alturaCaida}
                            onChange={(e) => setAlturaCaida(e.target.value)}
                            placeholder="Ej: 305 o 457"
                        />

                    </div>

                </div>

            </section>

            <section className="proctor-section">

                <h3>Puntos del ensayo</h3>

                <small>Cargue un punto y guárdelo en la lista</small>

                <div className="punto-card">

                    <div className="proctor-grid">

                        <div className="field">

                            <label>Modo de humedad</label>
                            <select 
                                value={modoHumedad} 
                                onChange={(e) => setModoHumedad(e.target.value)}
                            >
                                <option value="manual">Manual</option>
                                <option value="calcular">Calcular</option>
                            </select>
                        
                        </div>

                        {modoHumedad === "calcular" && (
                            <>
                                <div className="field">

                                    <label>Peso húmedo (g)</label>
                                    <input type="number" value={pesoHumedoP} onChange={(e) => setPesoHumedoP(e.target.value)} />
                                
                                </div>

                                <div className="field">

                                    <label>Peso seco (g)</label>
                                    <input type="number" value={pesoSecoP} onChange={(e) => setPesoSecoP(e.target.value)} />
                                
                                </div>
                            </>
                        )}

                        {modoHumedad === "manual" && (
                            <div className="field">
    
                                <label>Humedad (%)</label>
                                <input type="number" value={humedad} onChange={(e) => setHumedad(e.target.value)} />

                            </div>
                        )}

                        <div className="field">

                            <label>Peso molde + suelo (g)</label>
                            <input
                                type="number"
                                value={moldeMasSuelo}
                                onChange={(e) => setMoldeMasSuelo(e.target.value)}
                                placeholder="Ej: 820.4"
                            />

                        </div>

                        <div className="field">

                            <label>Número de golpes</label>
                            <input
                                type="number"
                                value={golpes}
                                onChange={(e) => setGolpes(e.target.value)}
                                placeholder="25"
                            />

                        </div>

                        <div className="field">

                            <label>Observaciones (opcional)</label>
                            <input
                                type="text"
                                value={obsPunto}
                                onChange={(e) => setObsPunto(e.target.value)}
                                placeholder="Ligeramente húmedo"
                            />

                        </div>

                        <div className="field">

                            <label>Peso de suelo (g)</label>
                            <input 
                                type="number" 
                                value={pesoSuelo} 
                                readOnly 
                            />

                        </div>

                        <div className="field">

                            <label>Densidad húmeda (g/cm³)</label>
                            <input 
                                type="number" 
                                value={densidadHumeda} 
                                readOnly 
                            />

                        </div>

                        <div className="field">

                            <label>Densidad seca (g/cm³)</label>
                            <input 
                                type="number" 
                                value={densidadSeca} 
                                readOnly 
                            />

                        </div>

                    </div>

                    <div className="punto-buttons">

                        <button 
                            className="btn-calcular" 
                            onClick={calcularPunto}>
                                Calcular punto
                        </button>

                        <button 
                            className="btn-guardar"
                            disabled={densidadSeca === 0}
                            onClick={guardarPunto}
                        >
                            Guardar punto
                        </button>

                    </div>

                </div>

            </section>

            {puntos.length > 0 && (

                <div className="tabla-puntos-container">

                    <h4>Puntos cargados</h4>

                    <table className="tabla-puntos">
                        <thead>
                            <tr>
                                <th>Humedad (%)</th>
                                <th>P. Suelo (g)</th>
                                <th>D. Húmeda (g/cm³)</th>
                                <th>D. Seca (g/cm³)</th>
                                <th>Golpes</th>
                                <th>Obs.</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {puntos
                                .sort((a, b) => a.humedad - b.humedad)
                                .map((p, index) => (
                                    <tr
                                        key={index}
                                        className={p.densidadSeca === maxDensidadSeca ? "fila-max" : ""}
                                    >
                                        <td>{p.humedad}</td>
                                        <td>{p.pesoSuelo}</td>
                                        <td>{p.densidadHumeda}</td>
                                        <td>{p.densidadSeca}</td>
                                        <td>{p.golpes}</td>
                                        <td>{p.observaciones || "-"}</td>
                                        <td>
                                            <button
                                                className="btn-eliminar-punto"
                                                onClick={() => eliminarPunto(index)}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {puntos.length > 0 && (
                <div style={{ marginTop: "2rem" }}>

                    <h3 style={{ color: "#64FFDA", marginBottom: ".5rem" }}>Curva Proctor</h3>

                    <div className="proctor-chart-wrapper">
                        <ProctorChart data={puntos.map(p => ({ humedad: p.humedad, densidadSeca: p.densidadSeca }))} />
                    </div>

                    <div className="resumen-proctor">
                        <p><strong>Humedad Óptima:</strong> {maxDensidadSeca ? 
                            puntos.find(p => p.densidadSeca === maxDensidadSeca)?.humedad.toFixed(2) + " %" 
                            : "-"}
                        </p>
                        <p><strong>Densidad Máxima Seca:</strong> {maxDensidadSeca ? 
                            maxDensidadSeca.toFixed(3) + " g/cm³"
                            : "-"}
                        </p>
                    </div>

                    <button 
                        className="btn-calcular" 
                        style={{ marginTop: "1.5rem" }}
                        onClick={() => setModalOpen(true)}
                    >
                        Vista preliminar de informe
                    </button>

                    <ModalPreviewProctor 
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        puntos={puntos}
                        obra={obra}
                        muestraId={muestraId}
                        clasificacion={clasificacion}
                        tipoProctor={tipoProctor}
                        norma={norma}
                        fecha={fecha}
                        hora={hora}
                        observaciones={observaciones}
                        equipo={{
                            pesoMolde,
                            diametroMolde,
                            alturaMolde,
                            volumenMolde,
                            pesoPison,
                            alturaCaida
                            }}
                    />

                </div>
            )}

        </div>
    );
};

export default Proctor;