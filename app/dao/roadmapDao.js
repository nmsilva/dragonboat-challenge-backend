const database = require('../config/dbconfig');

/* Load Roadmap entity */
const Roadmap = require('../model/roadmap');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Roadmap Data Access Object
 */
class RoadmapDao {

    constructor() {
        this.common = new daoCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
    findById(id) {
        let sqlRequest = "SELECT id, name, sort FROM roadmap WHERE id=$id";
        let sqlParams = {$id: id};
        
        let sqlProjects = `SELECT * FROM roadmap_project WHERE roadmap_id=${id}`
        let projects = []
        this.common.findAll(sqlProjects).then(projectRows => {
            for (const projectRow of projectRows) {
                projects.push(projectRow.project_id)
            }
        });
        
        return this.common.findOne(sqlRequest, sqlParams).then(row => 
            new Roadmap(row.id, row.name, row.sort, projects));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll() {
        let sqlRequest = "SELECT * FROM roadmap";
        
        const getRows = (rows) => {
            let promises = []
            for (const row of rows) {
                let sqlProjects = `SELECT * FROM roadmap_project WHERE roadmap_id=${row.id}`
                promises.push(this.common.findAll(sqlProjects).then(projectRows => {
                    let projects = []
                    for (const projectRow of projectRows) {
                        projects.push(projectRow.project_id)
                    }
                    return new Roadmap(row.id, row.name, row.sort, projects)
                }));

            }
            
            return Promise.all(promises.map(promise => promise.then(item => {
                return item
            }))).then((results => {
                return results
            }));
            
        }
        
        return this.common.findAll(sqlRequest).then(getRows);
    };
    

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll() {
        let sqlRequest = "SELECT COUNT(*) AS count FROM roadmap";
        return this.common.findOne(sqlRequest);
    };

    /**
     * Updates the given entity in the database
     * @params Roadmap
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(Roadmap) {
        let sqlRequest = "UPDATE roadmap SET " +
            "name=$name, " +
            "sort=$sort " +
            "WHERE id=$id";

        let sqlParams = {
            $name: Roadmap.name,
            $sort: Roadmap.sort,
            $id: Roadmap.id
        };
        
        /*
        for (const project of Roadmap.projects) {
            let sqlProjectsRequest = "INSERT into roadmap_project (roadmap_id, project_id) " +
                "VALUES ($roadmap_id, $project_id)";
            let params = {
                $roadmap_id: Roadmap.id,
                $project_id: project
            };
            this.common.run(sqlProjectsRequest, params).then(done => console.log(done))
        }*/
        
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity in the database
     * @params Roadmap
     * returns database insertion status
     */
    create(Roadmap) {
        let sqlRequest = "INSERT into roadmap (name, sort) " +
            "VALUES ($name, $sort)";
        let sqlParams = {
            $name: Roadmap.name,
            $sort: Roadmap.sort
        };
        
        
        let common = this.common
        return new Promise(function (resolve, reject) {
            let stmt = database.db.prepare(sqlRequest);
            stmt.run(sqlParams, function (err) {
                const projects = Roadmap.projects || [];
                let promises = [];
                for (const project of projects) {
                    let sqlProjectsRequest = "INSERT into roadmap_project (roadmap_id, project_id) " +
                        "VALUES ($roadmap_id, $project_id)";
                    let params = {
                        $roadmap_id: this.lastID,
                        $project_id: project
                    };
                    promises.push(common.run(sqlProjectsRequest, params))
                }
                
                Promise.all(promises).then((results => {
                    resolve(true);
                }));
            })
        });
        
        //this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity with a provided id in the database
     * @params Roadmap
     * returns database insertion status
     */
    createWithId(Roadmap) {
        let sqlRequest = "INSERT into roadmap (name, sort) " +
            "VALUES ($id, $name, $sort)";
        let sqlParams = {
            $id: Roadmap.id,
            $name: Roadmap.name,
            $sort: Roadmap.sort
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params id
     * returns database deletion status
     */
    deleteById(id) {
        let sqlRequest = "DELETE FROM roadmap WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams).then(() => {
            let sqlProjects = `DELETE FROM roadmap_project WHERE roadmap_id=${id}`
            this.common.run(sqlProjects)
        });
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params id
     * returns database entry existence status (true/false)
     */
    exists(id) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM roadmap WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };
    
    /**
     * 
     * 
     * 
     */
    mergeToRoadmap(id, roadmaps) {
        roadmaps = [id, ...roadmaps]
        let promises = []
        for (const roadmap of roadmaps) {
            if (roadmap !== id){
                let sqlDeleteRoadmap = `DELETE FROM roadmap WHERE id=${roadmap}`
                this.common.run(sqlDeleteRoadmap)
            }
                        
            let sqlProjects = `SELECT * FROM roadmap_project WHERE roadmap_id=${roadmap}`
            promises.push(this.common.findAll(sqlProjects).then(projectRows => {
                let projects = []
                for (const projectRow of projectRows) {
                    projects.push(projectRow.project_id)
                }
                return projects
            }));
    
        }
        
        Promise.all(promises.map(promise => promise.then(item => {
            return item
        }))).then((results => {
            
            const projects = [].concat.apply([], results);
            const roadmapsStr = roadmaps.join(); 
            for (const project of projects) {
                let sqlDeleteProjects = `DELETE FROM roadmap_project WHERE project_id=${project} AND roadmap_id IN (${roadmapsStr})`
                this.common.run(sqlDeleteProjects).then(() => {
                    let sqlProjectsRequest = "INSERT into roadmap_project (roadmap_id, project_id) " +
                        "VALUES ($roadmap_id, $project_id)";
                    let params = {
                        $roadmap_id: id,
                        $project_id: project
                    };
                    this.common.run(sqlProjectsRequest, params)
                })
            }
            
        }));  
        
    };
}

module.exports = RoadmapDao;