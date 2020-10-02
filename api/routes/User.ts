import {Request, Response} from "express";
import User from '../models/User';
import validateUserForm from '../middleware/ValidateUserForm';
import Image from "../models/Image";
const path = require('path');
const fs = require('fs');

export default class UserRoutes {

  public routes(app, verifyJWT, upload): void {

    app.route('/users')
    .all((req: Request, res: Response, next) => {
      validateUserForm(req, res, () => { next() })
    })

    //POST em /users - Cria um novo usuário

    .post(async (req: Request, res: Response) => {
      console.log('POST em /users')
      const user = new User(req.body);
      await user.save();
      res.status(201).send();   //201 - Created
    });

    //GET em /user/:nickname - Lê os dados de um usuário

    app.route('/user/:nickname')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .get(async (req: Request, res: Response) => {
      console.log('POST em /user/'+req.params.nickname)
      const nickname = req.params.nickname;
      const user = await User.findOne({ nickname }).populate('following').exec();
      if(user){
        delete user.password;
        res.status(200).send(user);
      }
      else{
        res.status(404).send("User not found");
      }
    })

    //PUT em /user/:nickname -  Atualiza os dados de perfil de um usuário

    .put(async(req, res: Response) => {
      console.log('PUT em /user/'+req.params.nickname)
      const requesterId = req.requesterId;
      const nickname = req.params.nickname;
      let user = await User.findOne({ nickname }).exec();
      console.log(user._id)
      console.log(requesterId)
      if(user._id.toString() === requesterId){
        let bio = req.body.bio;
        let country = req.body.country;
        let city = req.body.city;
        user.bio = bio;
        user.country = country;
        user.city = city;
        await user.save();
        res.status(200).send(user);
      }
      else{
        res.status(403).send('That account is not yours');
      }
    })

    //POST em /follow/userId - Segue um usuário

    app.route('/follow/:userId')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .post(async (req, res: Response) => {
      console.log('POST em /follow/'+req.params.userId)
      const userToFollowId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToFollow = await User.findOne({_id: userToFollowId}).exec();
      if(!userToFollow){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se não é uma request pra seguir a si mesmo:
      if(userToFollowId === req.requesterId){
        res.status(202).send("You can't follow yourself :c");
        return;
      }
      //Verifica se você ja não está seguindo o usuário:
      let alreadyFollowing = false;
      requester.following.forEach(userFollowed => {
        if(userFollowed.toString() === userToFollowId){
          alreadyFollowing = true;
        }
      });
      if(alreadyFollowing){
        res.status(202).send('Already following');
        return;
      }
      else{
        requester.following.push(userToFollowId);
        userToFollow.followedBy.push(req.requesterId);
        await requester.save();
        await userToFollow.save();
        res.status(200).send(requester.following);
      }
    })

    //DELETE em /follow/:userId - Deixa de seguir um usuário

    .delete(async (req, res: Response) => {
      console.log('DELETE em /follow/'+req.params.userId)
      const userToUnfollowId = req.params.userId;
      const requester = await User.findOne({_id: req.requesterId}).exec();
      if(!requester){
        res.status(500).send("Requester not found");
        return;
      }
      const userToUnfollow = await User.findOne({_id: userToUnfollowId}).exec();
      if(!userToUnfollow){
        res.status(404).send("User not found");
        return;
      }
      //Verifica se você está seguindo o usuário:
      let following = -1;
      requester.following.forEach((userFollowing, i) => {
        if(userFollowing.toString() === userToUnfollowId){
          following = i;
        }
      });
      if(following > -1){
        requester.following.splice(following, 1);
        await requester.save();
        //Remove você da lista followedBy do usuário seguido:
        following = -1;
        userToUnfollow.followedBy.forEach((userFollowing, i) => {
          if(userFollowing.toString() === req.requesterId){
            following = i;
          }
        })
        if(following > -1){
          userToUnfollow.followedBy.splice(following, 1);
          userToUnfollow.save();
        }
        else{
          console.log('erro: você não estava na lista followedBy do usuário seguido');
        }
        res.status(200).send(requester.following);
      }
      else{
        res.status(202).send('You are currently not following this person');
      }
    })

    //GET em /image/:id - Retorna uma imagem registrada no banco de dados

    app.get('/image/:id', async(req, res: Response) => {
      console.log('GET em /image/' + req.params.id)
      const imgId = req.params.id;
      let image = await Image.findOne({_id: imgId}).exec();
      if(image){
        let imageName = image._id +  image.extention;
        //VAI MUDAR NO AMBIENTE DE PRODUÇÃO:
        const imagePath = path.resolve(`${__dirname}/../../pictures/${imageName}`);
        console.log(imagePath)
        res.sendFile(imagePath);
      }
      else{
        res.status(404).send('Image id not found.');
      }
    });

    // POST em /images - Posta uma nova imagem

    app.post('/images', verifyJWT, upload.single('file'),  async(req, res: Response) => {
      console.log('POST em /posts')
      /* 
        O middleware de upload ja salvou a imagem e instanciou ela no banco 
        então podemos coletar o id e a extensão de req.
      */
      const requesterId = req.requesterId;
      const imgId = req.imgId;
      const imgExtention = req.imgExtention;
      console.log('imagem: ' + imgId + imgExtention)
      res.status(200).send({ 
        id: imgId,
        ext: imgExtention
      });
    });

    //POST em /profile-pic - Faz upload de uma nova foto de perfil

    app.post('/profile-pic', verifyJWT, upload.single('file'), async (req, res: Response) => {
      console.log('POST em /profile-pic')
      /* 
        O middleware de upload ja salvou a imagem e instanciou ela no banco 
        então podemos coletar o id e a extensão de req.
      */
      const requesterId = req.requesterId;
      const imgId = req.imgId;
      const imgExtention = req.imgExtention;
      console.log('imagem: ' + imgId + imgExtention)
      //Atualiza o atributo profilePicture do usuário:
      const user = await User.findOne({_id: requesterId}).exec();
      if(user){
        user.profilePicture = imgId;
        await user.save();
        res.status(200).send();
      }
      else{
        res.status(404).send('User id not found');
      }
    });

    //POST em /tmp - Faz upload de uma foto temporária nas pasta /tmp

    app.post('/tmp', verifyJWT, upload.single('file'), async(req, res: Response) => {
      console.log('POST em /tmp')
      res.status(200).send({ 
        name: req.requesterId,
        ext: req.imgExtention
      });
      //TODO - tratamento de erros durante o upload
    });

    //GET em /tmp/:id?ext - Coleta a imagem salva no diretório tmp do usuário

    app.get('/tmp/:id', async(req, res: Response) => {
      console.log('GET em /tmp/'+req.params.id+'?ext='+req.query.ext)
      const image = req.params.id;
      const imgExtention = req.query.ext;
      const imageName = image + imgExtention;
      const imagePath = path.resolve(`${__dirname}/../../tmp/${imageName}`);
      console.log(imagePath)
      res.sendFile(imagePath);
    });
  }
}