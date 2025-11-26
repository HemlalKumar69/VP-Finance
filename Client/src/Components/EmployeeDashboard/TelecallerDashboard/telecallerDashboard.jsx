import React, { useState } from "react";
import { logoutUser } from "../../../redux/feature/auth/authThunx";
import { useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

const TelecallerPanel = () => {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  const [activeLeadsOpen, setActiveLeadsOpen] = useState(false);
  const [rejectedLeadsOpen, setRejectedLeadsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/telecaller/dashboard", icon: "📊" },
    { name: "Add New Suspect", path: "/telecaller/suspect/add", icon: "➕" },
    {
      name: "Monthly Appointments",
      path: "/telecaller/appointments",
      icon: "📅",
    },
    {
      name: "Active Leads",
      icon: "🎯",
      hasDropdown: true,
      path: "/telecaller",
      subItems: [
        {
          name: "Busy On Another Call",
          icon: "📞",
          path: "/telecaller/busy-on-another-call",
        },
        {
          name: "Call After Some Time",
          icon: "⏰",
          path: "/telecaller/call-after-some-time",
        },
        {
          name: "Call Not Picked",
          icon: "📵",
          path: "/telecaller/call-not-picked",
        },
        { name: "Others", icon: "📋", path: "/telecaller/others" },
      ],
    },
    {
      name: "Rejected Leads",
      icon: "❌",
      hasDropdown: true,
      subItems: [
        { name: "Wrong Number", icon: "📱", path: "/telecaller/wrong-number" },
        {
          name: "Not Reachable",
          icon: "🚫",
          path: "/telecaller/not-reachable",
        },
        {
          name: "Not Interested",
          icon: "👎",
          path: "/telecaller/not-interested",
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const handleUserMenuClick = () => {
    setUserMenu(!userMenu);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenu && !event.target.closest(".user-menu-wrapper")) {
        setUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenu]);

  return (
    <div className="layout">
      {/* Enhanced Sidebar */}
      <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <div className="logo-gradient">VP</div>
            </div>
            {sidebarOpen && (
              <div className="logo-content">
                <span className="logo-text">Financial Nest</span>
                <span className="logo-subtitle">Telecaller Portal</span>
              </div>
            )}
          </div>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <span className="toggle-icon">‹</span>
            ) : (
              <span className="toggle-icon">›</span>
            )}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu">
            {menu.map((item) => (
              <li key={item.name} className="menu-li">
                <div
                  className={`menu-item ${
                    active === item.name ? "active" : ""
                  } ${item.hasDropdown ? "has-dropdown" : ""}`}
                  onClick={() => {
                    if (item.hasDropdown) {
                      if (item.name === "Active Leads") {
                        setActiveLeadsOpen(!activeLeadsOpen);
                        navigate(item.path);
                      } else if (item.name === "Rejected Leads") {
                        setRejectedLeadsOpen(!rejectedLeadsOpen);
                      }
                      setActive(item.name);
                    } else {
                      setActive(item.name);
                      if (item.path) navigate(item.path);
                    }
                  }}
                >
                  <div className="menu-item-content">
                    <span className="menu-icon">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="menu-text">{item.name}</span>
                    )}
                    {sidebarOpen && item.hasDropdown && (
                      <span
                        className={`dropdown-arrow ${
                          (item.name === "Active Leads" && activeLeadsOpen) ||
                          (item.name === "Rejected Leads" && rejectedLeadsOpen)
                            ? "open"
                            : ""
                        }`}
                      >
                        ⌄
                      </span>
                    )}
                  </div>
                  {!sidebarOpen && <div className="tooltip">{item.name}</div>}
                </div>

                {item.hasDropdown && sidebarOpen && (
                  <ul
                    className={`submenu ${
                      (item.name === "Active Leads" && activeLeadsOpen) ||
                      (item.name === "Rejected Leads" && rejectedLeadsOpen)
                        ? "open"
                        : ""
                    }`}
                  >
                    {item.subItems.map((subItem) => (
                      <li
                        key={subItem.name}
                        className={`submenu-item ${
                          active === subItem.name ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActive(subItem.name);
                          if (subItem.path) navigate(subItem.path);
                        }}
                      >
                        <div className="submenu-content">
                          <span className="submenu-icon">{subItem.icon}</span>
                          <span className="submenu-text">{subItem.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">
                <div className="avatar-gradient">👤</div>
              </div>
              <div className="user-details">
                <div className="user-name">Telecaller Agent</div>
                <div className="user-role">Premium Member</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Enhanced Main Content */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{active}</h1>
            <div className="breadcrumb">Telecaller Panel / {active}</div>
          </div>
          <div className="topbar-right">
            <div className="user-menu-wrapper">
              <div
                className={`user-profile ${userMenu ? "active" : ""}`}
                onClick={handleUserMenuClick}
              >
                <div className="profile-avatar">TA</div>
                <div className="profile-info">
                  <span className="profile-name">Telecaller</span>
                  <span className="profile-role">Agent</span>
                </div>
                <span className={`profile-arrow ${userMenu ? "open" : ""}`}>
                  ⌄
                </span>
              </div>

              {/* User Dropdown Menu */}
              {userMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">TA</div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-name">Telecaller Agent</div>
                      <div className="dropdown-email">
                        agent@financialnest.com
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-item-icon">🚪</span>
                    <span className="dropdown-item-text">Sign Out</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="content-area">
          <Outlet />
        </div>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          background: #f8fafc;
        }

        /* Enhanced Sidebar */
        .sidebar {
          width: 300px;
          background: linear-gradient(
            180deg,
            #1a237e 0%,
            #283593 50%,
            #1a237e 100%
          );
          color: white;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          flex-shrink: 0;
        }

        .logo-gradient {
          font-weight: 800;
          font-size: 16px;
          color: white;
        }

        .logo-content {
          display: flex;
          flex-direction: column;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff, #e3f2fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          margin-top: 2px;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-size: 16px;
          flex-shrink: 0;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .toggle-icon {
          font-weight: bold;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .menu {
          list-style: none;
          padding: 0 16px;
          margin: 0;
        }

        .menu-li {
          margin-bottom: 4px;
        }

        .menu-item {
          position: relative;
          padding: 16px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          margin: 4px 0;
        }

        .menu-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .dropdown-arrow {
          margin-left: auto;
          font-size: 16px;
          transition: transform 0.3s ease;
          opacity: 0.7;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0;
          padding: 0;
          list-style: none;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-top: 4px;
        }

        .submenu.open {
          max-height: 400px;
        }

        .submenu-item {
          padding: 12px 16px 12px 52px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 400;
          margin: 2px 0;
        }

        .submenu-content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .submenu-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
          transform: translateX(4px);
        }

        .submenu-item.active {
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.2),
            rgba(118, 75, 162, 0.2)
          );
          color: white;
          border-left: 3px solid #667eea;
        }

        .submenu-icon {
          font-size: 14px;
          min-width: 18px;
          opacity: 0.8;
        }

        .submenu-text {
          flex: 1;
        }

        .menu-icon {
          font-size: 18px;
          min-width: 24px;
          text-align: center;
          opacity: 0.9;
        }

        .menu-text {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(4px);
        }

        .menu-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
        }

        .menu-item.active::before {
          content: "";
          position: absolute;
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 32px;
          background: white;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .tooltip {
          position: absolute;
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #1e1b4b;
          color: white;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .menu-item:hover .tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(5px);
        }

        .tooltip::before {
          content: "";
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: #1e1b4b;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-gradient {
          background: linear-gradient(135deg, #10b981, #059669);
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Enhanced Main Content */
        .main {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          overflow: hidden;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 16px 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid #e2e8f0;
        }

        .topbar-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          background: linear-gradient(135deg, #1e293b, #374151);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .breadcrumb {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .topbar-right {
          display: flex;
          align-items: center;
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid #e2e8f0;
          user-select: none;
        }

        .user-profile:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .user-profile.active {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .profile-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .profile-role {
          font-size: 12px;
          color: #64748b;
        }

        .profile-arrow {
          font-size: 16px;
          color: #64748b;
          transition: transform 0.3s ease;
        }

        .profile-arrow.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 8px;
          z-index: 1000;
          min-width: 200px;
          backdrop-filter: blur(10px);
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #f8fafc;
          margin-bottom: 4px;
        }

        .dropdown-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .dropdown-user-info {
          flex: 1;
        }

        .dropdown-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .dropdown-email {
          font-size: 12px;
          color: #64748b;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
          color: #1e293b;
          transform: translateX(2px);
        }

        .dropdown-item-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }

        .dropdown-item-text {
          font-size: 14px;
          font-weight: 500;
        }

        .content-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background: #f8fafc;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sidebar {
            width: 260px;
          }

          .sidebar.collapsed {
            width: 70px;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            z-index: 1000;
            height: 100vh;
          }

          .sidebar.collapsed {
            transform: translateX(-100%);
          }

          .topbar {
            padding: 12px 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .content-area {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .user-profile .profile-info {
            display: none;
          }

          .topbar-left {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TelecallerPanel;
