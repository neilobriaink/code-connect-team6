const fs = require('fs');
const path = require('path');

class EmployeeService {
    constructor() {
        this.filePath = path.join(__dirname, '..', 'employees.json');
    }

    getEmployees() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading employees:', err);
            return [];
        }
    }

    // Helper function to write users to JSON file
     writeEmployees(employees) {
        try {
              fs.writeFileSync(this.filePath, JSON.stringify(employees, null, 2), 'utf8');
         } catch (err) {
            console.error('Error writing employees:', err);
         }
     }

    // Get all employees
    getAllEmployees() {
        return this.getEmployees();
    }

    // Get a user by ID
    getEmployeeById(id) {
        const employees = this.getEmployees();
        return employees.find(employee => employee.id === id);
    }

    // Create a new user
    createEmployee(newEmployee) {
    const employees = this.getEmployees();

    const nextId = employees.length ? employees[employees.length - 1].id + 1 : 1;

    newEmployee.id = nextId;
    newEmployee.employeeNumber = String(nextId).padStart(5, '0'); // e.g. "001"

    employees.push(newEmployee);
    this.writeEmployees(employees);

    return newEmployee;
    }
}

module.exports = EmployeeService;
