import {Request, Response} from "express";
import User from '../models/User';
import Post, {IPost, IPostInput} from '../models/Post';
import { NotificationTypes } from '../models/Notification';
import {notificate} from './Notification';
import Comment from '../models/Comment';
import Image from '../models/Image';

const buildPost = async function(postId) {
  let post = await Post.findOne({_id: postId}).lean().populate('author')
  .populate({path: 'likedBy', model: 'User'})
  .populate({path: 'unlikedBy', model: 'User'}).exec();
  if(!post){
    return null
  }
  //Adiciona o total de comentários
  const comments = await Comment.find({ post: post._id });
  let commentsTotal = comments.length;
  post.commentsTotal = commentsTotal;
  //Adiciona o sharedFrom, caso tenha
  if(post.sharedFrom){
    const originalPost = await Post.findOne({_id: post.sharedFrom})
    .populate('author').exec();
    post.sharedFrom = originalPost;
  }
  return post;
}

export default class PostRoutes {
  
  public routes(app, verifyJWT, upload): void {

    app.route('/posts')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //GET em /posts?search=contains - Procura posts contendo algo

    .get(async (req, res: Response) => {
      console.log('GET em /posts')
      const query = req.query.search;
      const rgx = new RegExp(query, 'i');
      let oneWord = false;
      let authorId = null;
      //Se for só uma palavra
      if(query.split(' ').length === 1){
        oneWord = true;
        //Procura também por autores
        let author = await User.findOne({nickname: {$regex: rgx}}).exec();
        if(author){
          authorId = author._id;
        }
      }
      //Procura pelos posts:
      let posts = [];
      let orConditions = [];
      orConditions.push({text: {$regex: rgx}})
      if(oneWord){
        orConditions.push({tags: {$regex: rgx}});
        if(authorId){
          orConditions.push({author: authorId});
        }
      }
      console.log(orConditions)
      let basePosts = await Post.find({ $or: orConditions}).populate('author').exec();
      //Adiciona o total de comentários do post:
      for(let i = 0; i < basePosts.length; i++){
        let post = await buildPost(basePosts[i]._id);
        posts.push(post);
      }
      res.status(200).send(posts);
    })

    //POST em /posts - Cria um novo post

    .post(async (req, res: Response) => {
      console.log('POST em /posts');
      let requesterId = req.requesterId;
      //Instancia o post no banco de dados:
      let postData = {
        text: req.body.text,
        img: req.body.img,
        author: requesterId,
        tags: req.body.tags
      }
      if(!postData.text && !postData.img){
        res.status(400).send('Your post must either have text or a picture');
      }
      else{
        let createdPost = new Post(postData);
        await createdPost.save();
        createdPost = await buildPost(createdPost._id);
        res.status(201).send(createdPost);    //201 - Created
      }
    })

    app.route('/post/:postId')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //GET em /post/:postId - Coleta os dados de um post

    .get(async (req, res: Response) => {
      console.log('GET em /post/'+req.params.postId)
      const postId = req.params.postId;
      let postExists = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!postExists){
        req.status(404).send("Post doesn't exist");
        return;
      }
      else{
        let post = await buildPost(postId);
        res.status(200).send(post);
      }
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
      post = await buildPost(post._id);
      res.status(200).send(post);
    })

    //DELETE em /post/:postId - Deleta um post

