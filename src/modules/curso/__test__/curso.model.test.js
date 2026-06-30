import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import * as cursoController from '../curso.controller.js';
import * as cursoService from '../curso.service.js';

// Mockamos o Service para ele não acessar o banco
vi.mock('../curso.service.js');

// Criamos um app Express falso apenas para os testes HTTP
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use(flash());

// Middleware para simular um professor logado antes de chegar na rota
app.use((req, res, next) => {
    req.session.usuarioLogado = { id: 1, first_name: 'Professor Teste' };
    next();
});

// A rota real que aciona o controller
app.post('/cursos/novo', cursoController.novoCurso);

describe('Curso Controller - Integração Supertest', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('1. HTTP - Deve retornar Status 302 (Redirect) após criar com sucesso', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        const res = await request(app).post('/cursos/novo').send({ nome: 'Curso Valido', descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' });
        expect(res.status).toBe(302);
    });

    it('2. HTTP - Deve redirecionar para /account/professor em caso de sucesso', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        const res = await request(app).post('/cursos/novo').send({ nome: 'Curso Valido' });
        expect(res.header.location).toBe('/account/professor');
    });

    it('3. HTTP - Deve chamar o cursoService exatamente uma vez na requisição', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        await request(app).post('/cursos/novo').send({ nome: 'Curso Valido' });
        expect(cursoService.novoCurso).toHaveBeenCalledTimes(1);
    });

    it('4. HTTP - Deve retornar Status 302 (Redirect) mesmo se houver erro (Catch)', async () => {
        cursoService.novoCurso.mockRejectedValueOnce(new Error('Erro forçado'));
        const res = await request(app).post('/cursos/novo').send({});
        expect(res.status).toBe(302);
    });

    it('5. HTTP - Deve redirecionar para /account/professor em caso de erro', async () => {
        cursoService.novoCurso.mockRejectedValueOnce(new Error('Erro forçado'));
        const res = await request(app).post('/cursos/novo').send({});
        expect(res.header.location).toBe('/account/professor');
    });

    it('6. HTTP - Deve passar os dados do body corretamente para o Service', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        const payload = { nome: 'Curso Node', descricao: 'API', qtde_aulas: 5, materia: 'Prog', thumbnail: 'x.png' };
        
        await request(app).post('/cursos/novo').send(payload);
        
        const chamada = cursoService.novoCurso.mock.calls[0][0];
        expect(chamada.body.nome).toBe('Curso Node');
    });

    it('7. HTTP - Deve injetar o ID do usuário da sessão no objeto data', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        
        await request(app).post('/cursos/novo').send({ nome: 'Teste' });
        
        const chamada = cursoService.novoCurso.mock.calls[0][0];
        expect(chamada.id).toBe(1); // O ID 1 que mockamos no middleware
    });

    it('8. HTTP - Não deve quebrar o servidor se enviar payload vazio', async () => {
        cursoService.novoCurso.mockRejectedValueOnce(new Error('Dados em branco'));
        const res = await request(app).post('/cursos/novo').send();
        expect(res.status).toBe(302); // Confirma que o try/catch segurou o erro
    });

    it('9. HTTP - Deve lidar com erros gerados pelo Sequelize (banco fora do ar)', async () => {
        cursoService.novoCurso.mockRejectedValueOnce(new Error('SequelizeConnectionError'));
        const res = await request(app).post('/cursos/novo').send({ nome: 'Teste' });
        expect(res.header.location).toBe('/account/professor');
    });

    it('10. HTTP - Deve confirmar que o fluxo encerra rapidamente (performance)', async () => {
        cursoService.novoCurso.mockResolvedValueOnce({ id: 1 });
        const start = Date.now();
        await request(app).post('/cursos/novo').send({ nome: 'Rápido' });
        const tempo = Date.now() - start;
        expect(tempo).toBeLessThan(100); // Garante que a rota não está presa num loop
    });
});