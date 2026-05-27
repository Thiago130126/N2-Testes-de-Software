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


export const login = async (data, model) =>{
    const { email_ou_username, senha } = data;

    if(!email_ou_username || !senha){
        throw new Error('Todos os campos precisam ser preenchidos');
    }

    const usuario = await model.findOne({
        where: {
            [Op.or]: [
                {email: email_ou_username},
                {username: email_ou_username}
            ]
        }
    });

    if(!usuario){
        throw new Error('Credenciais inválidas');
    }

    const senhaBate = await bcrypt.compare(senha, usuario.senha);

    if(!senhaBate){
        throw new Error('Credenciais inválidas');
    }

    if(!usuario.ativo){
        throw new Error('Conta desativada');
    }

    return usuario;

};

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