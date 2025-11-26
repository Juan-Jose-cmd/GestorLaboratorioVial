import { useState, useEffect } from "react";
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
    const [pesoSuelo, setPesoSuelo] = useState('');
    const [densidadHumeda, setDensidadHumeda] = useState('');
    const [densidadSeca, setDesidadSeca] = useState('');

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
            
        </div>
    );
};

export default Proctor;