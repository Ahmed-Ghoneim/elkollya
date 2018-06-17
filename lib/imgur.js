const request = require('request');
const keys = require('../config/keys');

function uploadImage(image, callback){

  let url = 'https://api.imgur.com/3/image';

  request({
    method: 'POST',
    url: url,
    headers: {
      Authorization: keys.imgur.accessToken
    },
    form: {image: image.toString('base64')}
  },
  callback
  );
};

function deleteImage(imageLink, callback){

  imageLink = imageLink.replace("https://i.imgur.com/", "");
  imageLink = imageLink.substring(0, imageLink.lastIndexOf("."));

  let url = 'https://api.imgur.com/3/image/' + imageLink;

  request({
    method: 'DELETE',
    url: url,
    headers: {
      Authorization: keys.imgur.accessToken
    },
  },
  callback
  );

};

module.exports.uploadImage = uploadImage;
module.exports.deleteImage = deleteImage;

/*  Method to be implemented later for refreshing the access token when it expires  */

// function refreshAccessToken(callingMethod){
//
//   url: 'https://api.imgur.com/oauth2/token';
//
//   request({
//     method: 'POST',
//     url: url,
//     form: {
//       refresh_token: keys.imgur.refreshToken,
//       client_id: keys.imgur.clientId,
//       client_secret: keys.imgur.clientSecret,
//       grant_type: "refresh_token"
//     }
//   }, function(err, res, body){
//     if(err) throw err;
//
//   });
// };
