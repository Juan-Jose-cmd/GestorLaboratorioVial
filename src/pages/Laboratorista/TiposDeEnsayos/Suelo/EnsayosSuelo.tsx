import { useNavigate } from 'react-router-dom';
import './EnsayosSuelo.css';

const TiposDeEnsayos = () => {

    const navigate = useNavigate();

    return(
        <div className='container-LabHome'>
            <div className='select-container-Ensayos'>

                <div>
                    <h2 className='title-LabHome'>Seleccione el tipo de ensayo de suelo</h2>
                </div>

                <div className='container-button-Ensayos'>
                    <button className='btn-Ensayos' onClick={() => navigate('/laboratorista/suelo/clasificacion')}>
                        Clasificacion
                    </button>

                    <button className='btn-Ensayos' onClick={() => navigate('/laboratorista/suelo/densidad')}>
                        Densidad in situ
                    </button>

                    <button className='btn-Ensayos' onClick={() => navigate('/laboratorista/suelo/humedad')}>
                        Humedad
                    </button>

                    <button className='btn-Ensayos' onClick={() => navigate('/laboratorista/suelo/proctor')}>
                        Proctor
                    </button>

                    <button className='btn-Ensayos' onClick={() => navigate('/laboratorista/suelo/vsr')}>
                        Vsr
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TiposDeEnsayos;