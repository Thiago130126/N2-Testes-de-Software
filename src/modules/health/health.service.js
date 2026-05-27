export const getHealth = () => ({
    status: 'OK',
    message: 'EduStream-TDD está saudável e pronto para TDD!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
});