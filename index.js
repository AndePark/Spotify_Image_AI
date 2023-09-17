require('dotenv').config();
const express = require('express');
const querystring = require('querystring');
const app = express();
const axios = require('axios');
const port = 8888;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/', (req, res) => {
  const data = {
    name: 'Brit',
    isAwesome: false,
  };

  res.json(data);
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
  
  const stateKey = 'spotify_auth_state';
  
  // after login is successful, user is redirected to our REDIRECT_URI (http://localhost:8888/callback). With this we will get 
  // a code query param in our /callback URL 
  app.get('/login', (req, res) => {
    // state is a kind of security measure - protects against attacks such as cross-site request forgery 
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    const scope = 'user-read-private user-read-email ugc-image-upload playlist-modify-private playlist-modify-public user-top-read';
  
    const queryParams = querystring.stringify({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      state: state,
      scope: scope,
    });
  
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
  });

  app.get('/callback', (req, res) => {
    // we store the value of our authorization code which we got from the code query param in the code variable
    const code = req.query.code || null;

    // set up the POST request to the https://accounts.spotify.com/api/token url by passing a config object to the axios() method which
    // will send the request when invoked. The .then() and .catch() callback functions handle resolving the promise the axios() method returns
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
    .then(response => {
        if (response.status === 200) {
          // both access_token and token_type are parameters found in the data property of the response object 
          const { access_token, refresh_token, expires_in} = response.data;
          const queryParams = querystring.stringify({
            access_token,
            refresh_token,
            expires_in,
        });
        // we use res.redirect() method to redirect the user to http://localhost:3000 (our React app) with the tokens 
        res.redirect(`http://localhost:3000/?${queryParams}`);
        } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
        }
    })
    .catch(error => {
        res.send(error);
      });
    });

    app.get('/refresh_token', (req, res) => {
        const { refresh_token } = req.query;
      
        axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          },
        })
          .then(response => {
            res.send(response.data);
          })
          .catch(error => {
            res.send(error);
          });
      });

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});