import bcrypt from "bcryptjs";
import { where } from "sequelize";

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

export const registerProfessor = async (data, userModel, professorModel) => {
    const { username, first_name, last_name, email, data_nascimento, cpf, diploma, password, confirmPassword } = data.body;

    if(!username || !first_name || !last_name || !data_nascimento || !cpf || !password || !confirmPassword){
        throw new Error('Preencha todos os campos');
    }

    if(username.includes(' ')){
        throw new Error('O nome de usuário não pode conter espaços');
    }

    if(first_name.includes(' ')){
        throw new Error('O primeiro nome não pode conter espaços');
    }

    if(last_name.includes(' ')){
        throw new Error('O último nome não pode conter espaços');
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

    const cpf_em_uso = await professorModel.findOne({ where: {cpf: cpf}});

    if(cpf_em_uso){
        throw new Error('CPF já cadastrado');
    }

    const email_professor = await professorModel.findOne({ where: {email: email}});
    const email_user = await userModel.findOne({ where: {email: email}});

    if(email_professor || email_user){
        throw new Error('Email já cadastrado');
    }

    if(cpf.length !== 11){
        throw new Error('CPF inválido');
    }

    const username_professor = await professorModel.findOne({ where: {username: username}});
    const username_aluno = await userModel.findOne({ where: {username: username}});

    if(username_professor || username_aluno){
        throw new Error('Nome de usuário já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let caminho_final = '';

    if(diploma){
        caminho_final = '/uploads/diplomas/' + diploma;
    }

    let newUser;

    if(await professorModel.count() === 0){
        newUser = await professorModel.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            senha: hash,
            email: email,
            diploma: caminho_final,
            cpf: cpf,
            status_diploma: 'aprovado',
            data_nascimento: data_nascimento,
            adm: true
        });
    }else{
    newUser = await professorModel.create({
            username: username,
            first_name: first_name,
            last_name: last_name,
            senha: hash,
            diploma: caminho_final,
            email: email,
            cpf: cpf,
            data_nascimento: data_nascimento,
        });
    }

    return newUser;

}