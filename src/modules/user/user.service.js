import bcrypt from "bcryptjs";
import { Op, where } from "sequelize";

export const register = async (data, model) => {

    const { username, email, password, confirmPassword, first_name, last_name, data_nascimento } = data;

    if(!username || !email || !password || !confirmPassword || !first_name || !last_name || !data_nascimento){
        throw new Error('Preencha todos os campos do formulário');
    }

    if(username.includes(' ')){
        throw new Error('O nome de usuário não pode conter espaços');
    }

    const email_expressao_regular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email_expressao_regular.test(email)){
        throw new Error('Email inválido');
    }

    if(!(password === confirmPassword)){
        throw new Error('As senhas não coincidem');
    }

    if(password.length < 6 || confirmPassword.length < 6){
        throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const email_em_uso = await model.findOne({ where: {email: email}});

    if(email_em_uso){
        throw new Error('Email já cadastrado');
    }

    const username_em_uso = await model.findOne({ where: {username: username}});

    if(username_em_uso){
        throw new Error('Nome de usuário já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const qtde_users = await model.count();

    let novoUsuario;

    if(qtde_users === 0){
        novoUsuario = await model.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            senha: hash,
            email: email,
            data_nascimento: data_nascimento,
            adm: true
        });
    }else{
        novoUsuario = await model.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            senha: hash,
            email: email,
            data_nascimento: data_nascimento
        });
    }

    return novoUsuario;
}

// Meus logins

export const loginUserEmail = async (data, model) =>{
    const { email_ou_username, senha } = data;

    const usuario = await model.findOne({
        where: {email: email_ou_username}
    });

    if(!usuario){
        return null;
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        return null;
    }

    if(!usuario.ativo){
        return null;
    }

    return usuario;

};

export const loginUserUserName = async (data, model) =>{
    const { email_ou_username, senha } = data;

    const usuario = await model.findOne({
        where: {username: email_ou_username}
    });

    if(!usuario){
        return null;
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        return null;
    }

    if(!usuario.ativo){
        return null;
    }

    return usuario;

};

export const loginProfessorEmail = async (data, model) =>{
    const { email_ou_username, senha } = data;

    const usuario = await model.findOne({
        where: {email: email_ou_username}
    });

    if(!usuario){
        return null;
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        return null;
    }

    if(!usuario.ativo){
        return null;
    }

    return usuario;

};

export const loginProfessorUsername = async (data, model) =>{
    const { email_ou_username, senha } = data;

    const usuario = await model.findOne({
        where: {username: email_ou_username}
    });

    if(!usuario){
        return null;
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        return null;
    }

    if(!usuario.ativo){
        return null;
    }

    return usuario;

};


export const loginProfessorCPF = async (data, model) =>{
    const { email_ou_username, senha } = data;

    const usuario = await model.findOne({
        where: {cpf: email_ou_username}
    });

    if(!usuario){
        return null;
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        return null;
    }

    if(!usuario.ativo){
        return null;
    }

    return usuario;

};

// Fim dos logins
/////////////////

export const getProfile = async (data, model) => {

    const usuario = await model.findOne({
        where: {
            username: data.username
        }
    });

    if(!usuario){
        throw new Error('Usuário não encontrado');
    }

    return usuario;
}

export const updateProfile = async (data, model) => {
    let { username, email, first_name, last_name, data_nascimento, password, confirmPassword } = data;

    const usuarioAntes = await model.findOne({
        where: { id: data.usuarioId }
    });

    if (!usuarioAntes) {
        throw new Error('Usuário não encontrado');
    }

    const dadosParaAtualizar = {};

    if (first_name) dadosParaAtualizar.first_name = first_name;
    if (last_name) dadosParaAtualizar.last_name = last_name;

    if (data_nascimento) {
        const dataObj = new Date(data_nascimento);
        const hoje = new Date();

        if (isNaN(dataObj.getTime())) {
            throw new Error('Data de nascimento inválida');
        }

        if (dataObj > hoje) {
            throw new Error('A data de nascimento não pode estar no futuro');
        }
        

        dadosParaAtualizar.data_nascimento = data_nascimento;
    }

    if (username && username !== usuarioAntes.username) {
        const usernameEmUso = await model.findOne({ where: { username: username } });
        if (usernameEmUso) {
            throw new Error('Nome de usuário já em uso');
        }
        dadosParaAtualizar.username = username;
    }

    if (email && email !== usuarioAntes.email) {
        const emailEmUso = await model.findOne({ where: { email: email } });
        if (emailEmUso) {
            throw new Error('Email já em uso');
        }
        dadosParaAtualizar.email = email;
    }

    if (password) {
        if (password.length < 6) {
            throw new Error('A senha precisa ter pelo menos 6 caracteres');
        }
        if (await bcrypt.compare(password, usuarioAntes.senha)) {
            throw new Error('A senha precisa ser diferente da anterior');
        }
        if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem');
        }

        const salt = await bcrypt.genSalt(10);
        dadosParaAtualizar.senha = await bcrypt.hash(password, salt);
    }

    if (Object.keys(dadosParaAtualizar).length > 0) {
        await model.update(dadosParaAtualizar, {
            where: { id: usuarioAntes.id }
        });
    }

    return dadosParaAtualizar;
}