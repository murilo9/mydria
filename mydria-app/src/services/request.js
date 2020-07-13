import axios from 'axios';

/**
 * Verifica se a sessão está ativa.
 * @param {String} token Token de acesso
 * @return { active: Boolean, userData: Object }
 */
const validateSession = async function(token) {
  if(!token){
    return {
      active: false
    }
  }
  let response = {};
  try {
    const res = await axios({
      url: 'http://localhost:8888/session',
      method: 'get',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      active: true,
      userData: res.data
    }
  }
  catch (e) {
    response = {
      active: false
    }
  }
  return response;
}

/**
 * @desc Faz uma request ao servidor para realizar login com o email e password inseridos.
 * @param {String} email 
 * @param {String} password 
 * @return {success: Boolen, token: String, userId: String}
 */
const login = async function(email, password) {
  if(!email || ! password) {
    return { success: false };
  }
  let loginForm = { email, password };
  let response = {};
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:8888/login',
      data: loginForm
    })
    response = {
      success: true,
      token: res.data.token,
      userId: res.data.userId
    }
  }
  catch (e) {
    response = {
      success: false
    }
  }
  return response;
}

export default {
  validateSession,
  login
}