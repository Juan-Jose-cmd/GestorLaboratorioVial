import Footer from "../../components/footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import styles from './Login.module.css';

const Login = () => {
    return(
        <>
        <NavBar />
        <div className={styles.container}>
            <form className={styles.form}>
                <label>Ingrese su email</label>
                <input type="e-mail" required/>

                <label>Ingrese su contrseña</label>
                <input type="password" required/>

                <button>
                    Ingresar
                </button>
            </form>
        </div>
        <Footer />
        </>
    )
}

export default Login;