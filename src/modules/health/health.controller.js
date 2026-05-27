import * as healthService from './health.service.js';

export const checkHealth = (req, res) => {
    try {
        const healthData = healthService.getHealth();

        return res.status(200).json(healthData);

    } catch (error) {
        console.error('Erro no Health Check:', error);
        return res.status(500).json({ 
            status: 'ERROR', 
            message: 'O servidor encontrou um problema.' 
        });
    }
};