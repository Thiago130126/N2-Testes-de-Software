import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as cursoService from '../curso.service.js';

describe('Curso Service - Cadastro de Novo Curso', () => {
    let mockCursoModel;

    beforeEach(() => {
        mockCursoModel = {
            findOne: vi.fn(),
            create: vi.fn()
        };
    });

    it('1. Deve lançar erro se faltar o nome', async () => {
        const data = { body: { descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Preencha todos os dados');
    });

    it('2. Deve lançar erro se faltar a descrição', async () => {
        const data = { body: { nome: 'Curso', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Preencha todos os dados');
    });

    it('3. Deve lançar erro se faltar quantidade de aulas', async () => {
        const data = { body: { nome: 'Curso', descricao: 'Desc', materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Preencha todos os dados');
    });

    it('4. Deve lançar erro se faltar matéria', async () => {
        const data = { body: { nome: 'Curso', descricao: 'Desc', qtde_aulas: 10, thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Preencha todos os dados');
    });

    it('5. Deve lançar erro se faltar thumbnail', async () => {
        const data = { body: { nome: 'Curso', descricao: 'Desc', qtde_aulas: 10, materia: 'TI' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Preencha todos os dados');
    });

    it('6. Deve lançar erro se não houver ID do professor', async () => {
        const data = { body: { nome: 'Curso TDD', descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' } };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Professor não encontrado');
    });

    it('7. Deve lançar erro se o nome tiver menos de 5 caracteres', async () => {
        const data = { body: { nome: 'Vue', descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('pelo menos 5 caracteres');
    });

    it('8. Deve lançar erro se a quantidade de aulas for negativa', async () => {
        const data = { body: { nome: 'Curso de React', descricao: 'Desc', qtde_aulas: -7, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('A quantidade de aulas deve ser maior que zero');
    });

    it('9. Deve lançar erro se o nome do curso já existir', async () => {
        const data = { body: { nome: 'Curso de Node', descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        mockCursoModel.findOne.mockResolvedValueOnce({ id: 99, nome: 'Curso de Node' });
        await expect(cursoService.novoCurso(data, mockCursoModel)).rejects.toThrow('Já existe um curso');
    });

    it('10. Deve criar o curso com sucesso se todos os dados forem válidos', async () => {
        const data = { body: { nome: 'Curso de Django', descricao: 'Desc', qtde_aulas: 10, materia: 'TI', thumbnail: 'img.png' }, id: 1 };
        mockCursoModel.findOne.mockResolvedValueOnce(null);
        mockCursoModel.create.mockResolvedValueOnce({ id: 50, ...data.body });
        
        const result = await cursoService.novoCurso(data, mockCursoModel);
        expect(result).toHaveProperty('id', 50);
        expect(mockCursoModel.create).toHaveBeenCalledTimes(1);
    });
});