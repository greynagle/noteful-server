const NotefulService = {
    getAll(knex) {
        return knex
            .raw(
                `select n.id as note_id, n.name, n.mod_date as modified, n."content", n.folder_id, f."name" as folder_name from notes n join folders f on f.id = n.folder_id` 
            )
            .then((rows) => {
                return rows;
            });
    },
	getFolderAll(knex) {
		return knex
			.raw(
				`select * from folders`
			)
			.then((rows) => {
				return rows
			})
	},
	getNoteAll(knex) {
		return knex
			.raw(
				`select n.id, n.name, n.mod_date, n."content", f."name" as folder_name from notes n join folders f on f.id = n.folder_id`
			)
			.then((rows) => {
				return rows
			})
	},
    getNoteById(knex, id) {
        return knex.from("notes").select("*").where({ id }).first();
    },
    getFolderById(knex, id) {
        return knex.from("folders").select("*").where({ id }).first();
    },
    addNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into("notes")
            .returning("*")
            .then((rows) => {
                return rows[0];
            });
    },
    addFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into("folders")
            .returning("*")
            .then((rows) => {
                return rows[0];
            });
    },
    updateNote(knex, id, newNoteFields) {
        return knex("notes").where({ id }).update(newNoteFields);
    },
    updateFolder(knex, id, newFolderFields) {
        return knex("folders").where({ id }).update(newFolderFields);
    },
    deleteNote(knex, id) {
        return knex("notes").where({ id }).delete();
    },
    deleteFolder(knex, id) {
        return knex("notes")
            .where((folder_id = id))
            .delete()
            .then(() => {
                return knex("folders").where({ id }).delete();
            })
    },
};

module.exports = NotefulService;
