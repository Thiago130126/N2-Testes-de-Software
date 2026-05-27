const falha = 'Erro ao fazer autenticação';

export const admAuth = (req, res, next) => {
    try{

        if(!req.session.usuarioLogado){
            req.flash('error', 'Precisa estar logado para acessar essa página');
            return res.redirect('/account/login');
        }
        const userLogado = req.session.usuarioLogado;

        if(!userLogado.adm){
            req.flash('error', 'Você não tem autorização para acessar essa página');
            return res.redirect('/');
        }

        next();

    }catch(error){
        console.error(error);
        req.flash('error', falha);
        return res.redirect('/');
    }
}

export const userAuth = (req, res, next) => {
    try{

        if(!req.session.usuarioLogado){
            req.flash('error', 'Precisa estar logado para acessar essa página');
            return res.redirect('/account/login');
        }

        next();

    }catch(error){
        console.error(error);
        req.flash('error', falha);
        return res.redirect('/');
    }
}

export const professorAuth = (req, res, next) => {
    try{
        if(!req.session.usuarioLogado.professor){
            req.flash('error', 'Precisa ser um professor para acessar essa página');
            return res.redirect('/account/login');
        }

        next();

    }catch(error){
        console.error(error);
        req.flash('error', falha);
        return res.redirect('/');
    }
}