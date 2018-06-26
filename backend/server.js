// Packages
const express = require('express');

module.exports = (usersModel, notesModel) => {
  // Dependencies
  const noteRoutes = require('./controllers/noteRoutes')(notesModel);
  const noteIdRoutes = require('./controllers/noteIdRoutes')(notesModel);
  const userRoutes = require('./controllers/userRoutes')(usersModel);
  const useMiddlewareQueue = require('./utils/server/middleware');
  // Definitions
  const server = express();
  const httpStatusCodeOK = 200;

  useMiddlewareQueue(server);

  server.route('/')
    .get((req, res) => {
      res.status(httpStatusCodeOK).json({ message: "API is running!" });
    });

  server.route('/register')
    .post(userRoutes.REGISTER);
  
  server.route('/login')
    .post(userRoutes.LOGIN);
  
  server.route('/notes')
    //Notes route are protected. An authentication middleware that checks for JWT should exist.
    .get(noteRoutes.GET)
    .post(noteRoutes.POST)
    .put(noteRoutes.NO_PUT);

  server.route('/notes/:id')
    .get(noteIdRoutes.GET_ONE_BY_ID)
    .put(noteIdRoutes.PUT)
    .delete(noteIdRoutes.DELETE);
  
  return server;
};

