# Relatório Técnico - Avaliação N3 (EduStream)

## 1. Funcionalidade Escolhida e Regras de Negócio
A funcionalidade desenvolvida consiste no **Cadastro de Novos Cursos** na plataforma de e-learning EduStream, restrita a usuários com perfil de Professor.

**Regras de Negócio aplicadas na camada de Serviço:**
1. **Campos Obrigatórios:** É impossível cadastrar um curso sem enviar `nome`, `descricao`, `qtde_aulas`, `materia`, `thumbnail` e o ID do professor criador.
2. **Validação de Tamanho:** O nome do curso deve conter, obrigatoriamente, um mínimo de 5 caracteres.
3. **Validação Lógica Numérica:** A quantidade de aulas informada deve ser maior que zero (bloqueando valores negativos ou zerados).
4. **Unicidade de Registros:** Não podem existir dois cursos com o mesmo nome na base de dados para evitar duplicidade no catálogo.

---

## 2. Aplicação do TDD (Ciclo Red-Green-Refactor)
O desenvolvimento da funcionalidade seguiu estritamente o modelo de Test-Driven Development:

* **Red (Falha):** Inicialmente, os blocos de teste (`describe` e `it`) foram escritos para a função `novoCurso` baseando-se apenas nos requisitos, antes mesmo de a função existir no `curso.service.js`. Os testes validavam a ausência de campos, regras de tamanho e duplicidade de dados. Ao rodar a suíte, todos os testes falharam pela falta de implementação.
* **Green (Sucesso):** Em seguida, escrevi o código mínimo no Service e no Controller capaz de satisfazer as asserções. Adicionei os blocos `if` para tratamento de erros lógicos e a chamada `model.create()` para salvar o registro, fazendo os testes passarem.
* **Refactor (Refatoração):** Após garantir o sucesso, o código foi otimizado. Foram ajustados detalhes como a correção da interpretação de falsy values do JavaScript (onde `0` aulas era lido como campo vazio) e a garantia de que as dependências externas (como o banco de dados via Sequelize) fossem perfeitamente isoladas através de Mocks (`vi.fn()`), garantindo a velocidade e integridade da suíte de testes unitários.

---

## 3. Explicação dos Testes Unitários e de Integração

### Testes Unitários (Camada de Serviço)
Esses testes rodam em isolamento total, sem acesso real à internet ou ao banco de dados.

**1. Verificação de Regra de Negócio (Quantidade Invalida):**
* **O que verifica:** Garante que o sistema rejeite a criação de cursos com `0` ou menos aulas.
* **Mock Utilizado:** Simulação do `CursoModel` via `vi.fn()`, embora o erro seja estourado pela lógica da linguagem antes de atingir o banco.
* **Asserção Aplicada:** Utiliza `expect().rejects.toThrow('maior que zero')` para confirmar que a Promise é rejeitada com a mensagem exata de erro.

**2. Verificação de Colisão de Dados (Nome Duplicado):**
* **O que verifica:** Impede que um curso seja criado com um nome que já existe no banco de dados.
* **Mock Utilizado:** Foi injetado `mockCursoModel.findOne.mockResolvedValueOnce({ id: 99, nome: 'Curso de Node' })` para forçar o sistema a "acreditar" que já encontrou o curso na tabela.
* **Asserção Aplicada:** `expect().rejects.toThrow('Já existe um curso')` garante que o Service intercepta a colisão e barra o fluxo.

**3. Verificação de Caminho Feliz (Sucesso na Criação):**
* **O que verifica:** Confirma que o curso é criado e retornado se todos os dados forem válidos.
* **Mock Utilizado:** Dois comportamentos sequenciais: `mockCursoModel.findOne.mockResolvedValueOnce(null)` (caminho livre) seguido de `mockCursoModel.create.mockResolvedValueOnce({...data})` (simulando o retorno da inserção).
* **Asserção Aplicada:** `expect(result).toHaveProperty('id', 50)` verifica a integridade do objeto devolvido, e `expect(mockCursoModel.create).toHaveBeenCalledTimes(1)` confere se a comunicação com o banco foi disparada apenas uma vez.

### Testes de Integração (Camada de Controle via Supertest)
Esses testes validam a rota Express e a recepção do protocolo HTTP (Request/Response).

**1. Verificação de Roteamento Pós-Sucesso (HTTP 302):**
* **O que verifica:** Se, ao cadastrar um curso validamente por uma requisição POST, o Controller responde redirecionando o usuário de volta ao painel.
* **Mock Utilizado:** O arquivo `curso.service.js` inteiro foi mockado usando `vi.mock()`. Injetou-se o sucesso com `cursoService.novoCurso.mockResolvedValueOnce({ id: 1 })`.
* **Asserção Aplicada:** `expect(res.status).toBe(302)` e `expect(res.header.location).toBe('/account/professor')`.

**2. Verificação de Processamento de Payload (Parsing JSON/Form):**
* **O que verifica:** Garante que o Express (junto ao middleware `express.json`) consegue ler o corpo da requisição e repassá-lo corretamente ao Service sem perdas.
* **Mock Utilizado:** Mock do Service via `vi.mock()`, interceptando a chamada da função para auditar seus argumentos sem rodar a lógica interna.
* **Asserção Aplicada:** Foi capturada a chamada interceptada (`mock.calls[0][0]`) e verificada com `expect(chamada.body.nome).toBe('Curso Node')`, provando que o payload HTTP sobreviveu até o fim do pipeline.

---