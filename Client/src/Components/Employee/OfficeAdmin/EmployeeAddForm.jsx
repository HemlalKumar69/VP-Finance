import React, { useState } from "react";
import { Form, Row, Col, Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createEmployee } from "../../../redux/feature/Employee/EmployeeThunk";

const EmployeeAddForm = () => {
  const dispatch = useDispatch();

  const initial = {
    // Personal
    name: "",
    gender: "",
    dob: "",
    marriageDate: "",
    mobileNo: "",
    emailId: "",
    panNo: "",
    aadharNo: "",
    presentAddress: "",
    permanentAddress: "",
    homeTown: "",
    familyContactPerson: "",
    familyContactMobile: "",
    emergencyContactPerson: "",
    emergencyContactMobile: "",

    // Official
    designation: "",
    employeeCode: "",
    officeMobile: "",
    officeEmail: "",
    password: "",
    confirmPassword: "",
    allottedLoginId: "",
    allocatedWorkArea: "",
    dateOfJoining: "",
    dateOfTermination: "",
    salaryOnJoining: "",
    expenses: "",
    incentives: "",
    officeKit: "",
    offerLetter: "",
    undertaking: "",
    trackRecord: "",
    drawerKeyName: "",
    drawerKeyNumber: "",
    officeKey: "",
    allotmentDate: "",

    // Bank
    bankName: "",
    accountNo: "",
    ifscCode: "",
    micr: "",

    // Alerts
    onFirstJoining: "",
    onSixMonthCompletion: "",
    onTwelveMonthCompletion: "",
  };

  const [formData, setFormData] = useState(initial);
  const [key, setKey] = useState("personal");
  const [loading, setLoading] = useState(false);

  // const mandatoryFields = ['name',];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log(" FORM DATA :", formData);
      
      // Await use karein taki API call complete ho
      const result = await dispatch(createEmployee(formData)).unwrap();
      
      console.log("API RESPONSE:", result);
      alert("Employee added successfully!");
      setFormData(initial);
      setKey("personal");
    } catch (error) {
      console.error(" ERROR:", error);
      alert(`Error adding employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (fields) =>
    fields.map((field, i) => (
      <Col md={4} key={i}>
        <Form.Group className="mb-3">
          <Form.Label>{field.label}</Form.Label>
          <Form.Control
            type={field.type || "text"}
            as={field.as}
            rows={field.rows}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            disabled={loading}
          />
        </Form.Group>
      </Col>
    ));

  return (
    <Form className="p-4 border rounded bg-light" onSubmit={handleSaveEmployee}>
      <h4 className="mb-4">Add New Employee</h4>

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        {/* PERSONAL DETAILS */}
        <Tab eventKey="personal" title="Personal Details">
          <Row>
            {renderFields([
              { label: "Name", name: "name" },
              { label: "Gender", name: "gender" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Marriage Date", name: "marriageDate", type: "date" },
              { label: "Mobile No", name: "mobileNo" },
              { label: "Email ID", name: "emailId", type: "email" },
              { label: "PAN No", name: "panNo" },
              { label: "Aadhar No", name: "aadharNo" },
              { label: "Present Address", name: "presentAddress" },
              { label: "Permanent Address", name: "permanentAddress" },
              { label: "Home Town", name: "homeTown" },
              { label: "Family Contact Person", name: "familyContactPerson" },
              { label: "Family Contact Mobile", name: "familyContactMobile" },
              { label: "Emergency Contact Person", name: "emergencyContactPerson" },
              { label: "Emergency Contact Mobile", name: "emergencyContactMobile" },
            ])}
          </Row>
        </Tab>

        {/* OFFICIAL DETAILS */}
        <Tab eventKey="official" title="Official Details">
          <Row>
            {renderFields([
              { label: "Designation", name: "designation" },
              { label: "Employee Code", name: "employeeCode" },
              { label: "Office Mobile", name: "officeMobile" },
              { label: "Office Email", name: "officeEmail", type: "email" },
              { label: "Allotted Login ID", name: "allottedLoginId" },
              { label: "Password", name: "password", type: "password" },
              { label: "Confirm Password", name: "confirmPassword", type: "password" },
              { label: "Allocated Work Area", name: "allocatedWorkArea" },
              { label: "Date of Joining", name: "dateOfJoining", type: "date" },
              { label: "Date of Termination", name: "dateOfTermination", type: "date" },
              { label: "Salary On Joining", name: "salaryOnJoining" },
              { label: "Expenses", name: "expenses" },
              { label: "Incentives", name: "incentives" },
              { label: "Office Kit", name: "officeKit" },
              { label: "Offer Letter", name: "offerLetter" },
              { label: "Undertaking", name: "undertaking" },
              { label: "Track Record", name: "trackRecord" },
              { label: "Drawer Key Name", name: "drawerKeyName" },
              { label: "Drawer Key Number", name: "drawerKeyNumber" },
              { label: "Office Key", name: "officeKey" },
              { label: "Allotment Date", name: "allotmentDate", type: "date" },
            ])}
          </Row>
        </Tab>

        {/* BANK DETAILS */}
        <Tab eventKey="bank" title="Bank Details">
          <Row>
            {renderFields([
              { label: "Bank Name", name: "bankName" },
              { label: "Account Number", name: "accountNo" },
              { label: "IFSC Code", name: "ifscCode" },
              { label: "MICR", name: "micr" },
            ])}
          </Row>
        </Tab>

        {/* ALERTS */}
        <Tab eventKey="alerts" title="Alerts / Messages">
          <Row>
            {renderFields([
              { label: "On First Joining", name: "onFirstJoining", as: "textarea", rows: 2 },
              { label: "On Six Month Completion", name: "onSixMonthCompletion", as: "textarea", rows: 2 },
              { label: "On Twelve Month Completion", name: "onTwelveMonthCompletion", as: "textarea", rows: 2 },
            ])}
          </Row>
        </Tab>
      </Tabs>

      <div className="text-end mt-3">
        <Button 
          type="submit" 
          style={{ backgroundColor: "#2B3A4A" }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Form>
  );
};

export default EmployeeAddForm;