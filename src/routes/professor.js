import express from 'express';
const router = express.Router();

// controller
import * as profControll from '../modules/professor/professor.controller.js';

// middlewares
import * as csrfMidd from '../middlewares/anti-csrf.js';

router.get('/', (req, res) => {
    return res.render('professor/index');
})

router.get('/register-professor', csrfMidd.Maestro_CSRF, (req, res) => {
    return res.render('professor/register');
});

router.get('/profile', csrfMidd.Maestro_CSRF, profControll.getProfileProfessor);

export default router;