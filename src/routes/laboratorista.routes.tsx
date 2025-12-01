import LabHome from "../views/pages/Laboratorista/LabHome";

import { SueloRoutes } from "./Lab-SueloRouter/suelo.routes";
import { AsfaltoRoutes } from "./Lab-AsfaltoRouter/asfalto.routes";
import { HormigonRoutes } from "./Lab-HormigonRouter/hormigon.routes";

export const LaboratoristaRoutes = [
    { path: '/laboratorista', element: <LabHome />},
    ...SueloRoutes,
    ...AsfaltoRoutes,
    ...HormigonRoutes
];

