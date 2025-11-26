// components/HRDashboard/Sidebar.jsx
import React, { useState } from "react";
import {
  FaSignOutAlt,
  FaHome,
  FaFileAlt,
  FaSync,
  FaUsers,
  FaChartBar,
  FaHandshake,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recruitmentOpen, setRecruitmentOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: <FaHome /> },
    {
      name: "Vacancy Management",
      href: "/dashboard/vacancies",
      icon: <FaFileAlt />,
    },
    {
      name: "Employee Recruitment",
      icon: <FaSync />,
      subItems: [
        { name: "Internship Data", href: "/dashboard/internship-data" },
        { name: "Employee Training", href: "/dashboard/employee-training" },
        { name: "HR Rules & Regulations", href: "/dashboard/rules-regulations" },
        { name: "Vacancy Notice", href: "/dashboard/vacancy-notice" },
        { name: "Shortlisted Resumes", href: "/dashboard/resume-shortlist" },
        { name: "Interview Process", href: "/dashboard/interview-process" },
        { name: "Joining Data", href: "/dashboard/joining-data" },
        { name: "Job Profile & Target", href: "/dashboard/job-profile-target" },
      ],
    },
    {
      name: "Business Associates",
      href: "/dashboard/business-associates",
      icon: <FaUsers />,
    },
    {
      name: "Internship",
      href: "/dashboard/internship",
      icon: <FaHandshake />,
    },
    { name: "Analytics", href: "/dashboard/analytics", icon: <FaChartBar /> },
  ];

  const isActive = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="hr-sidebar-backdrop d-md-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`hr-sidebar d-flex flex-column ${
          sidebarOpen ? "" : "mobile-hidden"
        }`}
      >
        {/* Close button for mobile */}
        <div className="d-md-none text-end p-2 border-bottom">
          <button
            className="btn btn-sm btn-link text-dark"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-auto">
          {navigation.map((item) =>
            item.subItems ? (
              <div key={item.name}>
                <button
                  className={`hr-nav-link w-100 text-start d-flex align-items-center justify-content-between ${
                    recruitmentOpen ? "active" : ""
                  }`}
                  onClick={() => setRecruitmentOpen(!recruitmentOpen)}
                >
                  <div>
                    <span className="me-3 fs-5">{item.icon}</span>
                    {item.name}
                  </div>
                  {recruitmentOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {recruitmentOpen && (
                  <div className="ps-4 mt-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className={`hr-nav-link small d-block py-1 ${
                          isActive(sub.href) ? "active" : ""
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`hr-nav-link ${isActive(item.href) ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="me-3 fs-5">{item.icon}</span>
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top">
          <button
            onClick={handleLogout}
            className="hr-btn-danger w-100 d-flex align-items-center justify-content-center"
          >
            <span className="me-2">
              <FaSignOutAlt />
            </span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
