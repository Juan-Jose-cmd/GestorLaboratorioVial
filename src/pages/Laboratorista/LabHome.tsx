import { useNavigate } from 'react-router-dom';
import './LabHome.css';

const LabHome = () => {

    const navigate = useNavigate();

    return (
        <div className='container-LabHome'>

            <div className='select-container-LabHome'>
                <div>
                    <h2 className='title-LabHome'>Seleccione el tipo de material</h2>
                </div>

                <div className='container-button-LabHome'>
                    <button className='btn-LabHome' onClick={() => navigate('/laboratorista/suelo')}>
                        Suelo
                    </button>

                    <button className='btn-LabHome' onClick={() => navigate('/laboratorista/asfalto')}>
                        Asfalto
                    </button>

                    <button className='btn-LabHome' onClick={() => navigate('/laboratorista/hormigon')}>
                        Hormigon
                    </button>
                </div>
                
            </div>

        </div>
    );
};

export default LabHome;