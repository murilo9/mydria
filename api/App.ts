import express = require("express");
import bodyParser = require("body-parser");
import cors = require('cors');
import * as mongoose from 'mongoose';

import UserRoutes from "./routes/User";
import verifyJWT from './middleware/Auth'; 
import LoginRoutes from "./routes/Login";
import PostRoutes from "./routes/Post";

class App {
  public app: express.Application;
  public userRoutes: UserRoutes = new UserRoutes();
  public loginRoutes: LoginRoutes = new LoginRoutes();
  public postsRoutes: PostRoutes = new PostRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.userRoutes.routes(this.app, verifyJWT);
    this.loginRoutes.routes(this.app, verifyJWT);
    this.postsRoutes.routes(this.app, verifyJWT);
    mongoose.connect('mongodb://localhost/andorin', {useNewUrlParser: true});
  }

  private config(): void{
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

export default new App().app;