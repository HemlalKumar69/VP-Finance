const employeeModel = require("../Models/employeeModel");

exports.addEmployee = async (req, res) => {
  try {
     const employeeData = req.body;

   console.log("Fetch data from frontend",employeeData);
       console.log("official details:", {
          designation: employeeData.designation,
          employeeCode: employeeData.employeeCode,
          officeMobile: employeeData.officeMobile
       });
       console.log( "Bank details",{
        bankName: employeeData.bankName,
        accountNo: employeeData.accountNo

       });

    // if (!employeeData.name || !employeeData.emailId) {
    //   return res.status(400).json({
    //     success:false, 
    
    //     message: "Name and Email are required" });
    // }

    // const newEmployee = new employeeModel(employeeData);
    // await newEmployee.save();

    const newEmployee = new employeeModel(employeeData);
    await newEmployee.save();

    res.status(201).json({
      success:true,  
      message: "Employee added successfully",
       data: newEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Error adding employee",
      error: error.message,
    });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const updates = req.body;

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    
    const updatedEmployee = await employeeModel.findByIdAndUpdate(employeeId, updates, {
      new: true,         
      runValidators: true, 
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message,
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "employeeId is required" });
    }

    const employee = await employeeModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      data:employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message,
    });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "employeeId is required" });
    }

    const employee = await employeeModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await employeeModel.findByIdAndDelete(employeeId);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully 🗑️",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};



exports.getAllEmployees = async (req, res) => {
  try {
  
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

   
    const { department, role, search } = req.query;

   
    const filter = {};
    if (department) filter.department = department;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await employeeModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    const totalEmployees = await employeeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data:employees,
      totalEmployees,
      totalPages,
      currentPage:page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};
