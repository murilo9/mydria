import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBe4cuIOIr7bqC0MTDIMLTHNZx-EaxdUQw",
  authDomain: "teste-784ee.firebaseapp.com",
  databaseURL: "https://teste-784ee.firebaseio.com",
  projectId: "teste-784ee",
  storageBucket: "teste-784ee.appspot.com",
  messagingSenderId: "232439",
  appId: "teste",
}
export const firebaseImpl = firebase.initializeApp(firebaseConfig);
export const firebaseStorage = firebase.storage();
export const firebaseAuth = firebase.auth();

/**
 * Gera um nome úico para a imagem.
 */
const getName = function (){
  let date = new Date();
  return 'file-'+date.getTime();
}

/**
 * 
 * @param {string} userId 
 * @param {File} file 
 */
export const setTmpImage = async function(userId, file){
  const ext = file.name.split('.').pop();
  const imageRef = firebaseStorage.ref('images/'+userId+'/tmp.'+ext);
  const req = await imageRef.put(file);
  return ext;
}

/**
 * Faz upload de uma foto para /images/:userId/:file
 * @param {string} userId 
 * @param {File} file 
 */
export const uploadImage = async function(userId, file){
  const name = getName();
  const ext = file.name.split('.').pop();
  const imageRef = firebaseStorage.ref('images/'+userId+'/'+name+'.'+ext);
  const req = await imageRef.put(file);
  return name+'.'+ext;
}

export const getTmpUrl = async function(userId, ext){
  const imageRef = firebaseStorage.ref('images/'+userId+'/tmp.'+ext);
  const url = await imageRef.getDownloadURL();
  return url;
}

export const getImgUrl = async function(userId, img){
  const imageRef = firebaseStorage.ref('images/'+userId+'/'+img);
  const url = await imageRef.getDownloadURL();
  return url;
}