import {Request, Response} from "express";
import User from '../models/User';
import Post from '../models/Post';

export default class PostRoutes {
  
  public routes(app, verifyJWT): void {
    
    app.route('/posts')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //GET em /posts - Retorna alguns posts

    .get(async (req: Request, res: Response) => {
      console.log('GET em /posts'+req.params.userId);
      //TODO
    })

    //POST em /posts - Cria um novo post

    .post(async (req, res: Response) => {
      console.log('POST em /posts');
      let requesterId = req.requesterId;
      //Instancia o post no banco de dados:
      let postData = {
        text: req.body.text,
        pictureSrc: req.body.pictureSrc,    //TODO - Upload da foto caso tenha
        author: requesterId,
        tags: req.body.tags
      }
      if(!postData.text && !postData.pictureSrc){
        res.status(400).send('Your post must either have text or a picture');
      }
      else{
        let createdPost = new Post(postData);
        await createdPost.save();
        res.status(201).send(createdPost);    //201 - Created
      }
    })
  }
}