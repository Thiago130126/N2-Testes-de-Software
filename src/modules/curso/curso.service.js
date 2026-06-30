import { where } from "sequelize";

export const novoCurso = async (data, model) => {

    const { nome, descricao, qtde_aulas, materia, thumbnail } = data.body;

    if(!nome || !descricao || !qtde_aulas || !materia || !thumbnail){
        throw new Error('Preencha todos os dados do formulário');
    }

    const professor = data.id;

    if (!professor){
        throw new Error('Professor não encontrado');
    }

    if(nome.length < 5){
        throw new Error('O nome do curso deve ter pelo menos 5 caracteres');
    }

    if(Number(qtde_aulas) < 0){
        throw new Error('A quantidade de aulas deve ser maior que zero');
    }

    const cursoExistente = await model.findOne({where: {nome: nome}});

    if(cursoExistente){
        throw new Error('Já existe um curso com este nome');
    }

    const cursoCriado = await model.create({
        nome,
        descricao,
        qtde_aulas,
        materia,
        thumbnail,
        professor_id: professor 
    });

    return cursoCriado;
}