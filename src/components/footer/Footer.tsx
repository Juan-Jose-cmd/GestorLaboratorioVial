import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} Juan Jose Peryra — Todos los derechos reservados.</p>
            <span className={styles.made}>Desarrollado por Juan Jose Pereyra</span>
        </footer>
    )
}

export default Footer;