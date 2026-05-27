// src/server.js
import 'dotenv/config';
import app from './app.js';
import { sequelize } from './modules/index.js'; // <--- Importa o maestro!

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(async () => {
        console.log('📦 Conexão com o banco de dados estabelecida!');
        
        // Sincroniza os Models com o banco real. 
        // Em desenvolvimento, as vezes usamos { alter: true } para atualizar colunas sem perder dados.
        await sequelize.sync({ alter: true }); 
        console.log('🔄 Tabelas sincronizadas com sucesso!');

        app.listen(PORT, () => {
            console.log(`🚀 EduStream rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Falha na conexão com o banco:', error);
    });