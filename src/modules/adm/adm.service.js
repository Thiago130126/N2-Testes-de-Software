export const dashboard = async (data, model) => {

    const user = await model.findOne({ where: {username: data}});

    return user;
}