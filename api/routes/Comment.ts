import {Request, Response} from "express";
import User from '../models/User';
import Comment, { IComment, ICommentInput } from '../models/Comment';
import Post, {IPost, IPostInput} from '../models/Post';

export default class CommentRoutes {

  public routes(app, verifyJWT): void {

    //GET em /post/:postId/comments - Lê os comentários de um post

    app.get('/post/:postId/comments', async (req: Request, res: Response) => {
      console.log('GET em /post/'+req.params.postId+'/comments');
      const postId = req.params.postId;
      const comments = await Comment.find({ post: postId }).populate('author').exec();
      if(comments){
        res.status(200).send(comments);
      }
      else {
        res.status(404).send('Post not found')
      }
    })

    //POST em /post/:postId/comments - Posta um comentário

    app.post('/post/:postId/comments', verifyJWT, async(req, res: Response) => {
      console.log('POST em /post/'+req.params.postId+'/comments');
      const postId = req.params.postId;
      const post = await Post.findOne({ _id: postId}).exec();
      if(post){
        const commentData = {
          author: req.author,
          post: postId,
          text: req.text,
          date: new Date()
        }
        let comment = new Comment(commentData);
        await comment.save();
        res.status(200).send(comment);
      }
      else{
        res.status(404).send('Post not found');
      }
    })

    //PUT em /comment/:commentId - Atualiza um comentário

    app.put('/comment/:commentId', verifyJWT, async(req, res: Response) => {
      console.log('PUT em /comments/'+req.params.commentId);
      const commentId = req.params.commentId;
      const requesterId = req.requesterId;
      let comment = await Comment.findOne({ _id: commentId, author: requesterId }).exec();
      if(comment){
        if(req.body.text){
          comment.text = req.body.text;
          comment.edited = true;
        }
        await comment.save();
        res.status(200).send(comment);
      }
      else{
        res.status(404).send('Comment not found.');
      }
    })

    //DELETE em /comment/:commentId

    app.delete('/comment/:commentId', verifyJWT, async(req, res: Response) => {
      console.log('DELETE em /comments/'+req.params.commentId);
      const commentId = req.params.commentId;
      const requesterId = req.requesterId;
      let comment = await Comment.findOne({ _id: commentId, author: requesterId }).exec();
      if(comment){
        await Comment.deleteOne({ _id: commentId, author: requesterId }).exec();
        res.status(200).send('Comment deleted successfully.');
      }
      else{
        res.status(404).send('Comment not found.');
      }
    })
  }
}