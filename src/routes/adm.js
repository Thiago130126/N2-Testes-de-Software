import express from 'express';

// 1. Cria o roteador isolado
const router = express.Router();

// contollers
import * as admControll from '../modules/adm/adm.controller.js';

// middlewares
import { admAuth } from '../middlewares/authMidd.js';


router.get('/', admAuth, admControll.dashboardAdm);

export default router;