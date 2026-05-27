import * as admService from '../adm/adm.service.js';
import User from '../user/user.model.js';

export const dashboardAdm = async (req, res) => {
    try{

        const username = req.session.usuarioLogado.username;

        const data = username

        const usuarioAdm = await admService.dashboard(data, User);

        res.render('adm/index', { title: 'Painel de Administrador', usuarioAdm:usuarioAdm });

    }catch(error){
        console.error(error);
        req.flash('error', 'Falha ao exibir dashboard');
        return res.redirect('/');
    }
}