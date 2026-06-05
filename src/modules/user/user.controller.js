import * as userService from './user.service.js';
import User from './user.model.js';
import { Auth_backends } from './auth.backends.js';
import Professor from '../professor/professor.model.js';

export const registerUser  = async (req, res) => {
    try{

        const data = req.body;

        const newUser = await userService.register(data, User);

        req.session.usuarioLogado = {
            id: newUser.id,
            username: newUser.username,
            adm: newUser.adm
        }

        req.flash('success', 'Conta criada com sucesso');

        req.session.save(() => {
            return res.redirect('/');
        });

    }catch(error){
        console.error(error);
        req.flash('error', error);
        return res.redirect('/account/register');
    }
};

export const loginUser = async(req, res) => {

    try{
        const condicao = 'Professor';

        const data = req.body;

        let usuario = null;

        let resposta = null;

        if(!data.email_ou_username || !data.senha){
            req.flash('Preencha todos os campos');
            return res.redirect('/account/login');
        }

        for (const backend of Auth_backends) {
            if(backend.name.includes(condicao)){
                resposta = await backend(data, Professor);
            }else{
                resposta = await backend(data, User);
            }

            if(resposta !== null){
                usuario = resposta;
                break;
            }
        }

        if(!usuario){
            req.flash('error', 'Falha ao fazer login');
            return res.redirect('/account/login');
        }

        req.session.usuarioLogado = {
            id: usuario.id,
            username: usuario.username,
            adm: usuario.adm
        }

        req.flash('success', `Bem vindo de volta ${usuario.first_name}`);

        if(usuario.professor){
            return res.redirect('/account/professor');
        }

        return res.redirect('/');

    }catch(erro){
        console.error(erro);
        req.flash('error', 'Falha ao fazer login');
        return res.redirect('/');
    }

}

export const logout = (req, res) => {
    try{
        if(req.session){
            req.session.destroy(() => {
                return res.redirect('/');
            })
        }else{
            return res.redirect('/');
        }
    }catch(error){
        console.error(error);
        req.flash('error', 'Falha ao fazer logout');
        return res.redirect('/');
    }
}

export const getProfileUser = async (req, res) => {
    try{

        const data = req.session.usuarioLogado;

        const usuario = await userService.getProfile(data, User); 

        return res.render('account/profile', {usuario:usuario});

    }catch(error){
        console.error(error);
        req.flash('error', 'Falha ao exibir perfil');
        return res.redirect('/');
    }
}

export const updateProfileUser = async (req, res) =>{
    try{

        const usuarioId = req.session.usuarioLogado.id;

        let data = req.body;
        data.usuarioId = usuarioId;

        const dadosNovos = await userService.updateProfile(data, User);

        if(dadosNovos.username) req.session.usuarioLogado.username = dadosNovos.username;

        return res.redirect('/account/profile');

    }catch(error){
        console.error(error);
        req.flash('error', error.message);
        return res.redirect('/');
    }
}