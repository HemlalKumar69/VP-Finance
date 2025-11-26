const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String },
  gender: { type: String },
  dob: { type: Date },
  marriageDate: { type: Date },
  mobileNo: { type: String },
  emailId: { type: String },
  panNo: { type: String },
  aadharNo: { type: String },
  presentAddress: { type: String },
  permanentAddress: { type: String },
  homeTown: { type: String },
  familyContactPerson: { type: String },
  familyContactMobile: { type: String },
  emergencyContactPerson: { type: String },
  emergencyContactMobile: { type: String },

  // Official Details
  designation: { type: String },
  employeeCode: { type: String },
  officeMobile: { type: String },
  officeEmail: { type: String },
  password: { type: String },
  allottedLoginId: { type: String },
  confirmPassword: { type: String },
  allocatedWorkArea: { type: String },
  dateOfJoining: { type: Date },
  dateOfTermination: { type: Date },
  salaryOnJoining: { type: Number },
  expenses: { type: String },
  incentives: { type: String },
  officeKit: { type: String },
  offerLetter: { type: String },
  undertaking: { type: String },
  trackRecord: { type: String },
  drawerKeyName: { type: String },
  drawerKeyNumber: { type: String },
  officeKey: { type: String },
  allotmentDate: { type: Date },

  // Bank Details
  bankName: { type: String },
  accountNo: { type: String },
  ifscCode: { type: String },
  micr: { type: String },

  // Alerts
  onFirstJoining: { type: String },
  onSixMonthCompletion: { type: String },
  onTwelveMonthCompletion: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);