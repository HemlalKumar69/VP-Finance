
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllSuspects } from "../../redux/feature/SuspectRedux/SuspectThunx";
// import { toast } from "react-toastify";

// const TaskAssign = () => {
//   const [employees, setEmployees] = useState({
//     Telecaller: [],
//     HR: ["Ankit", "Neha", "Rahul"],
//     Manager: ["Shivam", "Pooja"],
//   });




//   const [role, setRole] = useState("");
//   const [selectedPerson, setSelectedPerson] = useState("");
//   const [selectedSuspects, setSelectedSuspects] = useState([]);
//   const [isAssigning, setIsAssigning] = useState(false);
//   const [assignedMap, setAssignedMap] = useState({});
//   const [loadingAssignments, setLoadingAssignments] = useState(true);

//   const dispatch = useDispatch();
//   const { suspects = [], loading, error } = useSelector((state) => state.suspect);

//   // ✅ Fetch suspects
//   useEffect(() => {
//     dispatch(getAllSuspects());
//   }, [dispatch]);


//   useEffect(() => {
//     refreshAssignments();
//   }, []);

//   // ✅ Fetch telecallers
//   useEffect(() => {
//     const fetchTelecallers = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/api/telecaller/");
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           setEmployees(prev => ({
//             ...prev,
//             Telecaller: data.map(tc => ({ id: tc._id, name: tc.username })),
//           }));
//         } else if (data.telecallers) {
//           setEmployees(prev => ({
//             ...prev,
//             Telecaller: data.telecallers.map(tc => ({ id: tc._id, name: tc.username })),
//           }));
//         }
//       } catch (err) {
//         console.error("Error fetching telecallers:", err);
//       }
//     };
//     fetchTelecallers();
//   }, []);

//   // 🔥 UPDATED: Fetch assignments from backend (permanent storage)
//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         setLoadingAssignments(true);
//         const response = await fetch("http://localhost:8080/api/telecaller/assignments");
//         const result = await response.json();

//         console.log("Assignments API Response:", result);

//         if (response.ok && result.success) {
//           // ✅ Create mapping of suspectId -> assignment data
//           const newAssignedMap = {};
//           result.data.forEach(assignment => {
//             newAssignedMap[assignment.suspectId] = {
//               telecallerName: assignment.telecallerName,
//               assignedAt: assignment.assignedAt,
//               status: assignment.status
//             };
//           });
//           setAssignedMap(newAssignedMap);
//           console.log("Assigned Map:", newAssignedMap);
//         } else {
//           console.error("Failed to fetch assignments:", result.message);
//         }
//       } catch (error) {
//         console.error("Error fetching assignments:", error);
//         toast.error("Failed to load assignment data");
//       } finally {
//         setLoadingAssignments(false);
//       }
//     };

//     fetchAssignments();
//   }, []);

//   // ✅ Checkbox handler with assignment check
//   const handleSuspectSelect = (suspectId) => {
//     if (assignedMap[suspectId]) {
//       toast.warning(`This suspect is already assigned to ${assignedMap[suspectId].telecallerName}`);
//       return;
//     }

//     setSelectedSuspects(prev =>
//       prev.includes(suspectId) ? prev.filter(s => s !== suspectId) : [...prev, suspectId]
//     );
//   };

//   // ✅ Get assignment info
//   const getAssignmentInfo = (suspectId) => {
//     return assignedMap[suspectId] || null;
//   };


//  const refreshAssignments = async () => {
//   try {
//     setLoadingAssignments(true);
//     const response = await fetch("http://localhost:8080/api/telecaller/assignments");
//     const result = await response.json();

//     if (response.ok && result.success) {
//       const newAssignedMap = {};
//       result.data.forEach(assignment => {
//         newAssignedMap[assignment.suspectId] = {
//           telecallerName: assignment.telecallerName,
//           assignedAt: assignment.assignedAt,
//           status: assignment.status
//         };
//       });
//       setAssignedMap(newAssignedMap); // map update
//     }
//   } catch (error) {
//     toast.error("Failed to refresh assignments");
//   } finally {
//     setLoadingAssignments(false);
//   }
// };

// // Get person name
// const getPersonName = () => {
//   if (!role || !selectedPerson) return "-";
//   const roleEmployees = employees[role];
//   const person = roleEmployees.find(emp =>
//     typeof emp === "string" ? emp === selectedPerson : emp.id === selectedPerson
//   );
//   return typeof person === "string" ? person : person?.name || "-";
// };

// // Assign suspects
// const handleAssign = async () => {
//   if (!role || !selectedPerson || selectedSuspects.length === 0) {
//     toast.error("Please fill all required fields");
//     return;
//   }

//   // Double check for already assigned suspects
//   const alreadyAssigned = selectedSuspects.filter(id => assignedMap[id]);
//   if (alreadyAssigned.length > 0) {
//     toast.error("Some suspects are already assigned. Please refresh the page.");
//     return;
//   }

//   setIsAssigning(true);

//   try {
//     const response = await fetch("http://localhost:8080/api/telecaller/assign-suspects", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         role,
//         selectedPerson,
//         suspects: selectedSuspects
//       })
//     });

//     const result = await response.json();

//     if (response.ok && result.success) {
//       toast.success("Suspects assigned successfully!");

//       // Update local assignment map with new assignments
//       const newAssignments = {};
//       selectedSuspects.forEach(suspectId => {
//         newAssignments[suspectId] = {
//           telecallerName: getPersonName(),
//           assignedAt: new Date().toISOString(),
//           status: "assigned"
//         };
//       });

//       setAssignedMap(prev => ({ ...prev, ...newAssignments }));
//       setSelectedSuspects([]);
//       setRole("");
//       setSelectedPerson("");

//       dispatch(getAllSuspects());
//     } else {
//       toast.error(result.message || "Assignment failed");
//     }
//   } catch (error) {
//     toast.error("Network error. Please try again.");
//   } finally {
//     setIsAssigning(false);
//   }
// };


//         // // ✅ Refresh assignments
//         // const refreshAssignments = async () => {
//         //   try {
//         //     setLoadingAssignments(true);
//         //     const response = await fetch("http://localhost:8080/api/telecaller/assignments");
//         //     const result = await response.json();

//         //     if (response.ok && result.success) {
//         //       const newAssignedMap = {};
//         //       result.data.forEach(assignment => {
//         //         newAssignedMap[assignment.suspectId] = {
//         //           telecallerName: assignment.telecallerName,
//         //           assignedAt: assignment.assignedAt,
//         //           status: assignment.status
//         //         };
//         //       });
//         //       setAssignedMap(newAssignedMap);
//         //       toast.success("Assignments refreshed!");
//         //     }
//         //   } catch (error) {
//         //     toast.error("Failed to refresh assignments");
//         //   } finally {
//         //     setLoadingAssignments(false);
//         //   }
//         // };

//         // ✅ Statistics
//         const stats = {
//           total: suspects.length,
//           assigned: Object.keys(assignedMap).length,
//           unassigned: suspects.length - Object.keys(assignedMap).length,
//           selected: selectedSuspects.length
//         };

//         return (
//           <div className="task-container">
//             {/* Statistics Banner */}
//             <div className="stats-banner">
//               <div className="stat-item">
//                 <span className="stat-number">{stats.total}</span>
//                 <span className="stat-label">Total</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number" style={{ color: '#28a745' }}>{stats.assigned}</span>
//                 <span className="stat-label">Assigned</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number" style={{ color: '#007bff' }}>{stats.unassigned}</span>
//                 <span className="stat-label">Available</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number" style={{ color: '#ffc107' }}>{stats.selected}</span>
//                 <span className="stat-label">Selected</span>
//               </div>
//             </div>

//             {/* Loading State */}
//             {loadingAssignments && (
//               <div className="loading-assignments">
//                 <span>🔄 Loading assignments...</span>
//               </div>
//             )}

//             {/* Dropdowns */}
//             <div className="task-dropdowns">
//               <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isAssigning}>
//                 <option value="">Select Role</option>
//                 {Object.keys(employees).map(r => (
//                   <option key={r} value={r}>{r}</option>
//                 ))}
//               </select>

//               <select value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)} disabled={!role || isAssigning}>
//                 <option value="">Select {role || "Person"}</option>
//                 {role && employees[role].map(emp =>
//                   typeof emp === "string" ? (
//                     <option key={emp} value={emp}>{emp}</option>
//                   ) : (
//                     <option key={emp.id} value={emp.id}>{emp.name}</option>
//                   )
//                 )}
//               </select>
//             </div>

//             {/* Selection Summary */}
//             {(role || selectedPerson) && (
//               <div className="selection-summary">
//                 <div className="summary-item">
//                   <strong>Role:</strong> {role || "-"}
//                 </div>
//                 <div className="summary-item">
//                   <strong>Person:</strong> {getPersonName()}
//                 </div>
//                 <div className="summary-item">
//                   <strong>Selected:</strong> {selectedSuspects.length} suspects
//                 </div>
//               </div>
//             )}

//             {/* Suspect Table */}
//             <div className="task-table">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Select</th>
//                     <th>#</th>
//                     <th>Suspect Name</th>
//                     <th>Status</th>
//                     <th>Area</th>
//                     <th>Mobile</th>
//                     <th>Assigned To</th>
//                     {/* <th>Assignment Status</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr><td colSpan="8">Loading suspects...</td></tr>
//                   ) : error ? (
//                     <tr><td colSpan="8">Error loading suspects</td></tr>
//                   ) : suspects.length === 0 ? (
//                     <tr><td colSpan="8">No suspects found</td></tr>
//                   ) : (
//                     suspects.map((suspect, index) => {
//                       const isSelected = selectedSuspects.includes(suspect._id);
//                       const assignment = getAssignmentInfo(suspect._id);
//                       const isAssigned = !!assignment;

//                       return (
//                         <tr key={suspect._id} className={isAssigned ? "assigned-row" : isSelected ? "selected-row" : ""}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={isSelected}
//                               onChange={() => handleSuspectSelect(suspect._id)}
//                               disabled={isAssigning || isAssigned}
//                               title={isAssigned ? `Assigned to: ${assignment.telecallerName}` : "Select for assignment"}
//                             />
//                           </td>
//                           <td>{index + 1}</td>
//                           <td>{suspect.personalDetails?.groupName || "-"}</td>
//                           <td>
//                             <span className={`status-badge ${suspect.status || 'pending'}`}>
//                               {suspect.status || "Pending"}
//                             </span>
//                           </td>
//                           <td>{suspect.personalDetails?.city || "-"}</td>
//                           <td>{suspect.personalDetails?.contactNo || "-"}</td>
//                           <td>
//                             {assignment ? (
//                               <span className="assigned-person">
//                                 ✅ {assignment.telecallerName}
//                                 <br />
//                                 <small>{new Date(assignment.assignedAt).toLocaleDateString()}</small>
//                               </span>
//                             ) : isSelected ? (
//                               <span className="to-assign-person">
//                                 ⏳ {getPersonName()}
//                               </span>
//                             ) : (
//                               <span className="not-assigned">-</span>
//                             )}
//                           </td>
//                           <td>
//                             {/* {assignment ? (
//                               <span className="assigned-badge">Assigned</span>
//                             ) : (
//                               <span className="available-badge">Available</span>
//                             )} */}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Action Buttons */}
//             <div className="task-button">
//               <button className="assign-btn" onClick={handleAssign} disabled={isAssigning || selectedSuspects.length === 0}>
//                 {isAssigning ? "Assigning..." : `Assign ${selectedSuspects.length} Suspect(s)`}
//               </button>

//               <button className="refresh-btn" onClick={refreshAssignments} disabled={loadingAssignments}>
//                 {loadingAssignments ? "Refreshing..." : "🔄 Refresh Assignments"}
//               </button>
//             </div>

//             <style jsx>{`
//         .task-container { max-width: 100%; margin: 20px; padding: 20px; background: #fff; border-radius: 8px; }
        
//       .stats-banner {
//   display: flex;
//   justify-content: space-around;
//   align-items: center;
//   margin-bottom: 25px;
//   padding: 20px 30px;
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   border-radius: 12px;
//   color: #ffffff;
//   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
//   font-weight: 600;
//   font-size: 16px;
//   transition: transform 0.2s, box-shadow 0.2s;
// }

// .stats-banner div {
//   text-align: center;
// }

// .stats-banner div span {
//   display: block;
//   font-size: 22px;
//   font-weight: 700;
//   margin-top: 5px;
// }

// .stats-banner:hover {
//   transform: translateY(-3px);
//   box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
// }

        
//         .loading-assignments { padding: 10px; background: #fff3cd; border-radius: 4px; margin-bottom: 15px; 
//           text-align: center; color: #856404; }
        
//         .task-dropdowns { display: flex; gap: 10px; margin-bottom: 20px; }
//         .task-dropdowns select { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 5px; }
        
//         .selection-summary { display: flex; gap: 20px; padding: 15px; background: #f8f9fa; 
//           border-radius: 5px; margin-bottom: 15px; }
        
//         .task-table { margin-bottom: 20px; overflow-x: auto; }
//         .task-table table { width: 100%; border-collapse: collapse; }
//         .task-table th, .task-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//         .task-table th { background: #f1f1f1; font-weight: 600; }
        
//         .selected-row { background-color: #e8f4fd !important; }
//         .assigned-row { background-color: #f8f9fa !important; opacity: 0.7; }
//         .assigned-row input { cursor: not-allowed; }
        
//         .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
//         .status-badge.pending { background: #fff3cd; color: #856404; }
        
//         .assigned-person { color: #28a745; font-weight: 500; }
//         .to-assign-person { color: #007bff; font-style: italic; }
//         .not-assigned { color: #6c757d; font-style: italic; }
        
//         .assigned-badge { background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 12px; 
//           font-size: 11px; font-weight: bold; }
//         .available-badge { background: #cce7ff; color: #004085; padding: 4px 8px; border-radius: 12px; 
//           font-size: 11px; font-weight: bold; }
        
//         .task-button { display: flex; justify-content: space-between; }
//         .assign-btn { padding: 12px 24px; background: #28a745; color: white; border: none; 
//           border-radius: 5px; cursor: pointer; }
//         .assign-btn:disabled { background: #6c757d; cursor: not-allowed; }
//         .refresh-btn { padding: 12px 20px; background: #17a2b8; color: white; border: none; 
//           border-radius: 5px; cursor: pointer; }
//         .refresh-btn:disabled { background: #6c757d; cursor: not-allowed; }
        
//         @media (max-width: 768px) {
//           .stats-banner { flex-wrap: wrap; gap: 10px; }
//           .task-dropdowns { flex-direction: column; }
//           .selection-summary { flex-direction: column; gap: 10px; }
//           .task-button { flex-direction: column; gap: 10px; }
//         }
//       `}</style>
//           </div>
//         );
//       };
    
//       export default TaskAssign 


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSuspects } from "../../redux/feature/SuspectRedux/SuspectThunx";
import { toast } from "react-toastify";
import axiosInstance from "/src/config/axios";

const TaskAssign = () => {
  const [employees, setEmployees] = useState({
    Telecaller: [],
    HR: ["Ankit", "Neha", "Rahul"],
    Manager: ["Shivam", "Pooja"],
  });

  const [role, setRole] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedSuspects, setSelectedSuspects] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignedMap, setAssignedMap] = useState({});
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  const dispatch = useDispatch();
  const { suspects = [], loading, error } = useSelector((state) => state.suspect);

  // ✅ Fetch suspects
  useEffect(() => {
    dispatch(getAllSuspects());
  }, [dispatch]);

  useEffect(() => {
    refreshAssignments();
  }, []);

  // ✅ Fetch telecallers
  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        const res = await axiosInstance.get("/api/telecaller/");
        const data = res.data; // axios automatically parses JSON

        if (Array.isArray(data)) {
          setEmployees(prev => ({
            ...prev,
            Telecaller: data.map(tc => ({ id: tc._id, name: tc.username })),
          }));
        } else if (data.telecallers) {
          setEmployees(prev => ({
            ...prev,
            Telecaller: data.telecallers.map(tc => ({ id: tc._id, name: tc.username })),
          }));
        }
      } catch (err) {
        console.error("Error fetching telecallers:", err);
      }
    };
    fetchTelecallers();
  }, []);

  // ✅ Fetch assignments
  const refreshAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const response = await axiosInstance.get("/api/telecaller/assignments");
      const result = response.data; // axios automatically parses JSON

      if (response.ok && result.success) {
        const newAssignedMap = {};
        result.data.forEach(assignment => {
          newAssignedMap[assignment.suspectId] = {
            telecallerName: assignment.telecallerName,
            assignedAt: assignment.assignedAt,
            status: assignment.status
          };
        });
        setAssignedMap(newAssignedMap);
      }
    } catch (error) {
      toast.error("Failed to refresh assignments");
    } finally {
      setLoadingAssignments(false);
    }
  };

  // 🔥 NEW: Get available suspects (unassigned)
  const getAvailableSuspects = () => {
    return suspects.filter(suspect => !assignedMap[suspect._id]);
  };

  // 🔥 NEW: Select All functionality
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedSuspects([]);
      setSelectAll(false);
    } else {
      // Select all available suspects
      const availableSuspectIds = getAvailableSuspects().map(suspect => suspect._id);
      setSelectedSuspects(availableSuspectIds);
      setSelectAll(true);
    }
  };

  // ✅ Checkbox handler with assignment check
  const handleSuspectSelect = (suspectId) => {
    if (assignedMap[suspectId]) {
      toast.warning(`This suspect is already assigned to ${assignedMap[suspectId].telecallerName}`);
      return;
    }

    setSelectedSuspects(prev => {
      const newSelection = prev.includes(suspectId) 
        ? prev.filter(s => s !== suspectId)
        : [...prev, suspectId];
      
      // Update select all state
      const availableCount = getAvailableSuspects().length;
      setSelectAll(newSelection.length === availableCount && availableCount > 0);
      
      return newSelection;
    });
  };

  // 🔥 NEW: Range selection with Shift key
  const handleRangeSelect = (suspectId, index, event) => {
    if (event.shiftKey && selectedSuspects.length > 0) {
      // Find the last selected index
      const lastSelectedIndex = suspects.findIndex(s => s._id === selectedSuspects[selectedSuspects.length - 1]);
      
      if (lastSelectedIndex !== -1) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        
        const rangeSuspects = suspects.slice(start, end + 1)
          .filter(suspect => !assignedMap[suspect._id])
          .map(suspect => suspect._id);
        
        // Add range to current selection (avoid duplicates)
        const newSelection = [...new Set([...selectedSuspects, ...rangeSuspects])];
        setSelectedSuspects(newSelection);
        return;
      }
    }
    
    // Normal click without Shift
    handleSuspectSelect(suspectId);
  };

  // ✅ Get assignment info
  const getAssignmentInfo = (suspectId) => {
    return assignedMap[suspectId] || null;
  };

  // ✅ Get person name
  const getPersonName = () => {
    if (!role || !selectedPerson) return "-";
    const roleEmployees = employees[role];
    const person = roleEmployees.find(emp =>
      typeof emp === "string" ? emp === selectedPerson : emp.id === selectedPerson
    );
    return typeof person === "string" ? person : person?.name || "-";
  };

  // ✅ Assign suspects
  const handleAssign = async () => {
    if (!role || !selectedPerson || selectedSuspects.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const alreadyAssigned = selectedSuspects.filter(id => assignedMap[id]);
    if (alreadyAssigned.length > 0) {
      toast.error("Some suspects are already assigned. Please refresh the page.");
      return;
    }

    setIsAssigning(true);

    try {
    const response = await axiosInstance.post("/api/telecaller/assign-suspects", {
      role: role,
      selectedPerson: selectedPerson,
      suspects: selectedSuspects,
    });

      const result = response.data;

      if (result.success) {
        toast.success("Suspects assigned successfully!");

        // Update local assignment map with new assignments
        const newAssignments = {};
        selectedSuspects.forEach(suspectId => {
          newAssignments[suspectId] = {
            telecallerName: getPersonName(),
            assignedAt: new Date().toISOString(),
            status: "assigned"
          };
        });

        setAssignedMap(prev => ({ ...prev, ...newAssignments }));
        setSelectedSuspects([]);
        setSelectAll(false);
        setRole("");
        setSelectedPerson("");

        dispatch(getAllSuspects());
      } else {
        toast.error(result.message || "Assignment failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  // ✅ Statistics
  const availableSuspects = getAvailableSuspects();
  const stats = {
    total: suspects.length,
    assigned: Object.keys(assignedMap).length,
    unassigned: availableSuspects.length,
    selected: selectedSuspects.length
  };

  return (
    <div className="task-container">
      {/* Statistics Banner */}
      <div className="stats-banner">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" style={{ color: '#28a745' }}>{stats.assigned}</span>
          <span className="stat-label">Assigned</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" style={{ color: '#007bff' }}>{stats.unassigned}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" style={{ color: '#ffc107' }}>{stats.selected}</span>
          <span className="stat-label">Selected</span>
        </div>
      </div>

      {/* Selection Tips */}
      <div className="selection-tips">
        <span>💡 <strong>Selection Tips:</strong> </span>
        <span>• Click checkboxes to select individually</span>
        <span>• Use <kbd>Shift + Click</kbd> for range selection</span>
        <span>• Use "Select All Available" for bulk selection</span>
      </div>

      {/* Loading State */}
      {loadingAssignments && (
        <div className="loading-assignments">
          <span>🔄 Loading assignments...</span>
        </div>
      )}

      {/* Dropdowns */}
      <div className="task-dropdowns">
        <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isAssigning}>
          <option value="">Select Role</option>
          {Object.keys(employees).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)} disabled={!role || isAssigning}>
          <option value="">Select {role || "Person"}</option>
          {role && employees[role].map(emp =>
            typeof emp === "string" ? (
              <option key={emp} value={emp}>{emp}</option>
            ) : (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            )
          )}
        </select>
      </div>

      {/* Selection Summary */}
      {(role || selectedPerson || selectedSuspects.length > 0) && (
        <div className="selection-summary">
          <div className="summary-item">
            <strong>Role:</strong> {role || "-"}
          </div>
          <div className="summary-item">
            <strong>Person:</strong> {getPersonName()}
          </div>
          <div className="summary-item">
            <strong>Selected:</strong> 
            <span className="selected-count">{selectedSuspects.length}</span> 
            out of {stats.unassigned} available
          </div>
          <div className="summary-item">
            <button 
              className="select-all-btn"
              onClick={handleSelectAll}
              disabled={stats.unassigned === 0}
            >
              {selectAll ? "❌ Deselect All" : "✅ Select All Available"}
            </button>
          </div>
        </div>
      )}

      {/* Suspect Table */}
      <div className="task-table-container">
        <div className="table-header">
          <h3>Suspects List ({stats.total} total, {stats.unassigned} available)</h3>
          <div className="table-controls">
            <span className="selection-info">
              {selectedSuspects.length > 0 && `${selectedSuspects.length} selected`}
            </span>
            <button 
              className="refresh-btn" 
              onClick={refreshAssignments} 
              disabled={loadingAssignments}
            >
              {loadingAssignments ? "🔄" : "↻"} Refresh
            </button>
          </div>
        </div>

        <div className="table-scroll-container">
          <table className="task-table">
            <thead>
              <tr>
                <th width="80px">
                  <div className="select-all-header">
                    <input
                      type="checkbox"
                      checked={selectAll && stats.unassigned > 0}
                      onChange={handleSelectAll}
                      disabled={stats.unassigned === 0}
                      title={stats.unassigned === 0 ? "No available suspects" : "Select all available"}
                    />
                    <span>Select</span>
                  </div>
                </th>
                <th width="60px">#</th>
                <th>Suspect Name</th>
                <th width="100px">Status</th>
                <th width="120px">Area</th>
                <th width="130px">Mobile</th>
                <th width="200px">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading-row">
                    <div className="loading-spinner">Loading suspects...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="error-row">
                    Error loading suspects
                  </td>
                </tr>
              ) : suspects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No suspects found
                  </td>
                </tr>
              ) : (
                suspects.map((suspect, index) => {
                  const isSelected = selectedSuspects.includes(suspect._id);
                  const assignment = getAssignmentInfo(suspect._id);
                  const isAssigned = !!assignment;
                  const isAvailable = !isAssigned;

                  return (
                    <tr 
                      key={suspect._id} 
                      className={`
                        ${isAssigned ? "assigned-row" : ""} 
                        ${isSelected ? "selected-row" : ""}
                        ${isAvailable ? "available-row" : ""}
                      `}
                      onClick={(e) => {
                        if (e.target.type !== 'checkbox' && isAvailable) {
                          handleRangeSelect(suspect._id, index, e);
                        }
                      }}
                      style={{ cursor: isAvailable ? 'pointer' : 'default' }}
                    >
                      <td>
                        <div className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSuspectSelect(suspect._id)}
                            disabled={isAssigning || isAssigned}
                            title={isAssigned ? `Assigned to: ${assignment.telecallerName}` : "Select for assignment"}
                          />
                        </div>
                      </td>
                      <td className="index-cell">{index + 1}</td>
                      <td className="name-cell">
                        <div className="suspect-name">
                          {suspect.personalDetails?.groupName || "-"}
                          {isSelected && <span className="selected-indicator"> ✓</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${suspect.status || 'pending'}`}>
                          {suspect.status || "Pending"}
                        </span>
                      </td>
                      <td>{suspect.personalDetails?.city || "-"}</td>
                      <td>{suspect.personalDetails?.contactNo || "-"}</td>
                      <td>
                        {assignment ? (
                          <span className="assigned-person">
                            ✅ {assignment.telecallerName}
                            <br />
                            <small>{new Date(assignment.assignedAt).toLocaleDateString()}</small>
                          </span>
                        ) : isSelected ? (
                          <span className="to-assign-person">
                            ⏳ {getPersonName()}
                          </span>
                        ) : (
                          <span className="not-assigned">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      {selectedSuspects.length > 0 && (
        <div className="action-buttons">
          <div className="action-info">
            <span className="selection-count">
              🎯 <strong>{selectedSuspects.length}</strong> suspects selected for assignment
            </span>
            <span className="assign-to-info">
              to <strong>{getPersonName()}</strong> ({role})
            </span>
          </div>
          <div className="button-group">
            <button 
              className="clear-btn"
              onClick={() => {
                setSelectedSuspects([]);
                setSelectAll(false);
              }}
            >
              🗑️ Clear Selection
            </button>
            <button 
              className="assign-btn" 
              onClick={handleAssign}
              disabled={isAssigning}
            >
              {isAssigning ? (
                <>
                  <span className="spinner"></span>
                  Assigning...
                </>
              ) : (
                `🚀 Assign ${selectedSuspects.length} Suspects`
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .task-container {
          max-width: 100%;
          margin: 20px;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stats-banner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 25px;
          padding: 20px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          font-weight: 600;
          font-size: 16px;
        }

        .stats-banner div {
          text-align: center;
        }

        .stats-banner div span {
          display: block;
          font-size: 22px;
          font-weight: 700;
          margin-top: 5px;
        }

        .selection-tips {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
          padding: 12px 20px;
          background: #f0f9ff;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          font-size: 14px;
          color: #0369a1;
          flex-wrap: wrap;
        }

        .selection-tips kbd {
          background: #1e40af;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .loading-assignments {
          padding: 15px;
          background: #fff3cd;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          color: #856404;
        }

        .task-dropdowns {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .task-dropdowns select {
          flex: 1;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .task-dropdowns select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .selection-summary {
          display: flex;
          gap: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .selected-count {
          background: #dc2626;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
        }

        .select-all-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .select-all-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .select-all-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .task-table-container {
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header h3 {
          margin: 0;
          color: #374151;
        }

        .table-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .selection-info {
          color: #059669;
          font-weight: 600;
        }

        .refresh-btn {
          padding: 8px 16px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .table-scroll-container {
          max-height: 600px;
          overflow-y: auto;
          overflow-x: auto;
        }

        .task-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .task-table th {
          background: #f9fafb;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          position: sticky;
          top: 0;
        }

        .task-table td {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s;
        }

        .select-all-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .select-all-header input {
          transform: scale(1.2);
        }

        .available-row:hover {
          background: #f0f9ff !important;
        }

        .selected-row {
          background: #dbeafe !important;
          border-left: 4px solid #3b82f6;
        }

        .assigned-row {
          background: #f0fdf4 !important;
          opacity: 0.7;
        }

        .assigned-row td {
          opacity: 0.7;
        }

        .checkbox-container {
          display: flex;
          justify-content: center;
        }

        .checkbox-container input {
          transform: scale(1.3);
          cursor: pointer;
        }

        .index-cell {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
        }

        .name-cell {
          font-weight: 500;
        }

        .selected-indicator {
          color: #059669;
          font-weight: bold;
          margin-left: 5px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-badge.suspect {
          background: #dbeafe;
          color: #1e40af;
        }

        .assigned-person {
          color: #059669;
          font-weight: 500;
        }

        .to-assign-person {
          color: #3b82f6;
          font-style: italic;
          font-weight: 500;
        }

        .not-assigned {
          color: #9ca3af;
          font-style: italic;
        }

        .loading-row, .error-row, .empty-row {
          text-align: center;
          padding: 40px !important;
          color: #6b7280;
        }

        .action-buttons {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .action-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .selection-count {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .assign-to-info {
          color: #6b7280;
        }

        .button-group {
          display: flex;
          gap: 12px;
        }

        .clear-btn {
          padding: 12px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .clear-btn:hover {
          background: #e5e7eb;
        }

        .assign-btn {
          padding: 12px 24px;
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
        }

        .assign-btn:hover:not(:disabled) {
          background: #047857;
          transform: translateY(-1px);
        }

        .assign-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .task-container {
            margin: 10px;
            padding: 15px;
          }

          .stats-banner {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }

          .selection-tips {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .task-dropdowns {
            flex-direction: column;
          }

          .selection-summary {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .table-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .button-group {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskAssign;










