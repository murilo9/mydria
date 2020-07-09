import {Request, Response} from "express";
import User from '../models/User';
import validateUserForm from '../middleware/ValidateUserForm';

export default class UserRoutes {

  public routes(app, verifyJWT): void {

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
  }
}