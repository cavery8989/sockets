function getQueryVal(key){
  var querys = window.location.search.substring(1).split('&');
  for(var i = 0; i <  querys.length; i++){
    var pair = querys[i].split('=');
    if(decodeURIComponent(pair[0]) === key){
      return decodeURIComponent(pair[1]).replace(/\+/g, ' ');
    }
  }
  return null;
}
