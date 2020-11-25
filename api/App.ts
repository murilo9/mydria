import express = require("express");
import bodyParser = require("body-parser");
import cors = require('cors');
import * as mongoose from 'mongoose';

import UserRoutes from "./routes/User";
import verifyJWT from './middleware/Auth'; 
import LoginRoutes from "./routes/Login";
import PostRoutes from "./routes/Post";
import CommentRoutes from "./routes/Comment";
import NotificationRoutes from "./routes/Notification";

const mongodbString = process.env.MONGODB_URI || 'mongodb://localhost/mydria';

class App {
  public app: express.Application;
  //Declara todos os grupos de rotas:
  public userRoutes: UserRoutes = new UserRoutes();
  public loginRoutes: LoginRoutes = new LoginRoutes();
  public postsRoutes: PostRoutes = new PostRoutes();
  public commentRoutes: CommentRoutes = new CommentRoutes();
  public notificationRules: NotificationRoutes = new NotificationRoutes();

  constructor() {
    this.app = express();
    this.app.use(express.static('dist/pictures')); //Necessário para servir o pictures folder
    this.config();
    //Carrega todos os grupos de rotas:
    this.userRoutes.routes(this.app, verifyJWT);
    this.loginRoutes.routes(this.app, verifyJWT);
    this.postsRoutes.routes(this.app, verifyJWT);
    this.commentRoutes.routes(this.app, verifyJWT);
    this.notificationRules.routes(this.app, verifyJWT);
    //inicializa o banco de dados:
    mongoose.connect(mongodbString, {useNewUrlParser: true});
  }

  private config(): void{
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

export default new App().app;