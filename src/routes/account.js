import express from 'express';
import professorRouter from './professor.js';

// 1. Cria o roteador isolado
const router = express.Router();

// contollers
import * as userControll from '../modules/user/user.controller.js';
import { admAuth } from '../middlewares/authMidd.js';

// Middlewares
import * as authMidd from '../middlewares/authMidd.js';

router.get('/register', (req, res) => {
    res.render('account/register', { title: 'EduStream-TDD' });
});

router.post('/register', userControll.registerUser);

router.get('/login', (req, res) => {
    res.render('account/login', { title: 'EduStream-TDD' });
});

router.post('/login', userControll.loginUser);

router.get('/logout', userControll.logout);

router.get('/profile', authMidd.userAuth, userControll.getProfileUser);


router.use('/professor', professorRouter);

export default router;