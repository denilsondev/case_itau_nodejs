# Case de engenharia Itau - .NodeJS

## Introdução
Neste projeto esta sendo utilizada a base de dados sqlite com a seguinte tabela:

    Tabela: CLIENTES > "Registro relacionados ao cadastro de clientes"
	- id    - INTEGER NOT NULL AUTOINCREMENT PRIMARY KEY
	- nome  - TEXT    NOT NULL
	- email - TEXT    NOT NULL UNIQUE
	- saldo - FLOAT

No projeto foi disponibilizada uma API de Clientes com os metodos abaixo realizando acoes diretas na base de dados:

	GET    clientes                - LISTAR TODOS OS CLIENTES CADASTRADOS
	GET    clientes/{ID}           - RETORNAR OS DETALHES DE UM DETERMINADO CLIENTES PELO ID
	POST   clientes                - REALIZA O CADASTRO DE UM NOVO CLIENTE
	PUT    clientes/{ID}           - EDITA O CADASTRO DE UM CLIENTE JÁ EXISTENTE
	DELETE clientes/{ID}           - EXCLUI O CADASTRO DE UM CLIENTE
	POST   clientes/{ID}/depositar - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE
    POST   clientes/{ID}/sacar     - ADICIONA OU SUBTRAI DETERMINADO VALOR DO SALDO DE UM CLIENTE

## Ações a serem realizadass
1. Faça o fork do projeto no seu github. Não realize commits na branch main e nem crie novas branchs.
2. O código da api de clientes faz mal uso dos objetos, não segue boas práticas e não possui qualidade. Refatore o codigo utilizando as melhores bibliotecas, praticas, patterns e garanta a qualidade da aplicação. Fique a vontade para mudar o que achar necessário.
3. O controle de saldo do cliente possui um erro. Identifique e implemente a correção
4. Para nós segurança é um tema sério, implemente as ações que achar prudente para garantir a segurança da sua aplicação
5. Utilizando o Angular, crie uma aplicação web  que consuma todos os metodos da API de clientes

Após finalizar o case, envie o link do seu github com a solução final para o e-mail andre.gattini@itau-unibanco.com.br

---

## Melhorias Implementadas

### Backend
- **NestJS**: Framework moderno com arquitetura em camadas
- **TypeScript**: Tipagem estática para maior segurança
- **DTOs**: Transformação de dados de entrada e saída
- **Validações**: Validação de parâmetros de entrada com class-validator
- **Tratamento de Erros**: Exception filters globais
- **TypeORM**: ORM com suporte a migrations
- **MySQL**: Migração do SQLite para banco robusto
- **Swagger**: Documentação interativa da API
- **Cache**: Performance com cache em memória
- **Logs**: Logs estruturados para monitoramento
- **Testes**: Testes unitários com Jest
- **Transações**: Validação de saque/depósito com locks pessimistas

### Frontend
- **Angular 20**: Framework moderno para interface
- **Bootstrap**: Design

### DevOps
- **Docker Compose**: Build e orquestração de containers
- **Terraform**: Provisionamento de infraestrutura
- **GitHub Actions**: Deploy automatizado

---

## Como Executar

```bash
# Clone e execute
git clone https://github.com/denilsondev/case_itau_nodejs.git
cd case_itau_nodejs
docker-compose up -d

# Acesse
# Frontend: http://localhost:4200
# API: http://localhost:8080/api
# Docs: http://localhost:8080/docs
```

