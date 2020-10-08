import {Request, Response} from "express";
import User from '../models/User';

export default async function validateUserForm(req: Request, res: Response, next) {
  console.log('validating user form')
  console.log(req.body)
  let f = req.body;

  //Verifica se todos os campos estão preenchidos:
  let hasAllFields = f.email && f.nickname && f.password && f.passwordAgain;
  if(!hasAllFields){
    console.log('not have all fields');
    res.status(400).send('You must input all fields');
    return;
  }

  //Verifica se as senhas coincidem:
  if(f.password !== f.passwordAgain){
    console.log('passwords did not match');
    res.status(400).send('Your passwords did not match');
    return;
  }

  //Verifica se o nickname possui ao menos 6 caracteres:
  if(f.nickname.length < 6 || f.nickname.length > 24){
    console.log('nickname length unsuitble');
    res.status(400).send('Your nickname must have between 6 and 24 characters');
    return;
  }

  //Verifica se o email é válido: TODO arrumar o regex que não funciona
  /*let emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
  if(!emailRegex.test(f.email)){
    console.log('invalid email');
    res.status(400).send('Invalid e-mail address');
    return;
  }*/

  //Verifica se o email já existe:
  const emailExists = await User.findOne({ email: f.email }).exec();
  if(emailExists){
    console.log('email exists');
    res.status(400).send('E-mail address already registered');
    return;
  }

  //Verifica se o nickname já existe:
  const nicknameExists = await User.findOne({ nickname: f.email }).exec();
  if(emailExists){
    console.log('nickname exists');
    res.status(400).send('Nickname already exists');
    return;
  }

  next();
}
