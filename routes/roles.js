var express = require('express');
var router = express.Router();

const JobRolesService = require('../services/jobRolesService');
const rolesService = new JobRolesService();

const EmployeeService = require('../services/employeeService');
const employeeService = new EmployeeService();

router.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
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

// Delete a job role and unassign affected employees
router.post('/delete/:id', (req, res) => {
    const deleted = rolesService.deleteJobRole(parseInt(req.params.id));
    if (!deleted) return res.status(404).send('Job role not found');
    employeeService.unassignRole(deleted.name);
    res.redirect('/roles');
});
 

module.exports = router;
