import {Request, Response} from "express";
import User from '../models/User';
import jwt = require('jsonwebtoken');

export default class LoginRoutes {

  public routes(app, verifyJWT): void {

    app.route('/login')

    //POST em /login - Realiza login e retorna um token de acesso

    .post(async (req: Request, res: Response) => {
      console.log('POST em /login')
      const email = req.body.email;
      const password = req.body.password;
      User.findOne({ email, password }, function (err, user) {
        if(err){
          console.log(err)
          res.status(500).send(err);
        }
        else{
          if(user){   //Caso o usuário exista
            const id = user._id;
            const token = jwt.sign({ id }, process.env.SECRET, {
              expiresIn: 3600   //Session expira em 1 hora
            });
            res.status(200).send({ auth: true, token: token, userId: id });
          }
          else{   //Caso o usuário seja inválido
            res.status(400).send('Invalid e-mail or password');
          }
        }
      });
    })

    //GET em /session - Verifica se o token de acesso e o userId correspondem e
    //a session ainda está ativa. Retorna os dados do usuário.

    app.route('/session')
    .all((req: Request, res: Response, next) => {
      verifyJWT(req, res, () => { next() })
    })

    .get(async (req, res: Response) => {
      console.log('GET em /session')
      const user = await User.findOne({ _id: req.requesterId })
      .populate('following').populate('followedBy').exec();
      if(user){
        res.status(200).send(user);
      }
      else{
        res.status(400).send('User with that ID was not found.');
      }
    })
  }
}