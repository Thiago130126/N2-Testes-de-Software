# Relatório de Implementação TDD - EduStream

## 1. Funcionalidade Escolhida: Cadastro de Usuário (Register)
A funcionalidade principal desenvolvida foi o registro de novos usuários na plataforma. As regras de negócio implementadas garantem que:
- Todos os campos obrigatórios sejam preenchidos.
- A senha e a confirmação de senha sejam idênticas e tenham no mínimo 6 caracteres.
- O formato do e-mail seja válido.
- Não seja possível cadastrar um e-mail ou username já existente no banco de dados.
- O primeiro usuário cadastrado no sistema receba automaticamente privilégios de administrador.

## 2. Aplicação do TDD (Red-Green-Refactor)
A funcionalidade foi construída estritamente seguindo o ciclo do TDD:
- **Red:** Primeiramente, escrevi os testes para um cenário específico (ex: e-mail duplicado) esperando que ele falhasse, pois o código da regra não existia.
- **Green:** Em seguida, implementei o mínimo de código necessário no `user.service.js` para fazer o teste passar.
- **Refactor:** Por fim, o código foi refatorado para manter a legibilidade, e o uso de mocks (`vi.fn()`) foi aplicado para isolar a camada de banco de dados.

## 3. Exemplos de Testes Unitários

**Exemplo 1: Validação de Senha (Falha - Red)**
Verifica se o sistema impede o cadastro quando as senhas não coincidem.
`it('Red - deve retornar erro se as senhas não coincidirem')`
- Usei `expect().rejects.toThrow()` para garantir que o erro exato foi lançado.

**Exemplo 2: E-mail Duplicado (Falha - Red)**
Verifica a integração simulada com o banco. Usei `mockUserModel.findOne` para simular que o e-mail já existe e garanti que a operação seja bloqueada.
`it('Red - Deve retornar erro caso o email já esteja em uso')`

**Exemplo 3: Criação com Sucesso (Sucesso - Green)**
Garante que, se todas as regras passarem, o usuário é retornado corretamente.
`it('Green - Deve criar o usuário com sucesso se os dados forem válidos')`
- Usei as asserções `toHaveProperty('id')` e `toBe()` para validar o formato do objeto final.