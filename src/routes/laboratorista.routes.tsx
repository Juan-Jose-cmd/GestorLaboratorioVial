import LabHome from "../pages/Laboratorista/LabHome";
import EnsayosSuelo from "../pages/Laboratorista/TiposDeEnsayos/Suelo/EnsayosSuelo";
import Clasificacion from "../pages/Laboratorista/TiposDeEnsayos/Suelo/Clasificacion/Clasificacion";
import Densidad from "../pages/Laboratorista/TiposDeEnsayos/Suelo/Desidad/Densidad";
import Humedad from "../pages/Laboratorista/TiposDeEnsayos/Suelo/Humedad/Humedad";
import Proctor from "../pages/Laboratorista/TiposDeEnsayos/Suelo/Proctor/Proctor";
import Vsr from "../pages/Laboratorista/TiposDeEnsayos/Suelo/Vsr/Vsr";
import EnsayosAsfalto from "../pages/Laboratorista/TiposDeEnsayos/Asfalto/EnsayosAsfalto";
import EnsayosHormigon from '../pages/Laboratorista/TiposDeEnsayos/Hormigon/EnsayosHormigon'

export const LaboratoristaRoutes = [
    { path: "/laboratorista", element: <LabHome /> },
    { path: "/laboratorista/suelo", element: <EnsayosSuelo /> },
    { path: "/laboratorista/suelo/clasificacion", element: <Clasificacion /> },
    { path: "/laboratorista/suelo/densidad", element: <Densidad /> },
    { path: "/laboratorista/suelo/humedad", element: <Humedad /> },
    { path: "/laboratorista/suelo/proctor", element: <Proctor /> },
    { path: "/laboratorista/suelo/vsr", element: <Vsr /> },

    { path: "/laboratorista/asfalto", element: <EnsayosAsfalto /> },

    { path: "/laboratorista/hormigon", element: <EnsayosHormigon /> },
];

