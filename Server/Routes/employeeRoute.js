const express = require("express");
const { addEmployee, updateEmployee, getEmployeeById, getAllEmployees, deleteEmployee } = require("../Controller/employeeController");

const router = express.Router();

router.post("/addEmployee",addEmployee);

router.put("/updateEmployee",updateEmployee);

router.get("/getEmployeeById",getEmployeeById);

router.get("/getAllEmployees",getAllEmployees);

router.delete("/deleteEmployee",deleteEmployee);


module.exports = router;