export default function(text){
  if(typeof text === 'string'){
    while(text.indexOf('  ') > -1){
      text = text.replace('  ', ' ');
    }
    if(text.substring(0, 1) === ' '){
      text = text.substring(1, text.length);
    }
    if(text.substring(text.length - 1) === ' '){
      text = text.substring(0, text.length - 1);
    }
  }
  return text + '';
}