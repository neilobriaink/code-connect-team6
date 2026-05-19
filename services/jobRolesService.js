const fs = require('fs');
const path = require('path');

class JobRolesService {
    constructor() {
        this.filePath = path.join(__dirname, '..', 'jobRole.json');
    }

    getJobRoles() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading job roles:', err);
            return [];
        }
    }

    createJobRole(name, level, capability, description) {
        const roles = this.getJobRoles();
        const id = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
        const newRole = { id, name, level, capability, description };
        roles.push(newRole);
        fs.writeFileSync(this.filePath, JSON.stringify(roles, null, 2));
        return newRole;
    }
}

module.exports = JobRolesService;