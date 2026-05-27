import express from 'express';
const router = express.Router();

// controller
import * as profControll from '../modules/professor/professor.controller.js';

router.get('/register-professor', (req, res) => {
    return res.render('professor/register');
});


export default router;