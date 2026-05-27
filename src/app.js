import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';
import createError from 'http-errors';

// rotas
import indexRouter from './routes/index.js';
import accountRouter from './routes/account.js';
import admRouter from './routes/adm.js'


const app = express();

app.set('views', path.join(process.cwd(), 'src/views/pages'));
app.set('layout', path.join(process.cwd(), 'src/views/layouts/main'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'src/public')));

// Sessão + Flash
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.session.usuarioLogado || null;
    res.locals.currentPath = req.originalUrl;
    next();
});


// Rotas
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/admin', admRouter);


app.use((req, res, next) => {
    next(createError(404, 'Página não encontrada'));
});

// 2. Gerenciador Global de Erros do Express (exige exatamente 4 parâmetros)
app.use((err, req, res, next) => {
    // Define as variáveis 'message' e 'error' que o seu error.ejs está esperando
    res.locals.message = err.message;
    
    // No ambiente de desenvolvimento, manda o stack trace completo (error.stack). 
    // Em produção, manda um objeto vazio para não vazar a estrutura do seu servidor.
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Renderiza a página de erro com o status correto
    res.status(err.status || 500);
    res.render('error');
});

export default app;
