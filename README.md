# Mydria

Mydria é uma rede social onde os usuários podem postar texto e imagens,
bem como seguir e reagir a posts de outros usuários.

O front-end foi feito com React e Redux, usando o tema padrão do Bootstrap.
Também foi utilizado o Mercury para internacionalização.

## Front-end

### Páginas 

Login, Feed, Profile

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