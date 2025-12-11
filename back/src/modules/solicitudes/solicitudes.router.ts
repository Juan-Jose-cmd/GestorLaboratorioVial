import { Router } from "express";
import { SolicitudController } from "./solicitudes.controller";
import { SolicitudService } from "./solicitud.service";
import { roleMiddleware } from "../../core/middleware/role.middleware";
import { authMiddleware } from "../../core/middleware/auth.middleware";

const solicitudService = new SolicitudService();
const solicitudController = new SolicitudController(solicitudService);

const solicitudesRouter = Router();

solicitudesRouter.use(authMiddleware);

solicitudesRouter.get(
    '/',
    roleMiddleware(['jerarquico', 'director', 'laboratorista']),
    solicitudController.getAllSolicitudes.bind(solicitudController)
); 

solicitudesRouter.get(
    '/:id',
    roleMiddleware(['jerarquico', 'director', 'laboratorista']),
    solicitudController.getSolicitudById.bind(solicitudController)
);

solicitudesRouter.get(
    '/obra/:obraId',
    roleMiddleware(['jerarquico', 'director', 'laboratorista']),
    solicitudController.getSolicitudesByObra.bind(solicitudController)
);

solicitudesRouter.get(
    '/usuario/:usuarioId',
    roleMiddleware(['jerarquico', 'director']),
    solicitudController.getSolicitudesByUsuario.bind(solicitudController)
);

solicitudesRouter.get(
    '/estado/:estado',
    roleMiddleware(['jerarquico', 'director', 'laboratorista']),
    solicitudController.getSolicitudesByEstado.bind(solicitudController)
);

solicitudesRouter.post(
    '/',
    roleMiddleware(['jerarquico', 'director']),
    solicitudController.createSolicitud.bind(solicitudController)
);

solicitudesRouter.put(
    '/:id',
    roleMiddleware(['jerarquico', 'director']),
    solicitudController.updateSolicitud.bind(solicitudController)
);

solicitudesRouter.patch(
    '/:id/estado',
    roleMiddleware(['laboratorista', 'jerarquico']),
    solicitudController.updateEstado.bind(solicitudController)
);

solicitudesRouter.patch(
    '/:id/prioridad',
    roleMiddleware(['jerarquico']), // Solo jerárquico
    solicitudController.updatePrioridad.bind(solicitudController)
);

solicitudesRouter.patch(
    '/:id/aceptar',
    roleMiddleware(['laboratorista']),
    solicitudController.aceptarSolicitud.bind(solicitudController)
);

solicitudesRouter.delete(
    '/:id',
    roleMiddleware(['jerarquico', 'director']),
    solicitudController.deleteSolicitud.bind(solicitudController)
);

export default solicitudesRouter;

