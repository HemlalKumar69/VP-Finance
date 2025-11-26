// components/HRDashboard/modules/BusinessAssociates.jsx
import React, { useState, useEffect } from 'react';

const BusinessAssociates = () => {
  const [associates, setAssociates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState(null);

  useEffect(() => {
    loadAssociates();
  }, []);

  const loadAssociates = () => {
    const savedAssociates = JSON.parse(localStorage.getItem('businessAssociates')) || [];
    setAssociates(savedAssociates);
  };

  const saveAssociates = (newAssociates) => {
    localStorage.setItem('businessAssociates', JSON.stringify(newAssociates));
    setAssociates(newAssociates);
  };

  const handleAddAssociate = (associateData) => {
    const newAssociate = {
      id: Date.now().toString(),
      ...associateData,
      joiningDate: new Date().toISOString(),
      status: 'Active'
    };
    const updatedAssociates = [...associates, newAssociate];
    saveAssociates(updatedAssociates);
    setShowForm(false);
  };

  const handleEditAssociate = (associate) => {
    setEditingAssociate(associate);
    setShowForm(true);
  };

  const handleUpdateAssociate = (updatedData) => {
    const updatedAssociates = associates.map(associate =>
      associate.id === editingAssociate.id ? { ...associate, ...updatedData } : associate
    );
    saveAssociates(updatedAssociates);
    setShowForm(false);
    setEditingAssociate(null);
  };

  const handleDeleteAssociate = (associateId) => {
    if (window.confirm('Are you sure you want to delete this business associate?')) {
      const updatedAssociates = associates.filter(associate => associate.id !== associateId);
      saveAssociates(updatedAssociates);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Business Associates</h1>
          <p className="text-muted mb-0">Manage business partners and associates</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setEditingAssociate(null); setShowForm(true); }}
            className="hr-btn-primary"
          >
            Add Associate
          </button>
        )}
      </div>

      {showForm ? (
        <AssociateForm
          associate={editingAssociate}
          onSubmit={editingAssociate ? handleUpdateAssociate : handleAddAssociate}
          onCancel={() => { setShowForm(false); setEditingAssociate(null); }}
        />
      ) : (
        <AssociatesList
          associates={associates}
          onEdit={handleEditAssociate}
          onDelete={handleDeleteAssociate}
        />
      )}
    </div>
  );
};

