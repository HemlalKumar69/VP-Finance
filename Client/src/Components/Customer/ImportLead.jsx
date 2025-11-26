import React, { useState } from 'react';
import axios from '../../config/axios'; // Using the configured axios instance

const ImportLead = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";
  const [formData, setFormData] = useState({
    // The form fields are not sent in the new implementation, but kept for UI
    callingPurpose: '',
    pertName: '',
    leadType: '',
    leadSource: '',
    file: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('file', formData.file);

    try {
      const response = await axios.post('/api/import-suspects-csv', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'File uploaded successfully!');
      // Clear the file input after successful upload
      setFormData(prev => ({...prev, file: null}));
      document.querySelector('input[name="file"]').value = '';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error uploading file.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-4'>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <ul className="nav nav-tabs bg-black mb-0">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#import-tab">
              Import Suspect
            </a>
          </li>
        </ul>
        <a
          href={`${API_BASE_URL}/api/download-last-csv`}
          className="btn btn-success"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Download Last Uploaded CSV
        </a>
      </div>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="import-tab">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Calling Purpose</label>
                <select
                  name="callingPurpose"
                  value={formData.callingPurpose}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Servicing">Servicing</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Purpose Name</label>
                <input
                  type="text"
                  name="pertName"
                  value={formData.pertName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Lead Source</label>
                <select
                  name="leadType"
                  value={formData.leadType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose</option>
                  <option>Organization Data</option>
                  <option>Digital Platform</option>
                  <option>Administrator Referral</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Lead Name</label>
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose</option>
                  <option>Barkatullah</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Google Search</option>
                  <option>Youtube</option>
                  <option>Twitter</option>
                  <option>C I Automobile</option>
                  <option>CAR SEGMENT</option>
                  <option>Test</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'IMPORTING...' : 'IMPORT'}
                </button>
              </div>
            </div>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>

        <div className="tab-pane fade" id="data-tab">
          <p className="text-muted">Data tab content (future use).</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ImportLead;
