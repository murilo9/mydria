# Mydria

Mydria é uma rede social onde os usuários podem postar texto e imagens,
bem como seguir e reagir a posts de outros usuários.

O front-end foi feito com React e Redux, usando o tema padrão do Bootstrap.
Também foi utilizado o Mercury para internacionalização.

## Como testar

Certifique-se de que possui o Mongodb instalado na sua máquina.
Após ter baixado o respositório atualizado, rode **npm install** nos diretórios *api* e *mydria-app* para instalar as dependências da API REST e da aplicação React.
Crie um arquivo *.ENV* na pasta *api* com o conteúdo *SECRET=SENHA*.
Rode o comando **npm run start** na pasta *api* para iniciar a API. Você deve rodar o comando **npm run build** nela antes caso não tenha feito o build nenhuma vez.
Rode o comando **npm run start** na pasta *mydria-app* para iniciar a aplicação React, que será servida em *localhost:8080*.

## Front-end

Em toda página, a primeira coisa que ela vai fazer é uma request no servidor pra verificar se a sessão continua ativa, enquanto exibe um status de carregando. Se a sessão estiver ativa, faz outra request pra carregar os dados do usuário, e depois os dados da página em questão. Se a sessão tiver expirado, realiza logout.

- Redux store: 
{
  session: {
    active: Boolean,
    token: String,
    userId: String
  },
  user: {
    nickname: String,
    profilePic: String,
    email: String
  },
  page: {
    Any (dados específicos da página)
  }
}

### Páginas 

- Login: Contém um form de Login que pode alternar pra um form de signup caso clique no botão 'signup'.
- Feed: Ao iniciar, vai carregar alguns posts pra serem exibidos no feed, caso haja.
- Profile: TODO

## Back-end

### REST API endpoints:

POST em /login - Inicia uma nova sessão

GET em /session - Verifica se uma sessão está ativa

POST em /users - Cria uma nova conta de usuário

POST em /follow/:userId - Segue um usuário

DELETE em /follow/:userId - Deixa de seguir um usuário

POST em /profile-pic - Faz upload da foto de perfil

GET em /posts - Coleta alguns posts pra exibir no feed do usuário

POST em /posts - Cria um novo post

PUT em /post/:postId - Atualiza um post

DELETE em /post/:postId - Deleta um post

POST em /post/:postId/like - Aplica ou remove like em um post

POST em /post/:postId/unlike - Aplica ou remove unlike em um post

GET em /user/:nickname - Coleta os dados de um usuário

PUT em /user/:nickname - Atualiza os dados (bio, country, city) de um usuário