# Relatório de Implementação TDD - EduStream

## 1. Funcionalidade Escolhida: Autenticação de usuários (Login)
A funcionalidade de login de usuário foi implementada com uma arquitetura de pipeline (baseada no padrão de projeto Strategy) inspirada no funcionamento interno do framework Django, com o qual já possuo experiência. O escopo foi organizado em três arquivos principais:
- **Arquivo 1: user.service.js**
Nesse arquivo são criadas as funções de login, cada uma autenticando o usuário de um jeito diferente, há uma para autenticar pelo nome de usuário, outra pelo email, outra para autenticar professores etc.
- **Arquivo 2: auth.backends.js** 
Nesse arquivo, uma lista é criada contendo cada uma das funções de login do arquivo user.service.js.
- **Arquivo 3: user.controller.js**
Nesse arquivo o controlador principal (loginUser) realiza a validação inicial dos dados do formulário e, em seguida, itera sobre a lista de estratégias (o Array de backends). O laço de repetição executa cada método de login injetando os respectivos models; o ciclo continua enquanto os retornos forem nulos. Se um método validar o usuário com sucesso, o loop é interrompido imediatamente. Em seguida, a sessão é criada e o roteamento decide o redirecionamento com base nos privilégios da conta (ex: painel de professores ou página inicial).

## 2. Aplicação do TDD (Red-Green-Refactor)
A funcionalidade foi construída estritamente seguindo o ciclo do TDD:
- **Red:** Inicialmente, os blocos de teste (describe) foram escritos para cada estratégia de autenticação antes da implementação do código, cobrindo cenários de falha (credenciais incorretas, contas inativas) e sucesso. Naturalmente, os testes falharam pela ausência de código.
- **Green:** Em seguida, implementei o código necessário no `user.service.js` para fazer o teste passar.
- **Refactor:** Por fim, o código foi refatorado para manter a legibilidade, e o uso de mocks (`vi.fn()`) foi aplicado para isolar a camada de banco de dados, e eu alterei a estrutura dos arquivos, somando as linhas dos arquivos atuais user.service.login.test.js e user.service.register.test.js beiravam as 600 linhas, então eu organizei os arquivos por funcionalidades e acrescentei mais testes.

## 3. Exemplos de Testes Unitários

**Exemplo 1: Usuário Não Encontrado (Falha - Red)**
Verifica o comportamento do pipeline caso as credenciais não existam no banco de dados.
it('Red - Deve retornar null se o email não for encontrado')
- Implementação: Utilizei mockUserModel.findOne.mockResolvedValueOnce(null) para simular a ausência do registro no banco, isolando a dependência externa. A asserção expect().toBeNull() garante que a função retorne de forma silenciosa, permitindo que o Controller passe para a próxima tentativa do pipeline.

**Exemplo 2: Bloqueio de Conta Desativada (Falha - Red)**
Valida a regra de negócio que impede o acesso de usuários inativos, mesmo que a senha fornecida esteja correta.
it('Red - Deve retornar null se a conta estiver desativada')
- Implementação: Simulei a geração de um hash real com bcrypt.hash() e injetei um usuário mockado com a propriedade ativo: false. A asserção verifica se o Service barra a autenticação adequadamente.

**Exemplo 3: Autenticação com Sucesso (Sucesso - Green)**
Garante que credenciais válidas resolvem o processamento criptográfico e retornam a entidade correta.
it('Green - Deve retornar o usuário com sucesso')
- Implementação: Com um usuário mockado válido, utilizei múltiplas asserções. O expect().not.toBeNull() atesta o sucesso da operação, enquanto expect().toHaveProperty('id') e expect().toBe() asseguram a integridade do objeto de retorno.

***Nota Arquitetural** 
Sobre Asserções: Embora o projeto em outros testes utilize o método expect().toThrow() para validar disparos de exceções em rotas de cadastro, a camada de Serviço de Login foi intencionalmente projetada para não lançar erros fatais em caso de credenciais inválidas. Em vez disso, ela retorna null para que o padrão Strategy do Controller possa testar o próximo método da fila sem interrupções. Por isso, a asserção primordial desta suíte específica é o toBeNull().

## 4. A arquitetura
Escolhi essa arquitetura para a função de login, em vez da simples função apresentada no shortz-app, porque eu queria poder reutilizar a mesma página de login para logar professores ao invés de criar uma nova página só para eles. Essa arquitetura resolveu o problema de acoplamento do userController e tornou o sistema altamente escalável: a criação de novos meios de autenticação (como um futuro acesso para Administradores) não exige nenhuma alteração no laço de controle principal, bastando apenas injetar a nova função na lista de backends. 