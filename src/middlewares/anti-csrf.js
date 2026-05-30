import * as crypto from 'crypto';


export const Maestro_CSRF = (req, res, next) => {
    if(req.method === 'GET'){
        return Tokenizador(req, res, next);
    }else if(req.method === 'POST'){
        return Comparador(req, res, next);
    }

    return next();
}

export const Tokenizador = (req, res, next) =>{

    const tokens = req.session.csrf_token || [];

    if(tokens.length > 4){
        tokens.shift();
    }

    const token = crypto.randomBytes(32).toString('hex');

    tokens.push(token);

    req.session.csrf_token = tokens;

    const tamanho = req.session.csrf_token.length;

    res.locals.csrf_token = req.session.csrf_token[tamanho - 1];

    res.locals.csrf_tag = () => {
        return `<input type='hidden' name="csrf_token" value="${res.locals.csrf_token}">`; 
    }

    next();
}



export const Comparador = (req, res, next) => {
    const tokens = req.session.csrf_token;

    if(!tokens){
        return res.redirect('/');
    }

    const token_form = req.body.csrf_token;

    if(tokens.includes(token_form)){
        next();
    }else{
        return res.redirect('/');
    }
}