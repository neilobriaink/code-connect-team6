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

    getEmployeeByNumber(employeeNumber) {
        const employees = this.getEmployees();
        return employees.find(emp => emp.employeeNumber === employeeNumber);
    }

    updateEmployee(employeeNumber, updatedData) {
        const employees = this.getEmployees();
        const index = employees.findIndex(emp => emp.employeeNumber === employeeNumber);
        if (index === -1) return null;

        employees[index] = {
            employeeNumber: employeeNumber,
            name: updatedData.name,
            address: updatedData.address,
            salary: parseFloat(updatedData.salary),
            role: updatedData.role
        };
        fs.writeFileSync(this.filePath, JSON.stringify(employees, null, 2), 'utf8');
        return employees[index];
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
    try {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const employees = JSON.parse(data);

        return employees.find(employee => employee.id == id) || null;
    } catch (error) {
        console.error('Could not find employee: ', error);
        return null;
    }
}

    deleteEmployee(id) {
        const employees = this.getEmployees();
        const index = employees.findIndex(employee => employee.id === id);
        if (index === -1) return null;

        const deleted = employees.splice(index, 1)[0];
        this.writeEmployees(employees);
        return deleted;
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
