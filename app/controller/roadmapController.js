/* Load Roadmap Data Access Object */
const RoadmapDao = require('../dao/roadmapDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Roadmap entity */
const Roadmap = require('../model/roadmap');

/**
 * Roadmap Controller
 */
class RoadmapController {

    constructor() {
        this.roadmapDao = new RoadmapDao();
        this.common = new ControllerCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params req, res
     * @return entity
     */
    findById(req, res) {
        let id = req.params.id;

        this.roadmapDao.findById(id)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll(res) {
        this.roadmapDao.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll(res) {

        this.roadmapDao.countAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(req, res) {
        let roadmap = new Roadmap();
        roadmap.id = req.body.id;
        roadmap.name = req.body.name;
        roadmap.sort = req.body.sort;
        roadmap.projects = req.body.projects;

        return this.roadmapDao.update(roadmap)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Creates the given entity in the database
     * @params req, res
     * returns database insertion status
     */
    create(req, res) {
        let roadmap = new Roadmap();
        if (req.body.id) {
            roadmap.id = req.body.id;
        }
        roadmap.name = req.body.name;
        roadmap.sort = req.body.sort;
        roadmap.projects = req.body.projects;

        if (req.body.id) {
            return this.roadmapDao.createWithId(roadmap)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }
        else {
            return this.roadmapDao.create(roadmap)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }

    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params req, res
     * returns database deletion status
     */
    deleteById(req, res) {
        let id = req.params.id;

        this.roadmapDao.deleteById(id)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
    exists(req, res) {
        let id = req.params.id;

        this.roadmapDao.exists(id)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
    
    mergeToRoadmap(req, res) {
        let id = req.params.id;
        
        let roadmaps = req.body.roadmaps;
        
        this.roadmapDao.mergeToRoadmap(id, roadmaps);
        
        res.status(204);
        res.json({});
    }
}

module.exports = RoadmapController;