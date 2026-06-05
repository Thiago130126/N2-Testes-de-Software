# Relatório de Implementação TDD - EduStream

## 1. Funcionalidade Escolhida: Autenticação de Usuários (Login)
A funcionalidade de login de usuário foi implementada com uma arquitetura de pipeline (baseada no padrão de projeto *Strategy*) inspirada no funcionamento interno do framework Django, com o qual já possuo experiência. O escopo foi organizado em três arquivos principais:

* **Arquivo 1: `user.service.js`:** Nesse arquivo são criadas as funções de login, cada uma autenticando o usuário de um jeito diferente (ex: há uma para autenticar pelo nome de usuário, outra pelo email, outra para autenticar professores via CPF, etc.).
* **Arquivo 2: `auth.backends.js`:** Nesse arquivo, uma lista é criada contendo cada uma das funções de login exportadas do arquivo de serviço.
* **Arquivo 3: `user.controller.js`:** O controlador principal (`loginUser`) realiza a validação inicial dos dados do formulário e, em seguida, itera sobre a lista de estratégias (o Array de backends). O laço de repetição executa cada método de login injetando os respectivos models; o ciclo continua enquanto os retornos forem nulos. Se um método validar o usuário com sucesso, o loop é interrompido imediatamente. Em seguida, a sessão é criada e o roteamento decide o redirecionamento com base nos privilégios da conta (ex: painel de professores ou página inicial).

### 1.1 Regras de Negócio Aplicadas
Para garantir a segurança da plataforma, cada estratégia de login do Service obedece estritamente a três regras de negócio antes de retornar o objeto do usuário:
1. **Validação de Existência:** O sistema deve encontrar um registro correspondente à credencial fornecida (seja E-mail, Username ou CPF). Caso contrário, a tentativa é abortada.
2. **Integridade Criptográfica:** A senha em texto puro fornecida no formulário deve bater com o hash criptografado salvo no banco de dados (validação via Bcrypt).
3. **Status da Conta:** Mesmo com credenciais e senhas corretas, o sistema deve impedir o login se a conta do usuário estiver desativada ou suspensa (propriedade `ativo: false`).

## 2. Aplicação do TDD (Ciclo Red-Green-Refactor)
A funcionalidade foi construída estritamente seguindo o ciclo do TDD:

* **Red:** Inicialmente, os blocos de teste (`describe`) foram escritos para cada estratégia de autenticação antes da implementação do código, cobrindo cenários de falha (credenciais incorretas, contas inativas) e sucesso. Naturalmente, os testes falharam pela ausência de código.
* **Green:** Em seguida, implementei o código mínimo necessário no `user.service.js` para fazer o teste passar.
* **Refactor:** Por fim, o código foi refatorado para manter a legibilidade, o uso de mocks (`vi.fn()`) foi aplicado para isolar a camada de banco de dados, e alterei a estrutura dos arquivos. Como a soma das linhas dos arquivos `user.service.login.test.js` e `user.service.register.test.js` beirava as 600 linhas, organizei os arquivos separando por funcionalidades e acrescentei mais testes para garantir a cobertura.

## 3. Exemplos de Testes Unitários

**Exemplo 1: Usuário Não Encontrado (Falha)**
Verifica o comportamento do pipeline caso as credenciais não existam no banco de dados.
* `it('Red - Deve retornar null se o email não for encontrado')`
* **Implementação:** Utilizei `mockUserModel.findOne.mockResolvedValueOnce(null)` para simular a ausência do registro no banco, isolando a dependência externa. A asserção `expect().toBeNull()` garante que a função retorne de forma silenciosa, permitindo que o Controller passe para a próxima tentativa do pipeline.

**Exemplo 2: Bloqueio de Conta Desativada (Falha)**
Valida a regra de negócio que impede o acesso de usuários inativos, mesmo que a senha fornecida esteja correta.
* `it('Red - Deve retornar null se a conta estiver desativada')`
* **Implementação:** Simulei a geração de um hash real com `bcrypt.hash()` e injetei um usuário mockado com a propriedade `ativo: false`. A asserção verifica se o Service barra a autenticação adequadamente.

**Exemplo 3: Autenticação com Sucesso (Sucesso)**
Garante que credenciais válidas resolvem o processamento criptográfico e retornam a entidade correta.
* `it('Green - Deve retornar o usuário com sucesso')`
* **Implementação:** Com um usuário mockado válido, utilizei múltiplas asserções. O `expect().not.toBeNull()` atesta o sucesso da operação, enquanto `expect().toHaveProperty('id')` e `expect().toBe()` asseguram a integridade do objeto de retorno.

> **Nota Arquitetural sobre Asserções:** Embora o projeto em outros testes utilize o método `expect().toThrow()` para validar disparos de exceções em rotas de cadastro ou atualização de perfil, a camada de Serviço de Login foi intencionalmente projetada para não lançar erros fatais em caso de credenciais inválidas. Em vez disso, ela retorna `null` para que o padrão *Strategy* do Controller possa testar o próximo método da fila sem interrupções. Por isso, a asserção primordial desta suíte específica é o `toBeNull()`.

## 4. A Arquitetura e Escalabilidade
Escolhi essa arquitetura para a função de login, em vez da simples função apresentada nos exemplos base da disciplina, porque o objetivo era reutilizar a mesma página de login (e o mesmo formulário) para autenticar tanto Alunos quanto Professores, mesmo sabendo que eles pertencem a Models separados. 

Essa arquitetura resolveu o problema de acoplamento do `userController` e tornou o sistema altamente escalável: a criação de novos meios de autenticação (como um futuro acesso para Administradores via Token, por exemplo) não exige nenhuma alteração no laço de controle principal, bastando apenas injetar a nova função na lista de backends.