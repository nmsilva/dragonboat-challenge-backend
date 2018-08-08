/**
 * Roadmap Entity (ES6 Class)
 */

class Roadmap {
    constructor(id, name, sort, projects = []) {
        this.id = id;
        this.name = name;
        this.sort = sort;
        this.projects = projects;
    }
}

module.exports = Roadmap;