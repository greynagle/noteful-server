const knex = require("knex");
const fixtures = require("./noteful-fixtures");
const app = require("../src/app");
const getAllResponse = require("./files/get-all");

describe("Noteful Endpoints", () => {
    let db;

    before("make knex instance", () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DB_URL,
        });
        app.set("db", db);
    });

    after("disconnect from db", () => db.destroy());

    before("cleanup", () =>
        db.raw("TRUNCATE notes, folders RESTART IDENTITY CASCADE;")
    );

    afterEach("cleanup", () =>
        db.raw("TRUNCATE notes, folders RESTART IDENTITY CASCADE;")
    );

    // describe.only(`Unauthorized requests`, () => {
    //     const testFolder = fixtures.makeFolderArray();

    //     beforeEach("insert folder", () => {
    //         return db.into("folders").insert(testFolder);
    //     });

    //     needs to get folders & notes, post add-folders & add-notes

    //     it(`responds with 401 Unauthorized for GET /folders`, () => {
    //         return supertest(app)
    //             .get("/bookmarks")
    //             .expect(401, { error: "Unauthorized request" });
    //     });

    //     it(`responds with 401 Unauthorized for POST /add-folder`, () => {
    //         return supertest(app)
    //             .post("/bookmarks")
    //             .send({
    //                 title: "test-title",
    //                 url: "http://some.thing.com",
    //                 rating: 1,
    //             })
    //             .expect(401, { error: "Unauthorized request" });
    //     });

    //     it(`responds with 401 Unauthorized for GET /bookmarks/:id`, () => {
    //         const secondBookmark = testFolder[1];
    //         return supertest(app)
    //             .get(`/bookmarks/${secondBookmark.id}`)
    //             .expect(401, { error: "Unauthorized request" });
    //     });

    //     it(`responds with 401 Unauthorized for DELETE /bookmarks/:id`, () => {
    //         const aBookmark = testFolder[1];
    //         return supertest(app)
    //             .delete(`/bookmarks/${aBookmark.id}`)
    //             .expect(401, { error: "Unauthorized request" });
    //     });
    // });

    describe("GET /all", () => {
        context(`Given no notes or folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/all")
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, []);
            });
        });

        context("Given there is data in the database", () => {
            const testFolders = fixtures.makeFolderArray();
            const testNotes = fixtures.makeNoteArray();

            beforeEach("insert folders", () => {
                return db.into("folders").insert(testFolders);
            });

            beforeEach("insert notes", () => {
                return db.into("notes").insert(testNotes);
            });

            it.skip("gets all from the database", () => {
                return supertest(app)
                    .get("/all")
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, getAllResponse);
            });
        });
    });

    describe("POST /add-folder", () => {
        context(`Given no notes or folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/all")
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, []);
            });
        });

        context(`Given data`, () => {
            it(`responds with 400 missing 'name' if not supplied`, () => {
                const newFolder = {
                    // name:'newFolder'
                };
                return supertest(app)
                    .post(`/add-folder`)
                    .send(newFolder)
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(400, `'name' is required`);
            });

            it(`responds with 400 regex error if incorrect format`, () => {
                const newFolder = {
                    name: "new Folder",
                };
                return supertest(app)
                    .post(`/add-folder`)
                    .send(newFolder)
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(400, `'name' must be strictly alphanumeric`);
            });

            it("adds a new folder to the db", () => {
                const newFolder = {
                    name: "newFolder",
                };
                return supertest(app)
                    .post(`/add-folder`)
                    .send(newFolder)
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body.name).to.eql(newFolder.name);
                        expect(res.body).to.have.property("id");
                    });
            });
        });

        // it("removes XSS attack content from response", () => {
        //     const {
        //         maliciousBookmark,
        //         expectedBookmark,
        //     } = fixtures.makeMaliciousBookmark();
        //     return supertest(app)
        //         .post(`/bookmarks`)
        //         .send(maliciousBookmark)
        //         .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        //         .expect(201)
        //         .expect((res) => {
        //             expect(res.body.title).to.eql(expectedBookmark.title);
        //             expect(res.body.description).to.eql(
        //                 expectedBookmark.description
        //             );
        //         });
        // });
    });

    describe.only("POST /add-note", () => {
        context(`Given no notes or folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get("/all")
                    .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, []);
            });
        });
        // TODO, update with note post tests
        it(`responds with 400 missing 'title' if not supplied`, () => {
            const newNote = {
                // title: "new title",
                mode_date: new Date(),
                content: "this is the content",
                folder_id: 1,
            };
            return supertest(app)
                .post(`/add-note`)
                .send(newNote)
                .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                .expect(400, `'title' is required`);
        });

        it(`responds with 400 regex error if incorrect format`, () => {
            const newFolder = {
                name: "new Folder",
            };
            return supertest(app)
                .post(`/add-folder`)
                .send(newFolder)
                .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                .expect(400, `'name' must be strictly alphanumeric`);
        });

        it("adds a new folder to the db", () => {
            const newFolder = {
                name: "newFolder",
            };
            return supertest(app)
                .post(`/add-folder`)
                .send(newFolder)
                .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).to.eql(newFolder.name);
                    expect(res.body).to.have.property("id");
                });
        });
    });

    describe("PATCH folder name", () => {});
    //     context(`Given an XSS attack bookmark`, () => {
    //         const {
    //             maliciousBookmark,
    //             expectedBookmark,
    //         } = fixtures.makeMaliciousBookmark();

    //         beforeEach("insert malicious bookmark", () => {
    //             return db.into("bookmarks").insert([maliciousBookmark]);
    //         });

    //         it("removes XSS attack content", () => {
    //             return supertest(app)
    //                 .get(`/bookmarks`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(200)
    //                 .expect((res) => {
    //                     expect(res.body[0].title).to.eql(
    //                         expectedBookmark.title
    //                     );
    //                     expect(res.body[0].description).to.eql(
    //                         expectedBookmark.description
    //                     );
    //                 });
    //         });
    //     });
    // });

    // describe("GET /bookmarks/:id", () => {
    //     context(`Given no bookmarks`, () => {
    //         it(`responds 404 whe bookmark doesn't exist`, () => {
    //             return supertest(app)
    //                 .get(`/bookmarks/123`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(404, {
    //                     error: { message: `Bookmark Not Found` },
    //                 });
    //         });
    //     });

    //     context("Given there are bookmarks in the database", () => {
    //         const testFolder = fixtures.makeBookmarksArray();

    //         beforeEach("insert bookmarks", () => {
    //             return db.into("bookmarks").insert(testFolder);
    //         });

    //         it("responds with 200 and the specified bookmark", () => {
    //             const bookmarkId = 2;
    //             const expectedBookmark = testFolder[bookmarkId - 1];
    //             return supertest(app)
    //                 .get(`/bookmarks/${bookmarkId}`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(200, expectedBookmark);
    //         });
    //     });

    //     context(`Given an XSS attack bookmark`, () => {
    //         const {
    //             maliciousBookmark,
    //             expectedBookmark,
    //         } = fixtures.makeMaliciousBookmark();

    //         beforeEach("insert malicious bookmark", () => {
    //             return db.into("bookmarks").insert([maliciousBookmark]);
    //         });

    //         it("removes XSS attack content", () => {
    //             return supertest(app)
    //                 .get(`/bookmarks/${maliciousBookmark.id}`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(200)
    //                 .expect((res) => {
    //                     expect(res.body.title).to.eql(expectedBookmark.title);
    //                     expect(res.body.description).to.eql(
    //                         expectedBookmark.description
    //                     );
    //                 });
    //         });
    //     });
    // });

    // describe("DELETE /bookmarks/:id", () => {
    //     context(`Given no bookmarks`, () => {
    //         it(`responds 404 whe bookmark doesn't exist`, () => {
    //             return supertest(app)
    //                 .delete(`/bookmarks/123`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(404, {
    //                     error: { message: `Bookmark Not Found` },
    //                 });
    //         });
    //     });

    //     context("Given there are bookmarks in the database", () => {
    //         const testFolder = fixtures.makeBookmarksArray();

    //         beforeEach("insert bookmarks", () => {
    //             return db.into("bookmarks").insert(testFolder);
    //         });

    //         it("removes the bookmark by ID from the store", () => {
    //             const idToRemove = 2;
    //             const expectedBookmarks = testFolder.filter(
    //                 (bm) => bm.id !== idToRemove
    //             );
    //             return supertest(app)
    //                 .delete(`/bookmarks/${idToRemove}`)
    //                 .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
    //                 .expect(204)
    //                 .then(() =>
    //                     supertest(app)
    //                         .get(`/bookmarks`)
    //                         .set(
    //                             "Authorization",
    //                             `Bearer ${process.env.API_TOKEN}`
    //                         )
    //                         .expect(expectedBookmarks)
    //                 );
    //         });
    //     });
    // });
});
