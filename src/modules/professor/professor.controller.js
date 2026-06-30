import Professor from "./professor.model.js";
import * as profService from "./professor.service.js";
import Aluno from "../user/user.model.js";

export const getProfileProfessor = async (req, res) => {
    try{

        const data = req.session.usuarioLogado;

        const usuario = await profService.getProfile(data, Professor); 

        return res.render('professor/profile', {usuario:usuario});

    }catch(error){
        console.error(error);
        req.flash('error', 'Falha ao exibir perfil');
        return res.redirect('/');
    }
}

export const registerProfessor = async (req, res) => {
    try{

        const usuario = await profService.registerProfessor(req, Aluno, Professor);

        req.session.usuarioLogado = {
            id: usuario.id,
            username: usuario.username,
            first_name: usuario.first_name,
            adm: usuario.adm,
            professor: usuario.professor
        }

        req.session.save(() => {
            return res.redirect('/account/professor/profile',);
        });

    }catch(error){
        console.error(error);
        return res.redirect('/account/professor/register-professor');
    }
}