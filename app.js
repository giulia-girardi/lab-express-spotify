require('dotenv').config();

const express = require('express');
const ejs = require('ejs')
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser')


const app = express();
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req,res)=> {
    res.render('index')
})

/* app.get('/artist-search', (req, res)=> {
    const {artistName} = req.query;
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            //console.log(data.body.artists.items)
            const artistArray =  data.body.artists.items
            console.log(artistArray)
            res.render('artist-search-result', {artistArray})

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
            console.log(artistName)
})  */



app.get('/artist-search', async (req, res)=> {
    const {artistName} = req.query;
    const listOfArtists = await spotifyApi.searchArtists(artistName)
    console.log('The received data from the API: ', listOfArtists.body.artists.items);
    const artistArray =  listOfArtists.body.artists.items
    console.log(artistArray) 
    res.render('artist-search-result', {artistArray})
})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
