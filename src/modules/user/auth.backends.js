import * as userService from './user.service.js';

export const Auth_backends = [
    userService.loginUserEmail,
    userService.loginUserUserName,
    userService.loginProfessorEmail,
    userService.loginProfessorUsername,
    userService.loginProfessorCPF
];

