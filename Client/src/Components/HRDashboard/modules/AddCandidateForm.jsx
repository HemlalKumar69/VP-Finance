// components/HRDashboard/modules/AddCandidateForm.jsx
import React, { useState, useEffect } from 'react';

const AddCandidateForm = ({ onSubmit, onCancel, candidate }) => {
  const [formData, setFormData] = useState({
    referredBy: '',
    candidateName: '',
    mobileNo: '',
    totalExperience: '',
    ageGroup: '',
    education: '',
    vehicle: false,
    experienceFields: {
      administrative: 0,
      insuranceSales: 0,
      anySales: 0,
      fieldWork: 0,
      others: 0
    },
    operationalActivities: {
      dataManagement: 0,
      backOffice: 0,
      mis: 0
    },
    location: '',
    nativePlace: '',
    spokenEnglish: false,
    salaryExpectation: '',
    designation: ''
  });

  const [calculatedMarks, setCalculatedMarks] = useState(0);

  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
    }
  }, [candidate]);

  useEffect(() => {
    calculateMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateMarks = () => {
    let marks = 0;
    switch(formData.education) {
      case 'Graduate in any': marks += 2; break;
      case 'Graduate in Maths/Economics': marks += 3; break;
      case 'MBA/PG with financial subject': marks += 4; break;
    }
    switch(formData.ageGroup) {
      case '20-25yr': marks += 1; break;
      case '26-30yr': marks += 2; break;
      case '31-45yr': marks += 3; break;
      case '45 & above': marks += 2; break;
    }
    if (formData.vehicle) marks += 4;
    marks += formData.experienceFields.administrative;
    marks += formData.experienceFields.insuranceSales;
    marks += formData.experienceFields.anySales;
    marks += formData.experienceFields.fieldWork;
    marks += formData.experienceFields.others;
    marks += formData.operationalActivities.dataManagement;
    marks += formData.operationalActivities.backOffice;
    marks += formData.operationalActivities.mis;
    const locationMarks = { 'H.B Road': 4, 'Arera Colony': 3, 'BHEL': 2, 'Mandideep': 2, 'Others': 1 };
    marks += locationMarks[formData.location] || 0;
    if (formData.nativePlace === 'Bhopal') marks += 3;
    else if (formData.nativePlace) marks += 1;
    if (formData.spokenEnglish) marks += 4;
    const salaryMarks = { '10K-12K': 4, '12-15K': 3, '15-18K': 3, '18-20K': 2, '20-25K': 2, '25K & Above': 1 };
    marks += salaryMarks[formData.salaryExpectation] || 0;
    setCalculatedMarks(marks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : parseInt(value) || value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const designations = ['Office Admin', 'Relationship Manager', 'Sr. Relationship Manager', 'Office Executive', 'Sr. Office Executive', 'Tele Caller', 'CRM Manager'];
  const educationOptions = ['Graduate in any', 'Graduate in Maths/Economics', 'MBA/PG with financial subject'];
  const ageGroups = ['20-25yr', '26-30yr', '31-45yr', '45 & above'];
  const locations = ['H.B Road', 'Arera Colony', 'BHEL', 'Mandideep', 'Others'];
  const salaryBrackets = ['10K-12K', '12-15K', '15-18K', '18-20K', '20-25K', '25K & Above'];

  const getMarksBadge = () => {
    if (calculatedMarks >= 25) return 'badge bg-success';
    if (calculatedMarks >= 20) return 'badge bg-warning text-dark';
    return 'badge bg-danger';
  };

  const getMarksText = () => {
    if (calculatedMarks >= 25) return 'Highly Recommended';
    if (calculatedMarks >= 20) return 'Recommended';
    return 'Needs Review';
  };

  return (
    <div className="hr-form-card fade-in">
      <h2 className="h5 fw-semibold text-dark mb-4">
        {candidate ? 'Edit Candidate' : 'Add New Candidate'}
      </h2>

      {/* Marks Display */}
      <div className="bg-primary bg-opacity-10 border border-primary rounded mb-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="fw-medium text-primary mb-1">Calculated Marks</h3>
            <p className="small text-primary mb-0">Based on the scoring system</p>
          </div>
          <div className="h2 fw-bold text-primary mb-0">
            {calculatedMarks} points
          </div>
        </div>
        <div>
          <span className={`badge ${getMarksBadge()}`}>
            {getMarksText()}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">
              Candidate Name *
            </label>
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              className="form-control hr-form-input"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">
              Mobile No *
            </label>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="form-control hr-form-input"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">
              Designation *
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Designation</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">
              Referred By
            </label>
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              className="form-control hr-form-input"
            />
          </div>
        </div>

        {/* Education and Experience */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Education *
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Education</option>
              {educationOptions.map(edu => (
                <option key={edu} value={edu}>{edu}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Age Group *
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Age Group</option>
              {ageGroups.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Total Experience (Years)
            </label>
            <input
              type="number"
              name="totalExperience"
              value={formData.totalExperience}
              onChange={handleChange}
              className="form-control hr-form-input"
            />
          </div>
        </div>

        {/* Location and Preferences */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Location *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Native Place *
            </label>
            <select
              name="nativePlace"
              value={formData.nativePlace}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Native Place</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label fw-medium">
              Salary Expectation *
            </label>
            <select
              name="salaryExpectation"
              value={formData.salaryExpectation}
              onChange={handleChange}
              className="form-select hr-form-input"
              required
            >
              <option value="">Select Salary</option>
              {salaryBrackets.map(salary => (
                <option key={salary} value={salary}>{salary}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                name="vehicle"
                checked={formData.vehicle}
                onChange={handleChange}
                className="form-check-input"
                id="vehicleCheck"
              />
              <label className="form-check-label" htmlFor="vehicleCheck">
                Has Vehicle (4 marks)
              </label>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                name="spokenEnglish"
                checked={formData.spokenEnglish}
                onChange={handleChange}
                className="form-check-input"
                id="englishCheck"
              />
              <label className="form-check-label" htmlFor="englishCheck">
                Fluent in English (4 marks)
              </label>
            </div>
          </div>
        </div>

        {/* Experience Fields */}
        <div className="border-top pt-4 mb-4">
          <h3 className="h6 fw-medium text-dark mb-3">Experience Fields</h3>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                Administrative Work & Team Management (5 marks)
              </label>
              <select
                name="experienceFields.administrative"
                value={formData.experienceFields.administrative}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={5}>5 marks</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                Sales in Insurance & Financial Field (4 marks)
              </label>
              <select
                name="experienceFields.insuranceSales"
                value={formData.experienceFields.insuranceSales}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={4}>4 marks</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                Sales & Services in any field (3 marks)
              </label>
              <select
                name="experienceFields.anySales"
                value={formData.experienceFields.anySales}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={3}>3 marks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Activities */}
        <div className="border-top pt-4 mb-4">
          <h3 className="h6 fw-medium text-dark mb-3">Operational Activities</h3>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                Data Management with CPCT (4 marks)
              </label>
              <select
                name="operationalActivities.dataManagement"
                value={formData.operationalActivities.dataManagement}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={4}>4 marks</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                Back Office Operations in Financial Field (3 marks)
              </label>
              <select
                name="operationalActivities.backOffice"
                value={formData.operationalActivities.backOffice}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={3}>3 marks</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label small fw-medium">
                MIS (M.S Office) Skills (2 marks)
              </label>
              <select
                name="operationalActivities.mis"
                value={formData.operationalActivities.mis}
                onChange={handleChange}
                className="form-select hr-form-input"
              >
                <option value={0}>0 marks</option>
                <option value={2}>2 marks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex flex-column flex-sm-row gap-3 pt-4 border-top">
          <button
            type="submit"
            className="hr-btn-primary flex-fill"
          >
            {candidate ? 'Update Candidate' : 'Add Candidate'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="hr-btn-secondary flex-fill"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidateForm;
