import express from 'express';
import professorRouter from './professor.js';

// 1. Cria o roteador isolado
const router = express.Router();

// contollers
import * as userControll from '../modules/user/user.controller.js';
import { admAuth } from '../middlewares/authMidd.js';

// Middlewares
import * as authMidd from '../middlewares/authMidd.js';
import * as csrfMidd from '../middlewares/anti-csrf.js';

router.get('/register', csrfMidd.Maestro_CSRF, (req, res) => {
    res.render('account/register', { title: 'EduStream-TDD' });
});

router.post('/register', csrfMidd.Maestro_CSRF, userControll.registerUser);

router.get('/login', csrfMidd.Maestro_CSRF, (req, res) => {
    res.render('account/login', { title: 'EduStream-TDD' });
});

router.post('/login', csrfMidd.Maestro_CSRF, userControll.loginUser);

router.get('/logout', userControll.logout);

router.get('/profile', csrfMidd.Maestro_CSRF, authMidd.userAuth, userControll.getProfileUser);

router.post('/profile', csrfMidd.Maestro_CSRF, authMidd.userAuth, userControll.updateProfileUser);


// rotas do professor dentro de account

router.use('/professor', professorRouter);

export default router;