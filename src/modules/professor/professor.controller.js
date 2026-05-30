import Professor from "./professor.model.js";
import * as profService from "./professor.service.js"; 

export const getProfileProfessor = async (req, res) => {
    try{

        const data = req.session.usuarioLogado;

        const usuario = await profService.getProfile(data, Professor); 

        return res.render('account/professor/profile', {usuario:usuario});

    }catch(error){
        console.error(error);
        req.flash('error', 'Falha ao exibir perfil');
        return res.redirect('/');
    }
}