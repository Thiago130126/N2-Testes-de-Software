import { Router } from 'express';
import * as healthController from '../modules/health/health.controller.js';

const router = Router();

router.get('/', healthController.checkHealth);

export default router;