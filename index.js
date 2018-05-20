const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const genres = [];

app.get('/api/genres', (req, res) => {
    //Just return a 200 status code Response (Ok) with the Genres list
    res.status(200).send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    // First I have to check if there is a genre with the specified Id
    // If it does not exist, the API should return 404 status code (Not Found)
    const genre = genres.find(g => g.id == req.params.id);

    if (!genre) return res.status(404).send('Genre was not found!');

    //Then it can return a 200 status code Response, with the found object
    res.status(200).send(genre);
});

app.post('/api/genres', (req, res) => {
    // First, I have to check if the Request body contains a valid Genre
    // If it is invalid, it should return a 400 status code (Bad Request)
    const { error } = isGenreValid(req.body);

    if (error) 
        return res.status(400).send(error.details[0].message);

    // Just return a 201 status code Response (Created) containing the created object.
    const genre = {
        id: genres.length+1,
        name: req.body.name
    };

    genres.push(genre);

    res.status(201).send(genre);
});

app.put('/api/genres/:id', (req, res) =>  {
    // First I have to check if there is a genre with the specified Id
    // If it does not exist, the API should return 404 status code (Not Found)
    const genre = genres.find(g => g.id == parseInt(req.params.id));

    if (!genre) return res.status(404).send('Genre was not found!');

    //Then we should check if the Request body object is valid. For that I use Joi, as 
    // I did before for POST request. If it is not valid, the API should return 400 status code (Bad Request)
    const { error } = isGenreValid(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Finally I can change the genre and return a 200 status code Response, with the updated object
    genre.name = req.body.name;

    res.status(200).send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    // First we have to check if there is a genre with the specified Id
    // If it does not exist, the API should return 404 status code (Not Found)
    const genre = genres.find(g => g.id == parseInt(req.params.id));

    if (!genre) return res.status(404).send('Genre was not found!');

    //Just remove the element from the list and return a 200 status code Response (Ok)
    // containing the removed object. You could also return a 204 status code Response (No Content)
    // without any content in the response.

    genres.splice(genres.indexOf(genre), 1);
    res.status(200).send(genre);
});

// I use Joi package for validating an object. If there is any error, the error property
// will not be null.
function isGenreValid(genre){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

// If there is a PORT environment variable, it would use it as the API port
// If not, just use 3000
const port = process.env.PORT || 3000;
//Start listening for requests
app.listen(port, () => console.log(`Listening on port ${port}`));