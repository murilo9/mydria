import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = 'https://mydria-api.herokuapp.com';

/**
 * Verifica se a sessão está ativa.
 * @param {String} token Token de acesso
 * @return { active: Boolean, userData: Object }
 */
const validateSession = async function (token) {
  if (!token) {
    return {
      active: false
    }
  }
  let response = {};
  try {
    const res = await axios({
      url: baseUrl + '/session',
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
const login = async function (email, password) {
  if (!email || !password) {
    return { success: false };
  }
  let loginForm = { email, password };
  let response = {};
  try {
    const res = await axios({
      method: 'post',
      url: baseUrl + '/login',
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
      success: false,
      message: e.response ? e.response.data :
        'An internal error ocurred at our server. Please try again later.'
    }
  }
  return response;
}

const signup = async function (signupForm) {
  let response = {};
  try {
    const res = await axios({
      method: 'post',
      url: baseUrl + '/users',
      data: signupForm
    })
    response = {
      success: true
    }
  }
  catch (e) {
    response = {
      success: false,
      message: e.response.data
    }
  }
  return response;
}

const loadSomePosts = async function () {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      method: 'get',
      url: baseUrl + '/posts/users',
      headers: {
        'x-access-token': token
      }
    })
    response = res.data;
    response.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
  }
  catch (e) {
    response = {
      success: false,
      message: e.response.data
    }
  }
  return response;
}

const publishPost = async function (post) {
  let response = {};
  try {
    const token = Cookies.get('token');
    let headers = {
      'x-access-token': token,
    }
    //Faz a requisição pra instanciar o post
    const res = await axios({
      url: baseUrl + '/posts',
      method: 'post',
      headers,
      data: post
    });
    response = {
      success: true,
      post: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const likePost = async function (postId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}/like`,
      method: 'post',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true,
      post: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const unlikePost = async function (postId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}/unlike`,
      method: 'post',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true,
      post: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const updatePost = async function (updatedPost) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${updatedPost._id}`,
      method: 'put',
      headers: {
        'x-access-token': token
      },
      data: updatedPost
    });
    response = {
      success: true,
      post: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const deletePost = async function (postId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}`,
      method: 'delete',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true,
      post: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const getUserData = async function (nickname) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/user/${nickname}`,
      method: 'get',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true,
      userData: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const getUserPosts = async function (userId) {
  let response = {};
  try {
    const res = await axios({
      url: baseUrl + `/posts/${userId}`,
      method: 'get'
    });
    response = {
      success: true,
      posts: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const followUser = async function (userId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/follow/${userId}`,
      method: 'post',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const unfollowUser = async function (userId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/follow/${userId}`,
      method: 'delete',
      headers: {
        'x-access-token': token
      }
    });
    response = {
      success: true
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const updateUserData = async function (nickname, userData) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/user/${nickname}`,
      method: 'put',
      headers: {
        'x-access-token': token
      },
      data: userData
    });
    response = {
      success: true,
      userData: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const setProfilePicture = async function (nickname, profilePicture) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/user/${nickname}`,
      method: 'put',
      headers: {
        'x-access-token': token
      },
      data: { profilePicture }
    });
    response = {
      success: true
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const setTmpImage = async function() {
  let response = {};
  let formData = new FormData();
  formData.append("tmp", true);
  let imageFile = document.getElementById('post-file');
  formData.append("file", imageFile.files[0])
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/tmp`,
      method: 'post',
      headers: {
        'x-access-token': token,
        'Content-Type': `multipart/form-data; ${formData._boundary}`
      },
      data: formData
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const getPostComments = async function(postId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}/comments`,
      method: 'get',
      headers: {
        'x-access-token': token,
      }
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const publishComment = async function(comment, postId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}/comments`,
      method: 'post',
      headers: {
        'x-access-token': token,
      },
      data: comment
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
} 

const deleteComment = async function(commentId) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/comment/${commentId}`,
      method: 'delete',
      headers: {
        'x-access-token': token,
      }
    });
    response = {
      success: true
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const updateComment = async function(updatedComment) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/comment/${updatedComment._id}`,
      method: 'put',
      headers: {
        'x-access-token': token,
      },
      data: updatedComment
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const sharePost = async function(postId, text = '', tags = []) {
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}/share`,
      method: 'post',
      headers: {
        'x-access-token': token,
      },
      data: {
        text,
        tags
      }
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const getNotifications = async function(){
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/notifications`,
      method: 'get',
      headers: {
        'x-access-token': token,
      },
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const loadPostData = async function(postId){
  let response = {};
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/post/${postId}`,
      method: 'get',
      headers: {
        'x-access-token': token,
      },
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const search = async function(query){
  let response = {}
  try {
    const token = Cookies.get('token');
    const res = await axios({
      url: baseUrl + `/posts${query}`,
      method: 'get',
      headers: {
        'x-access-token': token,
      },
    });
    response = {
      success: true,
      data: res.data
    }
  }
  catch (e) {
    response = {
      success: false,
      error: e.response
    }
  }
  return response;
}

const resolveImageUrl = function(imageId) {
  return imageId ? baseUrl + `/image/${imageId}` : '/assets/user.svg';
}

const getTmpImageUrl = function(name, ext) {
  return baseUrl + `/tmp/${name}?ext=${ext}`;
}

export default {
  validateSession,
  login,
  signup,
  loadSomePosts,
  publishPost,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  getUserData,
  getUserPosts,
  followUser,
  unfollowUser,
  updateUserData,
  setProfilePicture,
  resolveImageUrl,
  setTmpImage,
  getTmpImageUrl,
  getPostComments,
  publishComment,
  deleteComment,
  updateComment,
  sharePost,
  getNotifications,
  loadPostData,
  search
}