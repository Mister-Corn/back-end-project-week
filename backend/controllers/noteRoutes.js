const httpStatus = require('../utils/HTTPStatusCodes');
const { validatePostBody } = require('../utils/controllers/controllerHelpers');

module.exports = (notesModel) => {
  return {
    "GET": (req, res) => {
      notesModel.find()
        .then(notes => {
          res.status(httpStatus.OK).json(notes);
        })
        .catch(error => {
          console.log('noteRoutes--GET ERROR:',error);
          res.status(500).json(error);
        });
    },
    "POST": (req, res) => {
      const newNote = validatePostBody(req.body);

      if (newNote.error) {
        const { status, message } = newNote;
        return res.status(status).json({ message });
      }
      notesModel.create(newNote)
        .then(note => {
          res.status(httpStatus.created).json(note);
        })
        .catch(error => {
          console.log('noteRoutes--POST ERROR:',error);
          res.status(500).json(error);
        });
    },
    "NO_PUT": (req, res) => {
      res.status(httpStatus.notFound).json({ message: "404: Not Found\nA valid note ID was not received with the PUT request. Please ensure the URL includes the ID of the note you wish to update." });
    },
  };
};