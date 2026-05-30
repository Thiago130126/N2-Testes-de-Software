import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as userService from '../user.service.js';
import bcrypt from 'bcryptjs';

describe('User Service - Obter Perfil (getProfile)', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve lançar erro se o usuário não for encontrado', async () => {
        const data = { username: 'usuario_fantasma' };
        
        mockUserModel.findOne.mockResolvedValueOnce(null);

        await expect(userService.getProfile(data, mockUserModel))
            .rejects
            .toThrow('Usuário não encontrado');
    });

    it('Green - Deve retornar os dados do perfil com sucesso', async () => {
        const data = { username: 'aluno_teste' };
        
        const usuarioSimulado = {
            id: 1,
            username: 'aluno_teste',
            email: 'aluno@teste.com',
            first_name: 'Aluno',
            last_name: 'Teste'
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.getProfile(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.username).toBe('aluno_teste');
        expect(result.email).toBe('aluno@teste.com');
    });
});

describe('User Service - Atualizar Perfil (updateProfile)', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn(),
            update: vi.fn()
        };
    });

    it('Red - Deve lançar erro se o usuário atual não for encontrado', async () => {
        const data = { usuarioId: 999 };
        
        mockUserModel.findOne.mockResolvedValueOnce(null);

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('Usuário não encontrado');
    });

    it('Red - Deve lançar erro se a data de nascimento for uma string inválida', async () => {
        const data = { usuarioId: 1, data_nascimento: 'data_maluca' };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('Data de nascimento inválida');
    });

    it('Red - Deve lançar erro se a data de nascimento for no futuro', async () => {
        const data = { usuarioId: 1, data_nascimento: '3000-01-01' }; // Ano 3000
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('A data de nascimento não pode estar no futuro');
    });

    it('Red - Deve lançar erro se o novo nome de usuário já estiver em uso', async () => {
        const data = { usuarioId: 1, username: 'usuario_ninja' };
        
        // 1ª Chamada: Acha o usuário atual
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1, username: 'usuario_antigo' });
        // 2ª Chamada: Procura pelo novo username e descobre que alguém já usa (retorna um objeto)
        mockUserModel.findOne.mockResolvedValueOnce({ id: 2, username: 'usuario_ninja' });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('Nome de usuário já em uso');
    });

    it('Red - Deve lançar erro se o novo email já estiver em uso', async () => {
        const data = { usuarioId: 1, email: 'novo@email.com' };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1, email: 'antigo@email.com' });
        mockUserModel.findOne.mockResolvedValueOnce({ id: 2, email: 'novo@email.com' });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('Email já em uso');
    });

    it('Red - Deve lançar erro se a nova senha tiver menos de 6 caracteres', async () => {
        const data = { usuarioId: 1, password: '123' };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('A senha precisa ter pelo menos 6 caracteres');
    });

    it('Red - Deve lançar erro se a nova senha for igual à senha atual', async () => {
        const salt = await bcrypt.genSalt(10);
        const senhaAntigaHash = await bcrypt.hash('senha_secreta', salt);
        
        const data = { usuarioId: 1, password: 'senha_secreta' };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1, senha: senhaAntigaHash });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('A senha precisa ser diferente da anterior');
    });

    it('Red - Deve lançar erro se a nova senha e a confirmação não baterem', async () => {
        const salt = await bcrypt.genSalt(10);
        const senhaAntigaHash = await bcrypt.hash('senha_velha', salt);
        
        const data = { 
            usuarioId: 1, 
            password: 'senha_nova_123',
            confirmPassword: 'senha_diferente' 
        };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1, senha: senhaAntigaHash });

        await expect(userService.updateProfile(data, mockUserModel))
            .rejects
            .toThrow('As senhas não coincidem');
    });

    it('Green - Deve atualizar os dados básicos com sucesso e chamar model.update', async () => {
        const data = { 
            usuarioId: 1, 
            first_name: 'Novo', 
            last_name: 'Nome' 
        };
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });
        mockUserModel.update.mockResolvedValueOnce([1]); // Simula o Sequelize atualizando 1 linha

        const result = await userService.updateProfile(data, mockUserModel);

        expect(result).toHaveProperty('first_name', 'Novo');
        expect(result).toHaveProperty('last_name', 'Nome');
        expect(mockUserModel.update).toHaveBeenCalledTimes(1);
    });

    it('Green - Deve retornar um objeto vazio e não chamar model.update se não houver dados', async () => {
        const data = { usuarioId: 1 }; // Nenhum campo enviado
        
        mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

        const result = await userService.updateProfile(data, mockUserModel);

        expect(Object.keys(result).length).toBe(0);
        expect(mockUserModel.update).not.toHaveBeenCalled();
    });
});