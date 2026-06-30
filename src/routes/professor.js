import express from 'express';
const router = express.Router();

// controller
import * as profControll from '../modules/professor/professor.controller.js';

// middlewares
import * as csrfMidd from '../middlewares/anti-csrf.js';
import {uploadDiploma} from '../middlewares/multer.js';
import * as authMidd from '../middlewares/authMidd.js';

router.get('/', authMidd.professorAuth, (req, res) => {
    return res.render('professor/index');
});

router.get('/register-professor', csrfMidd.Maestro_CSRF, (req, res) => {
    return res.render('professor/register');
});

router.post('/register-professor', uploadDiploma.single('diploma'), csrfMidd.Maestro_CSRF, profControll.registerProfessor);

router.get('/profile', csrfMidd.Maestro_CSRF, authMidd.professorAuth, profControll.getProfileProfessor);

export default router;