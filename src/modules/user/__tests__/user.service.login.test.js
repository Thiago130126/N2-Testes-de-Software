import { describe, it, expect, beforeEach } from 'vitest';
import * as userService from '../user.service.js';
import bcrypt from 'bcryptjs';

describe('User Service - Login de usuário por Email', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve retornar null se o email não for encontrado', async () => {
        const data = {
            email_ou_username: 'nao_existe@test.com',
            senha: 'senha123'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        const result = await userService.loginUserEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_errada'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        });

        const result = await userService.loginUserEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a conta estiver desativada', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: false 
        });

        const result = await userService.loginUserEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Green - Deve retornar o usuário com sucesso', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        const usuarioSimulado = {
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.loginUserEmail(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.email).toBe('aluno@test.com');
    });
});

describe('User Service - Login de usuário por Username', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve retornar null se o username não for encontrado', async () => {
        const data = {
            email_ou_username: 'nao_existe@test.com',
            senha: 'senha123'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        const result = await userService.loginUserUserName(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_errada'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            username: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        });

        const result = await userService.loginUserUserName(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a conta estiver desativada', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            username: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: false
        });

        const result = await userService.loginUserUserName(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Green - Deve retornar o usuário com sucesso', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        const usuarioSimulado = {
            id: 1,
            username: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.loginUserUserName(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.username).toBe('aluno@test.com');
    });
});

describe('User Service - Login de professor por Username', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve retornar null se o username não for encontrado', async () => {
        const data = {
            email_ou_username: 'nao_existe@test.com',
            senha: 'senha123'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        const result = await userService.loginProfessorUsername(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_errada'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            username: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        });

        const result = await userService.loginProfessorUsername(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a conta estiver desativada', async () => {
        const data = {
            email_ou_username: 'aluno',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            username: 'aluno',
            senha: senhaCorretaHash,
            ativo: false
        });

        const result = await userService.loginProfessorUsername(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Green - Deve retornar o usuário com sucesso', async () => {
        const data = {
            email_ou_username: 'aluno',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        const usuarioSimulado = {
            id: 1,
            username: 'aluno',
            senha: senhaCorretaHash,
            ativo: true
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.loginProfessorUsername(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.username).toBe('aluno');
    });
});

describe('User Service - Login de professor por Email', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve retornar null se o email não for encontrado', async () => {
        const data = {
            email_ou_username: 'nao_existe@test.com',
            senha: 'senha123'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        const result = await userService.loginProfessorEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_errada'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        });

        const result = await userService.loginProfessorEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a conta estiver desativada', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: false
        });

        const result = await userService.loginProfessorEmail(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Green - Deve retornar o usuário com sucesso', async () => {
        const data = {
            email_ou_username: 'aluno@test.com',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        const usuarioSimulado = {
            id: 1,
            email: 'aluno@test.com',
            senha: senhaCorretaHash,
            ativo: true
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.loginProfessorEmail(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.email).toBe('aluno@test.com');
    });
});

describe('User Service - Login de professor por CPF', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn()
        };
    });

    it('Red - Deve retornar null se o CPF não for encontrado', async () => {
        const data = {
            email_ou_username: '123456789',
            senha: 'senha123'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        const result = await userService.loginProfessorCPF(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: '123456789',
            senha: 'senha_errada'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            cpf: '123456789',
            senha: senhaCorretaHash,
            ativo: true
        });

        const result = await userService.loginProfessorCPF(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Red - Deve retornar null se a conta estiver desativada', async () => {
        const data = {
            email_ou_username: '123456789',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            cpf: '123456789',
            senha: senhaCorretaHash,
            ativo: false
        });

        const result = await userService.loginProfessorCPF(data, mockUserModel);

        expect(result).toBeNull();
    });

    it('Green - Deve retornar o usuário com sucesso', async () => {
        const data = {
            email_ou_username: '123456789',
            senha: 'senha_correta_123'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        const usuarioSimulado = {
            id: 1,
            cpf: '123456789',
            senha: senhaCorretaHash,
            ativo: true
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.loginProfessorCPF(data, mockUserModel);

        expect(result).not.toBeNull();
        expect(result).toHaveProperty('id', 1);
        expect(result.cpf).toBe('123456789');
    });
});