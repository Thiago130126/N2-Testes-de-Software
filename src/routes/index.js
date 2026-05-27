import express from 'express';

// 1. Cria o roteador isolado
const router = express.Router();

// 2. Define a sua rota usando o 'router' no lugar do 'app'
router.get('/', (req, res) => {
    res.render('index', { title: 'EduStream-TDD' });
});

// 3. Exporta o roteador para que o app.js possa consumi-lo
export default router;