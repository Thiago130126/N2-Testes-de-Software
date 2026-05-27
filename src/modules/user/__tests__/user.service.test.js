import { describe, it, expect, beforeEach } from 'vitest';
import * as userService from '../user.service.js';
import bcrypt from 'bcryptjs';

describe('User Service - Cadastro', () => {
    let mockUserModel;
    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn(),
            create: vi.fn(),
            count: vi.fn()
        };
    });

    it('Red - deve retornar erro se as senhas não coincidirem', async () => {
        const data = {
            username: 'paulo',
            email: 'paulo@test.com',
            password: '12345678',
            confirmPassword: '87654321',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('As senhas não coincidem');
    });

    it('Red - Deve retornar erro caso a senha seja menor de 6 caracteres', async () => {
        const data = {
            username: 'user1',
            email: 'canalthiago750@gamil.com',
            password: '1234',
            confirmPassword: '1234',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('Senha deve ter pelo menos 6 caracteres');
    });

    it('Red - Deve retornar erro caso o email já esteja em uso', async () => {
        const data = {
            username: 'Thiago',
            email: 'teste750@gamil.com',
            password: '123456',
            confirmPassword: '123456',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };

        mockUserModel.findOne.mockResolvedValueOnce({id: 1, email: 'teste750@gamil.com'});

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('Email já cadastrado');
    });

    it('Red - Deve retornar erro caso o username já esteja em uso', async () => {
        const data = {
            username: 'user1',
            email: 'teste750@gamil.com',
            password: '123456',
            confirmPassword: '123456',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);

        mockUserModel.findOne.mockResolvedValueOnce({id: 1, username: 'user1'});

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('Nome de usuário já cadastrado');
    });

    it('Red - Deve retornar erro caso esteja faltando algum dado', async () => {
        const data = {
            username: 'user1',
            email: 'teste750@gamil.com',
            password: '123456',
            confirmPassword: '123456',
            last_name: 'Manseira',
        };

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('Preencha todos os campos do formulário');
    });

    it('Green - Deve criar o usuário com sucesso se os dados forem válidos', async () => {
        const data = {
            username: 'user1',
            email: 'teste750@gamil.com',
            password: '123456',
            confirmPassword: '123456',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };


        mockUserModel.findOne.mockResolvedValueOnce(null);

        mockUserModel.create.mockResolvedValue({id: 1, ...data});

        const result = await userService.register(data, mockUserModel);

        expect(result).toHaveProperty('id', 1);
        expect(result.username).toBe('user1');
    });

    it('Red - Deve retornar erro se o email não for válido.', async () => {
        const data = {
            username: 'user1',
            email: 'teste750gamil.com',
            password: '123456',
            confirmPassword: '123456',
            first_name: 'Paulo',
            last_name: 'Manseira',
            data_nascimento: '1945-12-03'
        };

        await expect(userService.register(data, mockUserModel))
        .rejects
        .toThrow('Email inválido');

    });

    it('Green - Deve criar o primeiro usuário sendo ADM', async () => {
        const data = {
            username: 'adminUser',
            email: 'admin@test.com',
            password: 'senhaSegura123',
            confirmPassword: 'senhaSegura123',
            first_name: 'Thiago',
            last_name: 'Canal',
            data_nascimento: '1990-01-01'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);
        mockUserModel.findOne.mockResolvedValueOnce(null);

        mockUserModel.count.mockResolvedValue(0);

        mockUserModel.create.mockResolvedValue({ id: 1, ...data, adm: true });

        const result = await userService.register(data, mockUserModel);

        expect(mockUserModel.create).toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'adminUser',
                adm: true
            })
        );
        expect(result.adm).toBe(true);
    });

    it('Green - Deve criar um novo usuário sem ser adm por não ser o primeiro', async () => {
        const data = {
            username: 'NotadminUser',
            email: 'Notadmin@test.com',
            password: 'NotsenhaSegura123',
            confirmPassword: 'NotsenhaSegura123',
            first_name: 'Thiago',
            last_name: 'NotCanal',
            data_nascimento: '1990-01-01'
        };

        mockUserModel.findOne.mockResolvedValueOnce(null);
        mockUserModel.findOne.mockResolvedValueOnce(null);

        mockUserModel.count.mockResolvedValue(5);

        mockUserModel.create.mockResolvedValue({ id: 1, ...data, adm: true });

        const result = await userService.register(data, mockUserModel);

        expect(mockUserModel.create).not.toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'NotadminUser',
                adm: true
            })
        );
        expect(result.adm).toBe(true);
    });

    it('Red - Deve retornar erro se o username contiver espaços', async () => {
        const data = {
            username: 'thiago canal',
            email: 'thiago@test.com',
            password: 'senhaSegura123',
            confirmPassword: 'senhaSegura123',
            first_name: 'Thiago',
            last_name: 'Canal',
            data_nascimento: '1990-01-01'
        };

        await expect(userService.register(data, mockUserModel))
            .rejects
            .toThrow('O nome de usuário não pode conter espaços');
    });
});

describe('User Service - Login', () => {
    let mockUserModel;

    beforeEach(() =>{
        mockUserModel = {
            findOne: vi.fn(),
            create: vi.fn(),
            count: vi.fn()
        };
    })


    it('Red - Deve dar erro se faltarem dados', async () =>{

        const data = {
            email: 'tem_email_mas_sem_senha@gamil.com'
        }

        await expect(userService.login(data, mockUserModel))
        .rejects
        .toThrow('Todos os campos precisam ser preenchidos');

    });

    it('Red - Deve dar erro se o email não for encontrado', async () =>{

        const data = {
            email_ou_username: 'tem_email_mas_sem_senha@gamil.com',
            senha: 'agora_tem_senha'
        }

        mockUserModel.findOne.mockResolvedValueOnce(null);

        await expect(userService.login(data, mockUserModel))
        .rejects
        .toThrow('Credenciais inválidas');

    });

    it('Red - Deve dar erro se o username não for encontrado', async () =>{

        const data = {
            email_ou_username: 'tem_username',
            senha: 'tem_senha'
        }

        mockUserModel.findOne.mockResolvedValueOnce(null);

        await expect(userService.login(data, mockUserModel))
        .rejects
        .toThrow('Credenciais inválidas');

    });


    it('Red - Deve dar erro se a senha estiver incorreta', async () => {
        const data = {
            email_ou_username: 'tem_email@test.com',
            senha: 'senha_errada_do_usuario'
        };

        const salt = await bcrypt.genSalt(10);
        const senhaCorretaHash = await bcrypt.hash('senha_correta_123', salt);

        mockUserModel.findOne.mockResolvedValueOnce({
            id: 1,
            email: 'tem_email@test.com',
            senha: senhaCorretaHash
        });

        await expect(userService.login(data, mockUserModel))
        .rejects
        .toThrow('Credenciais inválidas');
    });

    it('Green - Deve realizar o login com sucesso e retornar o usuário', async () => {
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
            ativo: true,
            adm: false,
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        const result = await userService.login(data, mockUserModel);

        expect(result).toHaveProperty('id', 1);
        expect(result.email).toBe('aluno@test.com');
    });

    it('Red - Deve retornar erro ao logar com conta desativada', async () => {
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
            ativo: false,
            adm: false,
        };

        mockUserModel.findOne.mockResolvedValueOnce(usuarioSimulado);

        await expect(userService.login(data, mockUserModel))
        .rejects
        .toThrow('Conta desativada');
    });

});