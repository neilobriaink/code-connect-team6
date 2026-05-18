const fs = require('fs');

class EmployeeService {
    constructor() {
        this.filePath = 'employees.json';
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
}

module.exports = EmployeeService;
