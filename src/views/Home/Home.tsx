import { useNavigate } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar";
import styles from './Home.module.css';
import Footer from '../../components/footer/Footer';

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <main className={styles.main}>
        
        <section className={styles.hero}>
          <h1>Gestioná tus ensayos viales</h1>

          <p className={styles.subtitle}>
            "Un sistema moderno para automatizar pedidos, cargar resultados y administrar ensayos de Suelo, Asfalto y Hormigón."
          </p>

          <div className={styles.actions}>
            <button onClick={() => navigate('/login')}>
              Ingresar
            </button>
            <button onClick={() => navigate('/register')}>
              Registrarme
            </button>
          </div>
        </section>

        <section className={styles.benefits}>
          <h2>¿Por qué usar nuestro sistema?</h2>

          <div className={styles.cards}>
            <div className={styles.card}>🔎 Precisión en el seguimiento de ensayos</div>
            <div className={styles.card}>⚙️ Automatización de procesos</div>
            <div className={styles.card}>📊 Tableros claros y reportes</div>
            <div className={styles.card}>📁 Historial completo de solicitudes</div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default Home;