const AssociateForm = ({ associate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', workProfile: '', payout: '', joiningDate: '', status: 'Active'
  });

  useEffect(() => {
    if (associate) setFormData(associate);
  }, [associate]);

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="hr-form-card fade-in">
      <h2 className="h5 fw-semibold text-dark mb-4">
        {associate ? 'Edit Business Associate' : 'Add Business Associate'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control hr-form-input" required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Company *</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-control hr-form-input" required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control hr-form-input" required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control hr-form-input" required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Work Profile *</label>
            <input type="text" name="workProfile" value={formData.workProfile} onChange={handleChange} className="form-control hr-form-input" required />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium">Payout Structure</label>
            <input type="text" name="payout" value={formData.payout} onChange={handleChange} className="form-control hr-form-input" placeholder="e.g., Commission based" />
          </div>
        </div>

        {associate && (
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium">Joining Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate?.split('T')[0]} onChange={handleChange} className="form-control hr-form-input" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select hr-form-input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-sm-row gap-3 pt-4 border-top">
          <button type="submit" className="hr-btn-primary flex-fill">{associate ? 'Update Associate' : 'Add Associate'}</button>
          <button type="button" onClick={onCancel} className="hr-btn-secondary flex-fill">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const AssociatesList = ({ associates, onEdit, onDelete }) => {
  if (associates.length === 0) {
    return (
      <div className="hr-form-card text-center">
        <div className="display-4 mb-3">👥</div>
        <h3 className="h5 fw-medium text-dark mb-2">No business associates yet</h3>
        <p className="text-muted mb-0">Add your first business associate to get started.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'badge bg-success';
      case 'Inactive': return 'badge bg-secondary';
      case 'Suspended': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="hr-form-card overflow-hidden">
      <div className="table-responsive hr-table-responsive">
        <table className="table hr-table mb-0">
          <thead>
            <tr>
              <th>Name</th><th>Company</th><th>Contact</th><th>Work Profile</th><th>Joining Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {associates.map((associate) => (
              <tr key={associate.id}>
                <td className="fw-medium">{associate.name}</td>
                <td>{associate.company}</td>
                <td>
                  <div className="small">{associate.phone}</div>
                  <div className="small text-muted">{associate.email}</div>
                </td>
                <td>{associate.workProfile}</td>
                <td>{associate.joiningDate ? new Date(associate.joiningDate).toLocaleDateString() : 'N/A'}</td>
                <td><span className={`badge ${getStatusBadge(associate.status)}`}>{associate.status}</span></td>
                <td>
                  <div className="d-flex gap-2">
                    <button onClick={() => onEdit(associate)} className="btn btn-sm btn-link text-primary p-0">Edit</button>
                    <button onClick={() => onDelete(associate.id)} className="btn btn-sm btn-link text-danger p-0">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessAssociates;


// import { FaClock } from 'react-icons/fa';

// const BusinessAssociates = () => {
//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       minHeight: '80vh',
//       backgroundColor: '#f8f9fa',
//       padding: '40px 20px',
//       fontFamily: 'Arial, sans-serif',
//       textAlign: 'center',
//       width: '75vw',
//       margin: 0,
//       boxSizing: 'border-box'
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         padding: '40px 20px',
//         borderRadius: '15px',
//         boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
//         width: '100%',
//         maxWidth: '1200px',
//         border: '2px solid #e9ecef',
//         boxSizing: 'border-box'
//       }}>
//         <div style={{
//           fontSize: '80px',
//           color: '#4a6cf7',
//           marginBottom: '10px',
//           animation: 'bounce 2s infinite'
//         }}>
//           <FaClock />
//         </div>
        
//         <h1 style={{
//           color: '#2d3748',
//           fontSize: '3rem',
//           marginBottom: '20px',
//           fontWeight: '700'
//         }}>
//           Coming Soon!
//         </h1>
        
//         <p style={{
//           color: '#718096',
//           fontSize: '1.3rem',
//           lineHeight: '1.6',
//           marginBottom: '40px',
//           maxWidth: '800px',
//           marginLeft: 'auto',
//           marginRight: 'auto'
//         }}>
//           Our Business Associates page is currently under development. 
//           We're working hard to bring you an amazing experience for managing 
//           your business collaborations.
//         </p>
        
//         <div style={{
//           display: 'inline-block',
//           backgroundColor: '#4a6cf7',
//           color: 'white',
//           padding: '15px 40px',
//           borderRadius: '25px',
//           fontSize: '1.1rem',
//           fontWeight: '600',
//           cursor: 'pointer',
//           transition: 'all 0.3s ease',
//           boxShadow: '0 4px 15px rgba(74, 108, 247, 0.3)',
//           marginBottom: '10px',
//           border: 'none',
//           outline: 'none'
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.backgroundColor = '#3a5ce5';
//           e.target.style.transform = 'translateY(-2px)';
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.backgroundColor = '#4a6cf7';
//           e.target.style.transform = 'translateY(0)';
//         }}
//         onClick={() => alert('We will notify you when the Business Associates page is ready!')}>
//           Notify Me When Ready
//         </div>
//       </div>
      
//       <style>
//         {`
//           @keyframes bounce {
//             0%, 20%, 50%, 80%, 100% {
//               transform: translateY(0);
//             }
//             40% {
//               transform: translateY(-10px);
//             }
//             60% {
//               transform: translateY(-5px);
//             }
//           }
          
//           @keyframes pulse {
//             0% {
//               transform: scale(1);
//               opacity: 1;
//             }
//             50% {
//               transform: scale(1.1);
//               opacity: 0.7;
//             }
//             100% {
//               transform: scale(1);
//               opacity: 1;
//             }
//           }
          
//           body {
//             margin: 0;
//             padding: 0;
//             overflow-x: hidden;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default BusinessAssociates;
