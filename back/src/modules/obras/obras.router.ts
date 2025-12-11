import { Router } from "express";
import { ObraController } from "./obras.controller";
import { ObraService } from "./obra.service";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { roleMiddleware } from "../../core/middleware/role.middleware";

const obraService = new ObraService();
const obraController = new ObraController(obraService);

const obrasRouter = Router();

obrasRouter.use(authMiddleware);

obrasRouter.get('/', obraController.getAllWorks.bind(obraController));

obrasRouter.get('/director/:directorId', obraController.getWorksByDirector.bind(obraController));

obrasRouter.get('/:id', obraController.getWorkById.bind(obraController));

obrasRouter.post(
    '/',
    roleMiddleware(['jerarquico']),
    obraController.createWork.bind(obraController)
);

obrasRouter.put(
    '/:id',
    roleMiddleware(['jerarquico', 'director']),
    obraController.updateWork.bind(obraController)
);

obrasRouter.patch(
    '/:id/estado',
    roleMiddleware(['jerarquico', 'director']),
    obraController.changeWorkStatus.bind(obraController)
);

obrasRouter.delete(
    '/:id',
    roleMiddleware(['jerarquico']),
    obraController.deleteWork.bind(obraController)
);

export default obrasRouter;