import EnsayosSuelo from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/EnsayosSuelo";
import Clasificacion from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/Clasificacion/Clasificacion";
import Densidad from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/Desidad/Densidad";
import Humedad from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/Humedad/Humedad";
import Proctor from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/Proctor/Proctor";
import Vsr from "../../views/pages/Laboratorista/TiposDeEnsayos/Suelo/Vsr/Vsr";

export const SueloRoutes = [
    { path: "/laboratorista/suelo", element: <EnsayosSuelo /> },
    { path: "/laboratorista/suelo/clasificacion", element: <Clasificacion /> },
    { path: "/laboratorista/suelo/densidad", element: <Densidad /> },
    { path: "/laboratorista/suelo/humedad", element: <Humedad /> },
    { path: "/laboratorista/suelo/proctor", element: <Proctor /> },
    { path: "/laboratorista/suelo/vsr", element: <Vsr /> },
];