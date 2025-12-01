import { useState } from "react";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/NavBar/NavBar";

const Register = () => {

    const [rol, setRol] = useState<"laboratorista" | "director" | "inspector" | "">("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Rol elegido:", rol);
    };

    return(
        <>
            <NavBar />
            <div>
                <form onSubmit={handleSubmit}>

                    <label>Seleccione su rol</label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value as any)}
                        required
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="laboratorista">Laboratorista</option>
                        <option value="director">Director de obra</option>
                        <option value="inspector">Inspector</option>
                    </select>

                    <button type="submit">Registrarme</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Register;