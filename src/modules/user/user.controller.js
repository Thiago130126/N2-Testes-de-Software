import * as userService from './user.service.js';
import User from './user.model.js';

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
        req.flash('error', 'Falha ao criar usuário');
        return res.redirect('/account/register');
    }
};

export const loginUser = async(req, res) => {

    try{
        const data = req.body;

        const user = await userService.login(data, User);

        req.session.usuarioLogado = {
            id: user.id,
            username: user.username,
            adm: user.adm
        }

        req.flash('success', `Bem vindo de volta ${user.first_name}`);
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