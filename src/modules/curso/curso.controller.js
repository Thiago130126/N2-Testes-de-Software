import * as cursoService from './curso.service.js';
import Curso from './curso.model.js';

export const novoCurso = async (req, res) => {
    try{
        const data = {
            id: req.session.usuarioLogado.id,
            body: req.body
        };

        const curso = await cursoService.novoCurso(data, Curso);

        req.flash('success', `Curso ${curso.nome} criado com sucesso`);
        return res.redirect('/account/professor');


    }catch(error){
        console.error(error);
        req.flash('error', error);
        return res.redirect('/account/professor');
    }
}