const express = require("express");
const { isWebUri } = require("valid-url");
const xss = require("xss");
const logger = require("../logger");
const NotefulService = require("./noteful-service");

const notefulRouter = express.Router();
const bodyParser = express.json();

const serializeFolder = (folder) => ({
    id: folder.id,
    name: xss(folder.name),
});

const serializeNote = (note) => ({
    id: note.id,
    name: xss(note.name),
    mod_date: note.mod_date,
    content: xss(note.content),
    folder_id: Number(note.folder_id),
});

// gets all data
notefulRouter.route("/all").get((req, res, next) => {
    NotefulService.getAll(req.app.get("db"))
        .then((data) => {
            res.json(data.rows);
        })
        .catch(next);
});

// route for posting to make new folders
notefulRouter.route("/folders").post(bodyParser, (req, res, next) => {
    for (const field of ["name"]) {
        if (!req.body[field]) {
            logger.error(`${field} is required`);
            return res.status(400).send(`'${field}' is required`);
        }
    }
    // must be alphanumeric
    for (const field of ["name"]) {
        if (/\W/.test(req.body[field])) {
            logger.error(`${field} must be strictly alphanumeric`);
            return res
                .status(400)
                .send(`'${field}' must be strictly alphanumeric`);
        }
    }

    const { name } = req.body;

    const newFolder = { name };

    NotefulService.addFolder(req.app.get("db"), newFolder)
        .then((folder) => {
            logger.info(`folder with id ${folder.id} created.`);
            res.status(201)
                .location(`/folder/${folder.id}`)
                .json(serializeFolder(folder));
        })
        .catch(next);
});

// route for posting new notes
notefulRouter.route("/notes")
	.post(bodyParser, (req, res, next) => {
        // if a field is empty
        for (const field of ["title", "mod_date", "content", "folder_id"]) {
            if (!req.body[field]) {
                logger.error(`${field} is required`);
                return res.status(400).send(`'${field}' is required`);
            }
        }

        // The title must be alphanumeric
        for (const field of ["title"]) {
            if (/\W/.test(req.body[field])) {
                logger.error(
                    `${field} must be strictly alphanumeric and 16 char or less`
                );
                return res
                    .status(400)
                    .send(
                        `'${field}' must be strictly alphanumeric and 16 char or less`
                    );
            }
        }

        for (const field of ["content"]) {
            if (/[^a-zA-Z0-9.,;:()-\s]/.test(req.body[field])) {
                logger.error(
                    `${field} must be alphanumeric or certain characters`
                );
                return res
                    .status(400)
                    .send(
                        `'${field}' must be alphanumeric or certain characters`
                    );
            }
        }

        const { title, mod_date, content, folder_id } = req.body;

        const newNote = { title, mod_date, content, folder_id };

        NotefulService.addNote(req.app.get("db"), newNote)
            .then((note) => {
                logger.info(`Note with id ${note.id} created.`);
                res.status(201)
                    .location(`/note/${note.id}`)
                    .json(serializeNote(note));
            })
            .catch(next);
    });

// add folder path
// notefulRouter
//     .route("/add-folder")

//     // Cannot be: empty, longer than 16 characters, or non-alphanumeric
//     // TODO: modify the post portion
//     .post(bodyParser, (req, res, next) => {
//         for (const field of ["name"]) {
//             if (!req.body[field]) {
//                 logger.error(`${field} is required`);
//                 return res.status(400).send(`'${field}' is required`);
//             }
//         }
//         // must be alphanumeric
//         for (const field of ["name"]) {
//             if (/\W/.test(req.body[field])) {
//                 logger.error(`${field} must be strictly alphanumeric`);
//                 return res
//                     .status(400)
//                     .send(`'${field}' must be strictly alphanumeric`);
//             }
//         }

//         const { name } = req.body;

//         const newFolder = { name };

//         NotefulService.addFolder(req.app.get("db"), newFolder)
//             .then((folder) => {
//                 logger.info(`folder with id ${folder.id} created.`);
//                 res.status(201)
//                     .location(`/folder/${folder.id}`)
//                     .json(serializeFolder(folder));
//             })
//             .catch(next);
//     });

// add-note path
notefulRouter
    .route("/add-note")

    // Cannot be: empty, longer than 16 characters, or non-alphanumeric
    // TODO: modify the post portion
    

// patching and deleting folders
notefulRouter
    .route("/folder/:folder_id")
    .all((req, res, next) => {
        const { folder_id } = req.params;
        NotefulService.getFolderById(req.app.get("db"), folder_id)
            .then((folder) => {
                if (!folder) {
                    logger.error(`Folder with id ${folder_id} not found.`);
                    return res.status(404).json({
                        error: { message: `Folder Not Found` },
                    });
                }
                res.folder = folder;
                next();
            })
            .catch(next);
    })

    .patch(bodyParser, (req, res, next) => {
        const { name } = req.body;
        const folderToUpdate = { name };

        const numberOfValues = Object.values(folderToUpdate).filter(Boolean)
            .length;
        if (numberOfValues === 0) {
            logger.error(`Invalid update without required fields`);
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'name'`,
                },
            });
        }

        NotefulService.updateFolder(
            req.app.get("db"),
            req.params.folder_id,
            folderToUpdate
        )
            .then((numRowsAffected) => {
                res.status(204).end();
            })
            .catch(next);
    })

    // don't know if I need a delete path for folders, keeping in case
    .delete((req, res, next) => {
        const { folder_id } = req.params;
        NotefulService.deleteFolder(req.app.get("db"), folder_id)
            .then((numRowsAffected) => {
                logger.info(
                    `Folder and associated notes with id ${folder_id} deleted.`
                );
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = notefulRouter;
