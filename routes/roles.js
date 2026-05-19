var express = require('express');
var router = express.Router();

const JobRolesService = require('../services/jobRolesService');
const rolesService = new JobRolesService();

router.get('/', (req, res) => {
    const roles = rolesService.getJobRoles();
    res.render('jobRolesList', { roles });
});

router.get('/job-role', (req, res) => {
    res.render('addJobRole');
});

router.post('/job-role', (req, res) => {
    const { name, level, capability, description } = req.body;
    rolesService.createJobRole(name, level, capability, description);
    res.redirect('/roles');
});

module.exports = router;
