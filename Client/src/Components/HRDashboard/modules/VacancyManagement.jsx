import React, { useState, useEffect } from 'react';
import CreateVacancyForm from './CreateVacancyForm';
import VacancyTable from './VacancyTable';
import { FaPlus } from 'react-icons/fa';

const VacancyManagement = () => {
  const [vacancies, setVacancies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = () => {
    const saved = localStorage.getItem('vacancies');
    setVacancies(saved ? JSON.parse(saved) : []);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      const updated = vacancies.filter(v => v.id !== id);
      setVacancies(updated);
      localStorage.setItem('vacancies', JSON.stringify(updated));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = vacancies.map(v => v.id === id ? { ...v, status: newStatus } : v);
    setVacancies(updated);
    localStorage.setItem('vacancies', JSON.stringify(updated));
  };

  const handleSave = (vacancyData) => {
    if (editingVacancy) {
      const updated = vacancies.map(v => v.id === editingVacancy.id ? { ...vacancyData, id: editingVacancy.id } : v);
      setVacancies(updated);
      localStorage.setItem('vacancies', JSON.stringify(updated));
    } else {
      const newVacancy = {
        id: Date.now().toString(),
        ...vacancyData,
        createdDate: new Date().toISOString(),
        applicants: 0
      };
      const updated = [...vacancies, newVacancy];
      setVacancies(updated);
      localStorage.setItem('vacancies', JSON.stringify(updated));
    }
    setShowForm(false);
    setEditingVacancy(null);
  };

  const handleEdit = (vacancy) => {
    setEditingVacancy(vacancy);
    setShowForm(true);
  };

  const handleClose = (id) => {
    handleStatusChange(id, 'Closed');
  };

  return (
    <div className="fade-in">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Vacancy Management</h1>
          <p className="text-muted mb-0">Create and manage job vacancies</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingVacancy(null);
              setShowForm(true);
            }}
            className="hr-btn-primary"
          >
             <FaPlus className="me-2 mb-1" /> Create Vacancy
          </button>
        )}
      </div>

      {showForm ? (
        <CreateVacancyForm
          vacancy={editingVacancy}
          onSubmit={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingVacancy(null);
          }}
        />
      ) : (
        <VacancyTable
          vacancies={vacancies}
          onEdit={handleEdit}
          onClose={handleClose}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default VacancyManagement;
