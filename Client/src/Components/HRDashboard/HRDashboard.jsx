// components/HRDashboard/HRDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HRDashboard.css";
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";
import HRDashboardHome from "./HRDashboardHome";
import Analytics from "./modules/Analytics";
import BusinessAssociates from "./modules/BusinessAssociates";
import Internship from "./modules/Internship";
import CandidateDetail from "./modules/CandidateDetail";
import RecruitmentPipeline from "./modules/RecruitmentPipeline";
import VacancyManagement from "./modules/VacancyManagement";

// Employee Recruitment submodules
import InternshipData from "./modules/EmployeeRecruitment/InternshipData";
import EmployeeTraining from "./modules/EmployeeRecruitment/EmployeeTraining";
import RulesRegulations from "./modules/EmployeeRecruitment/RulesRegulations";
import VacancyNotice from "./modules/EmployeeRecruitment/VacancyNotice";
import ShortlistedResumes from "./modules/EmployeeRecruitment/ShortlistedResumes";
import InterviewProcess from "./modules/EmployeeRecruitment/InterviewProcess";
import JoiningData from "./modules/EmployeeRecruitment/JoiningData.jsx";
import JobProfileTarget from "./modules/EmployeeRecruitment/JobProfileTarget";

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="hr-dashboard d-flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="hr-main-content d-flex flex-column">
        {/* Top Navigation Bar */}
        <TopNavigation setSidebarOpen={setSidebarOpen} />

        {/* Main content area */}
        <main
          className="grow overflow-auto"
          style={{ backgroundColor: "#ffffff", padding: "20px 24px" }}
        >
          <Routes>
            {/* Default routes */}
            <Route path="/" element={<HRDashboardHome />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/business-associates" element={<BusinessAssociates />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/candidate/:id" element={<CandidateDetail />} />
            <Route path="/recruitment" element={<RecruitmentPipeline />} />
            <Route path="/vacancies" element={<VacancyManagement />} />

            {/*Employee Recruitment routes */}
            <Route path="/internship-data" element={<InternshipData />} />
            <Route path="/employee-training" element={<EmployeeTraining />} />
            <Route path="/rules-regulations" element={<RulesRegulations />} />
            <Route path="/vacancy-notice" element={<VacancyNotice />} />
            <Route path="/resume-shortlist" element={<ShortlistedResumes />} />
            <Route path="/interview-process" element={<InterviewProcess />} />
            <Route path="/joining-data" element={<JoiningData />} />
            <Route path="/job-profile-target" element={<JobProfileTarget />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;