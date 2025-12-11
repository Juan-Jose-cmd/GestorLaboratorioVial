import { Router } from "express";
import userRouter from "../modules/users/users.routes";
import solicitudesRouter from "../modules/solicitudes/solicitudes.router";
import obrasRouter from "../modules/obras/obras.router";
import informesRouter from "../modules/informes/informes.router";
import equiposRouter from "../modules/equipos/equipos.router";
import ensayosRouter from "../modules/ensayos/ensayos.router";

const router = Router();

router.use('/users', userRouter);

router.use('/solicitudes', solicitudesRouter);

router.use('/obras', obrasRouter);

router.use('/informes', informesRouter);

router.use('/equipos', equiposRouter);

router.use('/ensayos', ensayosRouter);

export default router;