    .delete(async (req, res: Response) => {
      console.log('DELETE em /post/'+req.params.postId)
      const postId = req.params.postId;
      let post = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!post){
        res.status(404).send("Post doesn't exist");
        return;
      }

      //Se o requester não for o dono do post:
      if(post.author.toString() !== req.requesterId){
        res.status(403).send('That post is not yours');
        return;
      }

      //Delete os comentários do post, se houver:
      await Comment.deleteMany({post: postId}).exec();

      //Deleta a imagem do post, se houver:
      if(post.img){
        await Image.deleteOne({_id: post.img}).exec();
      }

      //Deleta o post:
      await Post.deleteOne({_id: postId}).exec();
      res.status(200).send('Post deleted successfully');

      //TODO - Deletar os comentários do post e a imagem do post, caso tenha
    })

    app.route('/posts/users')

    //GET em /posts/users - Retorna alguns posts de quem você está seguindo

    .get(async (req: Request, res: Response) => {
      console.log('GET em /posts/users');
      let posts = [];
      let basePosts = await Post.find({}).exec();
      //Adiciona o total de comentários do post:
      for(let i = 0; i < basePosts.length; i++){
        let post = await buildPost(basePosts[i]._id);
        posts.push(post);
      }
      res.status(200).send(posts);
    })

    app.route('/post/:postId/like')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //POST em /post/:postId/like -  Dá like num post

    .post(async (req, res: Response) => {
      console.log('POST em /post/'+req.params.postId+'/like')
      const postId = req.params.postId;
      const requesterId = req.requesterId;
      let post = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!post){
        res.status(404).send('Post not found');
        return;
      }

      //Remove o unlike, caso tenha:
      let unliked = -1;
      post.unlikedBy.forEach((unlikeUserId, i) => {
        if(unlikeUserId.toString() === requesterId){
          unliked = i;
        }
      });
      if(unliked > -1){
        post.unlikedBy.splice(unliked, 1);
      }

      //Se ja tem like, remove o like:
      let alreadyLiked = -1;
      post.likedBy.forEach((likeUserId, i) => {
        if(likeUserId.toString() === requesterId){
          alreadyLiked = i;
        }
      });
      if(alreadyLiked > -1){
        post.likedBy.splice(alreadyLiked, 1);
        await post.save();
        post = await buildPost(post._id);
        res.status(200).send(post);
      }
      //Se não tem like, insere o like:
      else{
        post.likedBy.push(requesterId);
        await post.save();
        post = await buildPost(post._id);
        res.status(200).send(post);
      }
      //Envia a notificação pro autor do post:
      await notificate(NotificationTypes.POST_LIKED, post.author, requesterId, postId);
    })

    app.route('/post/:postId/unlike')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    //POST em /post/:postId/unlike -  Dá unlike num post

    .post(async (req, res: Response) => {
      console.log('POST em /post/'+req.params.postId+'/unlike')
      const postId = req.params.postId;
      const requesterId = req.requesterId;
      let post = await Post.findOne({_id: postId}).exec();

      //Caso o post não exista:
      if(!post){
        res.status(404).send('Post not found');
        return;
      }

      //Remove o like, caso tenha:
      let liked = -1;
      post.likedBy.forEach((likeUserId, i) => {
        if(likeUserId.toString() === requesterId){
          liked = i;
        }
      });
      if(liked > -1){
        post.likedBy.splice(liked, 1);
      }

      //Se ja tem unlike, remove o unlike:
      let alreadyUnliked = -1;
      post.unlikedBy.forEach((unlikeUserId, i) => {
        if(unlikeUserId.toString() === requesterId){
          alreadyUnliked = i;
        }
      });
      if(alreadyUnliked > -1){
        post.unlikedBy.splice(alreadyUnliked, 1);
        await post.save();
        post = await buildPost(post._id);
        res.status(200).send(post);
        return;
      }
      //Se não tem unlike, insere o unlike:
      else{
        post.unlikedBy.push(requesterId);
        await post.save();
        post = await buildPost(post._id);
        res.status(200).send(post);
      }
      //Envia a notificação pro autor do post:
      await notificate(NotificationTypes.POST_UNLIKED, post.author, requesterId, postId);
    })

    //GET em /posts/:nickname - Lê os posts de um usuário

    app.route('/posts/:userId')

    .get(async (req: Request, res: Response) => {
      console.log('GET em /posts/'+req.params.userId);
      const author = req.params.userId;
      let posts = [];
      let basePosts = await Post.find({ author }).exec();
      //Adiciona o total de comentários do post:
      for(let i = 0; i < basePosts.length; i++){
        let basePost = basePosts[i];
        const post = await buildPost(basePost._id);
        posts.push(post);
      }
      res.status(200).send(posts);
    })

    //POST em /post:postId/share - Compartilha um post

    app.post('/post/:postId/share', verifyJWT, async (req, res: Response) => {
      console.log('POST em /post/'+req.params.postId+'/share');
      const requesterId = req.requesterId;
      const postId = req.params.postId;
      const shareText = req.body.text;
      const shareTags = req.body.tags;
      const originalPost = await Post.findOne({_id: postId}).populate('author').exec();
      if(originalPost){
        let sharedPost = new Post({
          author: requesterId,
          text: shareText,
          tags: shareTags,
          sharedFrom: originalPost._id
        });
        await sharedPost.save();
        //É necessário recarregar o sharedPost para poder popular corretamente:
        sharedPost = await buildPost(sharedPost._id);
        res.status(200).send(sharedPost);
        //Envia a notificação pro autor do post:
        await notificate(NotificationTypes.POST_SHARED, sharedPost.author, requesterId, postId);
      }
      else {
        res.status(404).send('Post not found.');
      }
    })
  }
}