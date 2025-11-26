import './Proctor.css';

interface EnsayoProctor {
    obra: string;
    muestraId: string;
    clasificacion: string;
    tipoProctor: 'Normal | Modificado';
    norma: 'IRAM | ASTM';
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
    return <h2>Proctor</h2>;
};

export default Proctor;