/* Load Project entity */
const Project = require('../model/project');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Project Data Access Object
 */
class ProjectDao {

    constructor() {
        this.common = new daoCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
    findById(id) {
        let sqlRequest = "SELECT id, name, sort FROM project WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.findOne(sqlRequest, sqlParams).then(row =>
            new Project(row.id, row.name, row.sort));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll() {
        let sqlRequest = "SELECT * FROM project";
        return this.common.findAll(sqlRequest).then(rows => {
            let results = [];
            for (const row of rows) {
                results.push(new Project(row.id, row.name, row.sort));
            }
            return results;
        });
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll() {
        let sqlRequest = "SELECT COUNT(*) AS count FROM project";
        return this.common.findOne(sqlRequest);
    };

    /**
     * Updates the given entity in the database
     * @params Project
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(Project) {
        let sqlRequest = "UPDATE project SET " +
            "name=$name, " +
            "sort=$sort " +
            "WHERE id=$id";

        let sqlParams = {
            $name: Project.name,
            $sort: Project.sort,
            $id: Project.id
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity in the database
     * @params Project
     * returns database insertion status
     */
    create(Project) {
        let sqlRequest = "INSERT into project (name, sort) " +
            "VALUES ($name, $sort)";
        let sqlParams = {
            $name: Project.name,
            $sort: Project.sort
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity with a provided in the database
     * @params Project
     * returns database insertion status
     */
    createWithId(Project) {
        let sqlRequest = "INSERT into project (id, name, sort) " +
            "VALUES ($id, $name, $sort)";
        let sqlParams = {
            $id: Project.id,
            $name: Project.name,
            $sort: Project.sort
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params id
     * returns database deletion status
     */
    deleteById(id) {
        let sqlRequest = "DELETE FROM project WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params id
     * returns database entry existence status (true/false)
     */
    exists(id) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM project WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.existsOne(sqlRequest, sqlParams);
    };
}

module.exports = ProjectDao;