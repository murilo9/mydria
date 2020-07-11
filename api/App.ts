import express = require("express");
import bodyParser = require("body-parser");
import cors = require('cors');
import * as mongoose from 'mongoose';

import UserRoutes from "./routes/User";
import verifyJWT from './middleware/Auth'; 
import LoginRoutes from "./routes/Login";
import PostRoutes from "./routes/Post";

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

      // error first callback
      cb(null, 'pictures/');
  },
  filename: function (req, file, cb) {
      console.log(path.extname(file.originalname))
      // error first callback
      cb(null, 'file-' + Date.now() + path.extname(file.originalname));
  }
});

class App {
  public app: express.Application;
  public userRoutes: UserRoutes = new UserRoutes();
  public loginRoutes: LoginRoutes = new LoginRoutes();
  public postsRoutes: PostRoutes = new PostRoutes();

  constructor() {
    this.app = express();
    this.config();
    const upload = multer({ storage });
    this.userRoutes.routes(this.app, verifyJWT, upload);
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