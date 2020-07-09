import {Request, Response} from "express";
import User from '../models/User';
import Post, {IPost, IPostInput} from '../models/Post';

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

    app.route('/post/:postId')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //PUT em /post/:postId - Atualiza um post

    .put(async (req, res: Response) => {
      console.log('PUT em /post/'+req.params.postId)
      const postId = req.params.postId;
      const updatedPost = req.body;
      let post = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!post){
        req.status(404).send("Post doesn't exist");
        return;
      }

      //Se o requester não for o dono do post:
      if(post.author.toString() !== req.requesterId){
        res.status(403).send('That post is not yours');
        return;
      }

      //Atualiza os atributos do post:
      if(updatedPost.text){
        post.text = updatedPost.text;
      }
      if(updatedPost.img){
        post.img = updatedPost.pictureSrc;
      }
      if(updatedPost.tags){
        post.tags = updatedPost.tags;
      }
      await post.save();
      res.status(200).send(post);
    })

    //DELETE em /post/:postId - Deleta um post

    .delete(async (req, res: Response) => {
      console.log('DELETE em /post/'+req.params.postId)
      const postId = req.params.postId;
      let post = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!post){
        req.status(404).send("Post doesn't exist");
        return;
      }

      //Se o requester não for o dono do post:
      if(post.author.toString() !== req.requesterId){
        res.status(403).send('That post is not yours');
        return;
      }

      //Deleta o post:
      await Post.deleteOne({_id: postId}).exec();
      res.status(200).send('Post deleted successfully');
    })
  }
}