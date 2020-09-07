import express = require("express");
import bodyParser = require("body-parser");
import cors = require('cors');
import * as mongoose from 'mongoose';

import Image from "./models/Image";
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
  filename: async function (req, file, cb) {
      let imgExtention = path.extname(file.originalname);
      req.imgExtention = imgExtention;
      // error first callback
      let image = new Image({ 
        date: new Date(), 
        extention: imgExtention, 
        owner: req.requesterId 
      });
      await image.save();
      let imgId = image._id.toString();
      req.imgId = imgId;
      cb(null, imgId + path.extname(file.originalname));
  }
});

class App {
  public app: express.Application;
  //Declara todos os grupos de rotas:
  public userRoutes: UserRoutes = new UserRoutes();
  public loginRoutes: LoginRoutes = new LoginRoutes();
  public postsRoutes: PostRoutes = new PostRoutes();

  constructor() {
    this.app = express();
    this.app.use(express.static('pictures')); //Necessário para servir o pictures folder
    this.config();
    const upload = multer({ storage });
    //Carrega todos os grupos de rotas:
    this.userRoutes.routes(this.app, verifyJWT, upload);
    this.loginRoutes.routes(this.app, verifyJWT);
    this.postsRoutes.routes(this.app, verifyJWT);
    mongoose.connect('mongodb://localhost/mydria', {useNewUrlParser: true});
  }

  private config(): void{
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

export default new App().app;