import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import collectionsRouter from "./collections";
import homeRouter from "./home";
import testimonialsRouter from "./testimonials";
import leadsRouter from "./leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(collectionsRouter);
router.use(homeRouter);
router.use(testimonialsRouter);
router.use(leadsRouter);

export default router;
