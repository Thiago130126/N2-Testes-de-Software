import * as fsSinc from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

export const dashboard = async (data, model) => {

    const user = await model.findOne({ where: {username: data}});

    return user;
}