import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllSuspects } from "../../../redux/feature/SuspectRedux/SuspectThunx";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../config/axios";
import AssignmentAnalytics from "./AssignmentAnalytics";
import "./Dashboard.css"; // ✅ CSS IMPORT

const DashboardPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    suspects = [],
    loading,
    error,
  } = useSelector((state) => state.suspect);

  const [actionPanel, setActionPanel] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    nextCallDate: "",
    time: "",
    remark: "",
    nextAppointmentDate: "",
    nextAppointmentTime: "",
  });

  const [assignedSuspects, setAssignedSuspects] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [todaysActiveSuspects, setTodaysActiveSuspects] = useState([]);
  const [scheduledSuspects, setScheduledSuspects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    dateRange: "",
    area: "",
  });

  const [realTimeStats, setRealTimeStats] = useState({
    total: 0,
    notContacted: 0,
    forwarded: 0,
    callback: 0,
    appointmentDone: 0,
    notInterested: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const telecallerId = user?.id || null;

  useEffect(() => {
    fetchInitialData();

    const handleFocus = () => {
      fetchInitialData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, telecallerId]);

  const fetchInitialData = async () => {
    await Promise.all([
      dispatch(getAllSuspects()),
      fetchAssignedSuspects(),
      fetchTodaysActiveSuspects(),
      fetchTelecallerStats(),
    ]);
  };

  const fetchAssignedSuspects = async () => {
    if (!telecallerId) return;

    setAssignedLoading(true);
    setAssignedError(null);

    console.log("🔄 FRONTEND - Fetching assigned suspects...");

    try {
      const response = await axiosInstance.get(
        `/api/telecaller/${telecallerId}/assigned-suspects?t=${new Date().getTime()}` // ✅ Prevent caching
      );

      console.log("📥 FRONTEND - Assigned suspects response:", {
        success: response.data?.success,
        count: response.data?.data?.assignedSuspectsCount,
        suspectsLength: response.data?.data?.assignedSuspects?.length,
      });

      if (response.data && response.data.success) {
        const suspectsData = response.data.data.assignedSuspects || [];
        const sortedData = suspectsData.sort(
          (a, b) => new Date(b.assignedAt) - new Date(a.assignedAt)
        );
        setAssignedSuspects(sortedData);
        calculateRealTimeStats(sortedData);

        console.log(
          "✅ FRONTEND - Assigned suspects updated:",
          sortedData.length
        );
      } else {
        console.log(
          "❌ FRONTEND - Assigned suspects API error:",
          response.data?.message
        );
        setAssignedError(
          response.data.message || "Failed to fetch assigned suspects"
        );
      }
    } catch (error) {
      console.error("❌ FRONTEND - Error fetching assigned suspects:", error);
      setAssignedError(
        error.response?.data?.message || "Network error. Please try again."
      );
    } finally {
      setAssignedLoading(false);
    }
  };

  const fetchTelecallerStats = async () => {
    if (!telecallerId) return;

    console.log("🔄 FRONTEND - Fetching stats...");

    try {
      const response = await axiosInstance.get(
        `/api/telecaller/${telecallerId}/stats?t=${new Date().getTime()}` // ✅ Prevent caching
      );

      console.log("📥 FRONTEND - Stats response:", {
        success: response.data?.success,
        data: response.data?.data,
      });

      if (response.data && response.data.success) {
        setRealTimeStats(response.data.data);
        console.log("✅ FRONTEND - Stats updated");
      }
    } catch (error) {
      console.error("❌ FRONTEND - Error fetching stats:", error);
    }
  };
  const handleQuickStatusChange = (
    suspect,
    actionType,
    preSelectedStatus = null
  ) => {
    setActionPanel({
      type: actionType,
      suspect,
      preSelectedStatus,
    });

    // Reset form data
    setFormData({
      status: preSelectedStatus || "",
      nextCallDate: "",
      time: "",
      remark: "",
      nextAppointmentDate: "",
      nextAppointmentTime: "",
    });
  };
  const fetchTodaysActiveSuspects = async () => {
    if (!telecallerId) return;

    setAssignedLoading(true);
    console.log("🔄 FRONTEND - Fetching today's active suspects...");

    try {
      const response = await axiosInstance.get(
        `/api/telecaller/${telecallerId}/todays-active?t=${new Date().getTime()}` // ✅ Prevent caching
      );

      console.log("📥 FRONTEND - Today's active response:", {
        success: response.data?.success,
        count: response.data?.data?.count,
        suspectsLength: response.data?.data?.assignedSuspects?.length,
      });

      if (response.data && response.data.success) {
        const suspectsData = response.data.data.assignedSuspects || [];
        setTodaysActiveSuspects(suspectsData);
        console.log(
          "✅ FRONTEND - Today's active updated:",
          suspectsData.length
        );
      }
    } catch (error) {
      console.error(
        "❌ FRONTEND - Error fetching today's active suspects:",
        error
      );
    } finally {
      setAssignedLoading(false);
    }
  };

  const fetchScheduledCalls = async (
    date = new Date().toISOString().split("T")[0]
  ) => {
    if (!telecallerId) return;

    setAssignedLoading(true);
    console.log("🔄 FRONTEND - Fetching scheduled calls for:", date);

    try {
      const response = await axiosInstance.get(
        `/api/telecaller/${telecallerId}/date/${date}?t=${new Date().getTime()}` // ✅ Prevent caching
      );

      console.log("📥 FRONTEND - Scheduled calls response:", {
        success: response.data?.success,
        count: response.data?.data?.count,
        suspectsLength: response.data?.data?.suspects?.length,
      });

      if (response.data && response.data.success) {
        setScheduledSuspects(response.data.data.suspects || []);
        setSelectedDate(date);
        console.log(
          "✅ FRONTEND - Scheduled calls updated:",
          response.data.data.suspects?.length || 0
        );
      }
    } catch (error) {
      console.error("❌ FRONTEND - Error fetching scheduled calls:", error);
    } finally {
      setAssignedLoading(false);
    }
  };

  const calculateRealTimeStats = (suspectsData) => {
    const stats = {
      total: suspectsData.length,
      notContacted: 0,
      forwarded: 0,
      callback: 0,
      appointmentDone: 0,
      notInterested: 0,
    };

    suspectsData.forEach((suspect) => {
      const status = getLatestCallStatus(suspect);
      switch (status) {
        case "Not Contacted":
          stats.notContacted++;
          break;
        case "Call Not Picked":
        case "Call After Sometimes":
        case "Busy on Another Call":
        case "Others":
          stats.forwarded++;
          break;
        case "Callback":
          stats.callback++;
          break;
        case "Appointment Done":
          stats.appointmentDone++;
          break;
        case "Not Interested":
        case "Not Reachable":
        case "Wrong Number":
          stats.notInterested++;
          break;
      }
    });

    setRealTimeStats(stats);
  };

  const getLatestCallStatus = (suspect) => {
    if (!suspect.callTasks || suspect.callTasks.length === 0) {
      return "Not Contacted";
    }

    try {
      const sortedTasks = [...suspect.callTasks].sort((a, b) => {
        const dateA = new Date(a.taskDate || 0);
        const dateB = new Date(b.taskDate || 0);
        return dateB - dateA;
      });

      return sortedTasks[0]?.taskStatus || "Not Contacted";
    } catch (error) {
      console.error("Error getting latest status:", error);
      return "Not Contacted";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Appointment Done":
        return "status-badge success";
      case "Callback":
        return "status-badge warning";
      case "Not Interested":
      case "Not Reachable":
      case "Wrong Number":
        return "status-badge danger";
      case "Call Not Picked":
      case "Busy on Another Call":
      case "Call After Sometimes":
      case "Others":
        return "status-badge info";
      case "Not Contacted":
        return "status-badge secondary";
      default:
        return "status-badge secondary";
    }
  };

  const getNextActionInfo = (suspect) => {
    if (!suspect || !suspect.callTasks || suspect.callTasks.length === 0) {
      return {
        type: "none",
        date: "-",
        time: "-",
        displayText: "-",
      };
    }

    try {
      const sortedTasks = [...suspect.callTasks].sort((a, b) => {
        const dateA = new Date(a.taskDate || 0);
        const dateB = new Date(b.taskDate || 0);
        return dateB - dateA;
      });

      const latestTask = sortedTasks[0];
      const latestStatus = latestTask.taskStatus;

      if (
        latestStatus === "Appointment Done" &&
        latestTask.nextAppointmentDate
      ) {
        const appointmentDate =
          latestTask.nextAppointmentDate instanceof Date
            ? latestTask.nextAppointmentDate
            : new Date(latestTask.nextAppointmentDate);

        return {
          type: "appointment",
          date: appointmentDate.toLocaleDateString("en-GB"),
          time: latestTask.nextAppointmentTime || "-",
          displayText: `Appointment on ${appointmentDate.toLocaleDateString(
            "en-GB"
          )} ${latestTask.nextAppointmentTime || ""}`,
        };
      }

      const forwardedStatuses = [
        "Call Not Picked",
        "Busy on Another Call",
        "Call After Sometimes",
        "Others",
        "Callback",
      ];

      if (
        forwardedStatuses.includes(latestStatus) &&
        latestTask.nextFollowUpDate
      ) {
        const followUpDate =
          latestTask.nextFollowUpDate instanceof Date
            ? latestTask.nextFollowUpDate
            : new Date(latestTask.nextFollowUpDate);

        return {
          type: "call",
          date: followUpDate.toLocaleDateString("en-GB"),
          time: latestTask.nextFollowUpTime || "-",
          displayText: `Call on ${followUpDate.toLocaleDateString("en-GB")} ${
            latestTask.nextFollowUpTime || ""
          }`,
        };
      }

      return {
        type: "none",
        date: "-",
        time: "-",
        displayText: "-",
      };
    } catch (error) {
      console.error("Error getting next action info:", error);
      return {
        type: "none",
        date: "-",
        time: "-",
        displayText: "-",
      };
    }
  };

  const updateStatus = async (suspectId, actionType) => {
    const {
      status,
      nextCallDate,
      time,
      remark,
      nextAppointmentDate,
      nextAppointmentTime,
    } = formData;

    console.log("🟢 FRONTEND - UPDATE STATUS STARTED:", {
      suspectId,
      currentStatus: getLatestCallStatus(actionPanel.suspect),
      newStatus: status,
      actionType,
    });

    // ✅ BASIC VALIDATION
    if (!status) {
      console.log("❌ FRONTEND - No status selected");
      alert("Please select a status");
      return;
    }

    // ✅ VALIDATION BASED ON SELECTED STATUS
    const forwardedStatuses = [
      "Call Not Picked",
      "Call After Sometimes",
      "Busy on Another Call",
      "Others",
    ];
    const closedStatuses = ["Not Reachable", "Wrong Number", "Not Interested"];

    // For forwarded statuses, require next call date/time
    if (forwardedStatuses.includes(status) && (!nextCallDate || !time)) {
      console.log(
        "❌ FRONTEND - Missing next call details for forwarded status"
      );
      alert("Please select next call date and time for forwarded status");
      return;
    }

    // For callback, require next call date/time
    if (status === "Callback" && (!nextCallDate || !time)) {
      console.log("❌ FRONTEND - Missing callback details");
      alert("Please select callback date and time");
      return;
    }

    // For appointment done, require next appointment date/time
    if (
      status === "Appointment Done" &&
      (!nextAppointmentDate || !nextAppointmentTime)
    ) {
      console.log("❌ FRONTEND - Missing appointment details");
      alert("Please select next appointment date and time");
      return;
    }

    // For closed statuses, require remarks
    if (closedStatuses.includes(status) && !remark) {
      console.log("❌ FRONTEND - Missing remarks for closed status");
      alert("Please provide remarks for closing the call");
      return;
    }

    setIsAssigning(true);

    try {
      const endpoint = `/api/suspect/${suspectId}/call-task`;

      // ✅ UNIFIED BODY FOR ALL STATUS CHANGES
      let body = {
        taskDate: new Date().toISOString().split("T")[0],
        taskTime:
          time ||
          new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
        taskRemarks: remark || "",
        taskStatus: status,
      };

      // ✅ ADDITIONAL FIELDS BASED ON STATUS
      if (forwardedStatuses.includes(status) || status === "Callback") {
        body.nextFollowUpDate = nextCallDate;
        body.nextFollowUpTime = time;
      }

      if (status === "Appointment Done") {
        body.nextAppointmentDate = nextAppointmentDate;
        body.nextAppointmentTime = nextAppointmentTime;
      }

      console.log("📤 FRONTEND - Sending Status Update:", {
        endpoint,
        body,
        fromStatus: getLatestCallStatus(actionPanel.suspect),
        toStatus: status,
      });

      const response = await axiosInstance.post(endpoint, body);

      console.log("📥 FRONTEND - Status Update Response:", {
        status: response.status,
        success: response.data?.success,
        message: response.data?.message,
      });

      if (response.data && response.data.success === true) {
        console.log("✅ FRONTEND - Status Update Successful");
        alert(`✅ Status updated to: ${status}`);

        // ✅ FORCE REFRESH ALL DATA
        console.log("🔄 FRONTEND - Refreshing all data after status change...");

        await Promise.all([
          fetchAssignedSuspects(),
          fetchTodaysActiveSuspects(),
          fetchTelecallerStats(),
          dispatch(getAllSuspects()),
          fetchScheduledCalls(selectedDate),
        ]);

        console.log("✅ FRONTEND - All data refreshed after status change");

        // ✅ RESET FORM AND CLOSE PANEL
        setActionPanel(null);
        setFormData({
          status: "",
          nextCallDate: "",
          time: "",
          remark: "",
          nextAppointmentDate: "",
          nextAppointmentTime: "",
        });

        console.log("🟢 FRONTEND - Status update process completed");
      } else {
        console.log("❌ FRONTEND - Status update failed in API");
        throw new Error(response.data?.message || "Status update failed");
      }
    } catch (error) {
      console.error("❌ FRONTEND - Status Update Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        `❌ Status update failed: ${
          error.response?.data?.message || "Something went wrong"
        }`
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (actionPanel?.suspect?._id && actionPanel.type) {
      updateStatus(actionPanel.suspect._id, actionPanel.type);
    }
  };

  return (
    <div className="dashboard-page">
      <h2 className="table-title">
        Today's Calls -{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </h2>

      <div className="today-call-cards">
        <div
          className="card total"
          onClick={() => navigate("/telecaller/total-leads")}
        >
          <h3>{realTimeStats.total}</h3>
          <p>Total Assigned</p>
          <div className="card-subtitle">All Leads</div>
        </div>
        <div
          className="card balance"
          onClick={() => {
            // Navigate to balance leads with TODAY filter
            navigate("/telecaller/balance-leads?filter=today");
          }}
        >
          <h3>{realTimeStats.notContacted}</h3>
          <p>Balance Leads</p>
          <div className="card-subtitle">Not Contacted Today</div>
        </div>
        <div
          className="card forwarded"
          onClick={() => {
            // Navigate to forwarded with TODAY filter
            navigate("/telecaller/forwarded-leads?filter=today");
          }}
        >
          <h3>{realTimeStats.forwarded}</h3>
          <p>Forwarded Leads</p>
          <div className="card-subtitle">Today's Follow-ups</div>
        </div>
        <div
          className="card callback"
          onClick={() => {
            // Navigate to callback with TODAY filter
            navigate("/telecaller/callback?filter=today");
          }}
        >
          <h3>{realTimeStats.callback}</h3>
          <p>Callbacks</p>
          <div className="card-subtitle">Today's Scheduled</div>
        </div>
        <div
          className="card closed"
          onClick={() => navigate("/telecaller/closed-calls")}
        >
          <h3>{realTimeStats.notInterested}</h3>
          <p>Closed Calls</p>
          <div className="card-subtitle">All Time</div>
        </div>
        <div
          className="card success"
          onClick={() => {
            // Navigate to appointments with TODAY filter
            navigate("/telecaller/appointments-done?filter=today");
          }}
        >
          <h3>{realTimeStats.appointmentDone}</h3>
          <p>Successful</p>
          <div className="card-subtitle">Today's Appointments</div>
        </div>
      </div>
      <div className="tab-nav">
        <button
          className={activeTab === "today" ? "active" : ""}
          onClick={() => {
            setActiveTab("today");
            fetchTodaysActiveSuspects();
          }}
        >
          Today's Calls ({todaysActiveSuspects.length})
        </button>
        <button
          className={activeTab === "scheduled" ? "active" : ""}
          onClick={() => {
            setActiveTab("scheduled");
            fetchScheduledCalls(selectedDate); // Make sure selectedDate is today by default
          }}
        >
          📅 Scheduled Calls ({scheduledSuspects.length})
        </button>
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => {
            setActiveTab("all");
            fetchAssignedSuspects();
          }}
        >
          All Assigned ({assignedSuspects.length})
        </button>
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          📊 Analytics
        </button>
      </div>
      {/* TODAY'S TAB */}
      {activeTab === "today" && (
        <div className="todays-calls">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="refresh-btn"
              onClick={fetchTodaysActiveSuspects}
              disabled={assignedLoading}
            >
              {assignedLoading ? "🔄 Loading..." : "↻ Refresh Today's Calls"}
            </button>
            <div className="summary-info">
              <strong>Today's Active:</strong> {todaysActiveSuspects.length}{" "}
              suspects
            </div>
          </div>

          <div className="table-container mt-3">
            {assignedLoading ? (
              <div className="text-center mt-4">
                <Spinner animation="border" />
                <p>Loading today's active suspects...</p>
              </div>
            ) : todaysActiveSuspects.length === 0 ? (
              <div className="text-center mt-4">
                <p>No active suspects for today.</p>
              </div>
            ) : (
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Assigned Date</th>
                    <th>Suspect Name</th>
                    <th>Organisation</th>
                    <th>Area</th>
                    <th>Mobile</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysActiveSuspects.map((suspect) => {
                    const personal = suspect.personalDetails || {};
                    const fullName = `${personal.salutation || ""} ${
                      personal.groupName || personal.name || ""
                    }`.trim();
                    const latestStatus = getLatestCallStatus(suspect);
                    const statusBadgeClass = getStatusBadgeColor(latestStatus);

                    return (
                      <tr key={suspect._id}>
                        <td>
                          {suspect.assignedAt
                            ? new Date(suspect.assignedAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>
                        <td
                          className="clickable"
                          onClick={() =>
                            navigate(`/telecaller/suspect/edit/${suspect._id}`)
                          }
                        >
                          <div className="suspect-name">{fullName || "-"}</div>
                        </td>
                        <td>{personal.organisation || "-"}</td>
                        <td>
                          <span className="area-badge">
                            {personal.city || "-"}
                          </span>
                        </td>
                        <td>
                          <div className="mobile-cell">
                            {personal.contactNo || personal.mobileNo || "-"}
                            {(personal.contactNo || personal.mobileNo) && (
                              <a
                                href={`tel:${
                                  personal.contactNo || personal.mobileNo
                                }`}
                                className="call-icon"
                                title="Call"
                              >
                                📞
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={statusBadgeClass}>
                            {latestStatus}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-success"
                              onClick={() =>
                                setActionPanel({ type: "forward", suspect })
                              }
                            >
                              Forward
                            </button>
                            <button
                              className="btn-sm btn-danger"
                              onClick={() =>
                                setActionPanel({ type: "close", suspect })
                              }
                            >
                              Close
                            </button>
                            <button
                              className="btn-sm btn-primary"
                              onClick={() =>
                                setActionPanel({ type: "callback", suspect })
                              }
                            >
                              Callback
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/* ALL ASSIGNED TAB */}
      {activeTab === "all" && (
        <div className="assigned-suspects">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="refresh-btn"
              onClick={fetchAssignedSuspects}
              disabled={assignedLoading}
            >
              {assignedLoading ? "🔄 Loading..." : "↻ Refresh"}
            </button>
            <div className="summary-info">
              <strong>Today's Stats:</strong> {realTimeStats.notContacted}{" "}
              Pending • {realTimeStats.forwarded} Forwarded •{" "}
              {realTimeStats.callback} Callbacks •{" "}
              {realTimeStats.appointmentDone} Success
            </div>
          </div>

          <div className="table-container mt-3">
            {assignedLoading ? (
              <div className="text-center mt-4">
                <Spinner animation="border" />
                <p>Loading assigned suspects...</p>
              </div>
            ) : assignedError ? (
              <div className="text-center mt-4">
                <p className="text-danger">{assignedError}</p>
              </div>
            ) : assignedSuspects.length === 0 ? (
              <div className="text-center mt-4">
                <p>No suspects assigned to you yet.</p>
              </div>
            ) : (
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Assigned Date</th>
                    <th>Suspect Name</th>
                    <th>Organisation</th>
                    <th>Area</th>
                    <th>Mobile</th>
                    <th>Current Status</th>
                    <th>Next Action</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedSuspects.map((suspect) => {
                    const personal = suspect.personalDetails || {};
                    const fullName = `${personal.salutation || ""} ${
                      personal.groupName || personal.name || ""
                    }`.trim();
                    const latestStatus = getLatestCallStatus(suspect);
                    const statusBadgeClass = getStatusBadgeColor(latestStatus);
                    const nextActionInfo = getNextActionInfo(suspect);

                    return (
                      <tr key={suspect._id}>
                        <td>
                          {suspect.assignedAt
                            ? new Date(suspect.assignedAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>
                        <td
                          className="clickable"
                          onClick={() =>
                            navigate(`/telecaller/suspect/edit/${suspect._id}`)
                          }
                        >
                          <div className="suspect-name">
                            {fullName || "-"}
                            {latestStatus === "Callback" && (
                              <span
                                className="callback-indicator"
                                title="Callback Scheduled"
                              >
                                {" "}
                                🔔
                              </span>
                            )}
                            {latestStatus === "Appointment Done" && (
                              <span
                                className="success-indicator"
                                title="Appointment Done"
                              >
                                {" "}
                                ✅
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{personal.organisation || "-"}</td>
                        <td>
                          <span className="area-badge">
                            {personal.city || "-"}
                          </span>
                        </td>
                        <td>
                          <div className="mobile-cell">
                            {personal.contactNo || personal.mobileNo || "-"}
                            {(personal.contactNo || personal.mobileNo) && (
                              <a
                                href={`tel:${
                                  personal.contactNo || personal.mobileNo
                                }`}
                                className="call-icon"
                                title="Call"
                              >
                                📞
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={statusBadgeClass}>
                            {latestStatus}
                          </span>
                        </td>
                        <td>
                          {nextActionInfo.type !== "none" ? (
                            <div
                              className={`next-action-info ${nextActionInfo.type}`}
                            >
                              {nextActionInfo.type === "appointment" && (
                                <div className="appointment-action">
                                  <span
                                    className="action-icon"
                                    title="Next Appointment"
                                  >
                                    📅
                                  </span>
                                  <span className="action-date">
                                    {nextActionInfo.date}
                                  </span>
                                  <span className="action-time">
                                    {nextActionInfo.time}
                                  </span>
                                </div>
                              )}
                              {nextActionInfo.type === "call" && (
                                <div className="call-action">
                                  <span
                                    className="action-icon"
                                    title="Next Call"
                                  >
                                    📞
                                  </span>
                                  <span className="action-date">
                                    {nextActionInfo.date}
                                  </span>
                                  <span className="action-time">
                                    {nextActionInfo.time}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="no-action">-</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-success"
                              onClick={() =>
                                setActionPanel({ type: "forward", suspect })
                              }
                            >
                              Forward
                            </button>
                            <button
                              className="btn-sm btn-danger"
                              onClick={() =>
                                setActionPanel({ type: "close", suspect })
                              }
                            >
                              Close
                            </button>
                            <button
                              className="btn-sm btn-primary"
                              onClick={() =>
                                setActionPanel({ type: "callback", suspect })
                              }
                            >
                              Callback
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/* SCHEDULED TAB */}
      {activeTab === "scheduled" && (
        <div className="scheduled-calls">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="date-selector">
              <label>Select Date: </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => fetchScheduledCalls(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="summary-info">
              <strong>Scheduled Calls:</strong> {scheduledSuspects.length}{" "}
              suspects
            </div>
          </div>

          <div className="table-container">
            {assignedLoading ? (
              <div className="text-center mt-4">
                <Spinner animation="border" />
                <p>Loading scheduled calls...</p>
              </div>
            ) : scheduledSuspects.length === 0 ? (
              <div className="text-center mt-4">
                <p>No scheduled calls for {selectedDate}.</p>
              </div>
            ) : (
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Suspect Name</th>
                    <th>Organisation</th>
                    <th>Area</th>
                    <th>Mobile</th>
                    <th>Current Status</th>
                    <th>Scheduled Action</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledSuspects.map((suspect) => {
                    const personal = suspect.personalDetails || {};
                    const fullName = `${personal.salutation || ""} ${
                      personal.groupName || personal.name || ""
                    }`.trim();
                    const latestStatus = getLatestCallStatus(suspect);
                    const statusBadgeClass = getStatusBadgeColor(latestStatus);
                    const nextActionInfo = getNextActionInfo(suspect);

                    return (
                      <tr key={suspect._id}>
                        <td
                          className="clickable"
                          onClick={() =>
                            navigate(`/telecaller/suspect/edit/${suspect._id}`)
                          }
                        >
                          <div className="suspect-name">{fullName || "-"}</div>
                        </td>
                        <td>{personal.organisation || "-"}</td>
                        <td>
                          <span className="area-badge">
                            {personal.city || "-"}
                          </span>
                        </td>
                        <td>
                          <div className="mobile-cell">
                            {personal.contactNo || personal.mobileNo || "-"}
                            {(personal.contactNo || personal.mobileNo) && (
                              <a
                                href={`tel:${
                                  personal.contactNo || personal.mobileNo
                                }`}
                                className="call-icon"
                                title="Call"
                              >
                                📞
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={statusBadgeClass}>
                            {latestStatus}
                          </span>
                        </td>
                        <td>
                          {nextActionInfo.type !== "none" ? (
                            <div
                              className={`next-action-info ${nextActionInfo.type}`}
                            >
                              {nextActionInfo.type === "appointment" && (
                                <div className="appointment-action">
                                  <span
                                    className="action-icon"
                                    title="Next Appointment"
                                  >
                                    📅
                                  </span>
                                  <span className="action-date">
                                    {nextActionInfo.date}
                                  </span>
                                  <span className="action-time">
                                    {nextActionInfo.time}
                                  </span>
                                </div>
                              )}
                              {nextActionInfo.type === "call" && (
                                <div className="call-action">
                                  <span
                                    className="action-icon"
                                    title="Next Call"
                                  >
                                    📞
                                  </span>
                                  <span className="action-date">
                                    {nextActionInfo.date}
                                  </span>
                                  <span className="action-time">
                                    {nextActionInfo.time}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="no-action">-</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-sm btn-success"
                              onClick={() =>
                                handleQuickStatusChange(
                                  suspect,
                                  "forward",
                                  "Call After Sometimes"
                                )
                              }
                            >
                              Forward
                            </button>
                            <button
                              className="btn-sm btn-danger"
                              onClick={() =>
                                handleQuickStatusChange(
                                  suspect,
                                  "close",
                                  "Not Interested"
                                )
                              }
                            >
                              Close
                            </button>
                            <button
                              className="btn-sm btn-primary"
                              onClick={() =>
                                handleQuickStatusChange(suspect, "callback")
                              }
                            >
                              Callback
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="analytics-tab">
          <AssignmentAnalytics assignedSuspects={assignedSuspects} />
        </div>
      )}
      {/* ACTION PANEL */}
      {/* ACTION PANEL - COMPLETE STATUS FREEDOM */}
      {actionPanel && (
        <div className="action-panel">
          <div className="action-header">
            <span>
              📩{" "}
              {actionPanel.suspect.personalDetails?.groupName ||
                actionPanel.suspect.personalDetails?.name ||
                "-"}
              <b>({actionPanel.type.toUpperCase()})</b>
              {isAssigning && (
                <span style={{ marginLeft: "10px", color: "#f59e0b" }}>
                  🔄 Processing...
                </span>
              )}
            </span>
            <button
              className="close-btn"
              onClick={() => setActionPanel(null)}
              disabled={isAssigning}
            >
              ✖
            </button>
          </div>
          <div className="action-body">
            {/* ✅ COMMON STATUS SELECTOR FOR ALL ACTIONS */}
            <div className="form-row">
              <label>Select New Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                required
                disabled={isAssigning}
              >
                <option value="">-- Select New Status --</option>

                {/* ✅ FORWARDED STATUSES */}
                <optgroup label="📞 Forwarded Statuses">
                  <option value="Call Not Picked">Call Not Picked</option>
                  <option value="Call After Sometimes">
                    Call After Sometimes
                  </option>
                  <option value="Busy on Another Call">
                    Busy on Another Call
                  </option>
                  <option value="Others">Others</option>
                </optgroup>

                {/* ✅ CLOSED STATUSES */}
                <optgroup label="❌ Closed Statuses">
                  <option value="Not Reachable">Not Reachable</option>
                  <option value="Wrong Number">Wrong Number</option>
                  <option value="Not Interested">Not Interested</option>
                </optgroup>

                {/* ✅ SUCCESS STATUS */}
                <optgroup label="✅ Success Status">
                  <option value="Appointment Done">Appointment Done</option>
                </optgroup>

                {/* ✅ ACTIVE STATUS */}
                <optgroup label="🔔 Active Status">
                  <option value="Callback">Callback</option>
                </optgroup>
              </select>
            </div>

            {/* ✅ DYNAMIC FIELDS BASED ON SELECTED STATUS */}

            {/* FOR FORWARDED STATUSES - Show next call date/time */}
            {[
              "Call Not Picked",
              "Call After Sometimes",
              "Busy on Another Call",
              "Others",
            ].includes(formData.status) && (
              <>
                <div className="form-row">
                  <label>Next Call Date *</label>
                  <input
                    type="date"
                    name="nextCallDate"
                    value={formData.nextCallDate}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isAssigning}
                  />
                  <label>Next Call Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                    disabled={isAssigning}
                  />
                </div>
              </>
            )}

            {/* FOR CALLBACK - Show next call date/time */}
            {formData.status === "Callback" && (
              <>
                <div className="form-row">
                  <label>Callback Date *</label>
                  <input
                    type="date"
                    name="nextCallDate"
                    value={formData.nextCallDate}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isAssigning}
                  />
                  <label>Callback Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                    disabled={isAssigning}
                  />
                </div>
              </>
            )}

            {/* FOR APPOINTMENT DONE - Show next appointment date/time */}
            {formData.status === "Appointment Done" && (
              <>
                <div className="form-row">
                  <label>Next Appointment Date *</label>
                  <input
                    type="date"
                    name="nextAppointmentDate"
                    value={formData.nextAppointmentDate}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    disabled={isAssigning}
                  />
                  <label>Next Appointment Time *</label>
                  <input
                    type="time"
                    name="nextAppointmentTime"
                    value={formData.nextAppointmentTime}
                    onChange={handleFormChange}
                    required
                    disabled={isAssigning}
                  />
                </div>
              </>
            )}

            {/* ✅ ALWAYS SHOW REMARKS FIELD */}
            <div className="form-row">
              <label>
                Remarks{" "}
                {["Not Reachable", "Wrong Number", "Not Interested"].includes(
                  formData.status
                )
                  ? "*"
                  : ""}
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleFormChange}
                placeholder={
                  formData.status === "Not Interested"
                    ? "Please specify reason for not interest..."
                    : formData.status === "Wrong Number"
                    ? "Please provide details..."
                    : formData.status === "Not Reachable"
                    ? "Please specify reachability issues..."
                    : "Enter remarks..."
                }
                style={{ width: "90%", minHeight: "60px" }}
                required={[
                  "Not Reachable",
                  "Wrong Number",
                  "Not Interested",
                ].includes(formData.status)}
                disabled={isAssigning}
              />
            </div>

            {/* ✅ CURRENT STATUS INFO (for reference) */}
            <div className="current-status-info">
              <small>
                <strong>Current Status:</strong>{" "}
                {getLatestCallStatus(actionPanel.suspect)}
              </small>
            </div>

            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() => setActionPanel(null)}
                disabled={isAssigning}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isAssigning}
              >
                {isAssigning ? (
                  <>
                    <span className="spinner"></span>
                    Updating Status...
                  </>
                ) : (
                  `Update to ${formData.status || "New Status"}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
