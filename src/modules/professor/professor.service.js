export const getProfile = async (data, model) => {

    const usuario = await model.findOne({
        where: {
            username: data.username
        }
    });

    if(!usuario){
        throw new Error('Usuário não encontrado');
    }

    return usuario;
}