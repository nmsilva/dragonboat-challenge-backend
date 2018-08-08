/* Load modules */
let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
let db = new sqlite3.Database('./sqlite.db');

/* Init car and driver tables if they don't exist */
let init = function () {
    db.run("CREATE TABLE if not exists roadmap (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " name TEXT," +
        " sort INT" +
        ")");

    db.run("CREATE TABLE if not exists project (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " name TEXT," +
        " sort INT" +
        ")");
        
    db.run("CREATE TABLE if not exists roadmap_project (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " roadmap_id INT," +
        " project_id INT" +
        ")");
};

module.exports = {
    init: init,
    db: db
};

