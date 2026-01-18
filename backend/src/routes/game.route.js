import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";

const router = Router();

router.post("/finish", GameController.finishGame);

export default router;
