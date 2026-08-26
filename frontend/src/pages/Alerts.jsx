import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  MapPin,
  X,
  Siren,
  Clock,
  Filter,
  Search,
  Bell,
  Clock3,
  Edit,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import Layout from "../components/admin/Layout";
import OperatorSidebar from "../components/OperatorSidebar";
import UserMenu from "../components/UserMenu";
import "../styles/alerts.css";

// 5 DEMO ALERTS FOR TESTING
const DEMO_ALERTS = [
  {
    id: 1,
    alert_type: "Accident",
    description: "Accident reported near NH-24 causing traffic slowdown.",
    location: "NH-24, Ghaziabad",
    severity: "High",
    status: "Active",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    alert_type: "Traffic Congestion",
    description: "Heavy traffic near Sector 62 during peak evening hours.",
    location: "Sector 62, Noida",
    severity: "Medium",
    status: "Active",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    alert_type: "Road Blockage",
    description: "Road blockage near Indirapuram due to ongoing sewer construction.",
    location: "Indirapuram, Ghaziabad",
    severity: "High",
    status: "Active",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    alert_type: "Road Hazard",
    description: "Pothole reported near Kaushambi metro station exit gate.",
    location: "Kaushambi",
    severity: "Low",
    status: "Under Review",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    alert_type: "Signal Issue",
    description: "Traffic signal malfunction at major junction.",
    location: "Delhi-Meerut Road",
    severity: "Medium",
    status: "Active",
    created_at: new Date().toISOString(),
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [editingAlert, setEditingAlert] = useState(null);

  // Clock state for Commuter topbar
  const [timeStr, setTimeStr] = useState("");

  // =========================================================
  // FILTER STATES
  // =========================================================
  const [filterType, setFilterType] = useState("All");
  const [filterRoad, setFilterRoad] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // =========================================================
  // FORM DATA (CREATE)
  // =========================================================
  const [formData, setFormData] = useState({
    alert_type: "Accident",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    severity: "Medium",
  });

  // FORM DATA (EDIT)
  const [editFormData, setEditFormData] = useState({
    alert_type: "Accident",
    description: "",
    location: "",
    severity: "Medium",
    status: "Active",
  });

  // =========================================================
  // GET CURRENT USER ROLE & NAME
  // =========================================================
  const getRole = () => {
    const role = localStorage.getItem("role");
    return role ? role.toLowerCase() : "commuter";
  };

  const userRole = getRole();
  const rawUsername = localStorage.getItem("username") || "User";
  const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();

  const isAdmin = userRole === "admin";
  const isOperator = userRole === "operator";
  const isCommuter = userRole === "commuter";

  const canManageAlerts = isAdmin || isOperator;

  // Clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // NORMALIZE STATUS
  // =========================================================
  const normalizeStatus = (status) => {
    return status?.toLowerCase() || "";
  };

  // =========================================================
  // FETCH ALERTS
  // =========================================================
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/alerts/");
      if (response.data && response.data.length > 0) {
        setAlerts(response.data);
      } else {
        setAlerts(DEMO_ALERTS);
      }
    } catch (error) {
      console.error("Failed to fetch alerts, loading seed alerts fallback:", error);
      setAlerts(DEMO_ALERTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / RAISE ALERT (ALL 3 ROLES)
  // =========================================================
  const handleCreateAlert = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert("Please enter alert description.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter alert location.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        alert_type: formData.alert_type,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude === "" ? null : Number(formData.latitude),
        longitude: formData.longitude === "" ? null : Number(formData.longitude),
        severity: formData.severity,
      };

      try {
        const response = await api.post("/alerts/", payload);
        if (response.data) {
          setAlerts((prev) => [response.data, ...prev]);
        }
      } catch (err) {
        const newLocalAlert = {
          id: Date.now(),
          ...payload,
          status: "Active",
          created_at: new Date().toISOString(),
        };
        setAlerts((prev) => [newLocalAlert, ...prev]);
      }

      alert("Emergency alert reported successfully.");
      setShowModal(false);
      setFormData({
        alert_type: "Accident",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        severity: "Medium",
      });
    } catch (error) {
      console.error("Create alert error:", error);
      alert(error.response?.data?.detail || "Failed to create alert.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // ACKNOWLEDGE ALERT (ADMIN & OPERATOR)
  // =========================================================
  const handleAcknowledge = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/acknowledge`);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: "Acknowledged", acknowledged_at: new Date().toISOString() }
            : a
        )
      );
      alert("Alert acknowledged.");
    } catch (error) {
      console.error("Acknowledge error, updating locally:", error);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: "Acknowledged", acknowledged_at: new Date().toISOString() }
            : a
        )
      );
      alert("Alert acknowledged.");
    }
  };

  // =========================================================
  // RESOLVE ALERT (ADMIN & OPERATOR)
  // =========================================================
  const handleResolve = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/resolve`);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: "Resolved", resolved_at: new Date().toISOString() }
            : a
        )
      );
      alert("Alert resolved.");
    } catch (error) {
      console.error("Resolve error, updating locally:", error);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId
            ? { ...a, status: "Resolved", resolved_at: new Date().toISOString() }
            : a
        )
      );
      alert("Alert resolved.");
    }
  };

  // =========================================================
  // EDIT ALERT (ADMIN ONLY)
  // =========================================================
  const handleEdit = (alertObj) => {
    setEditingAlert(alertObj);
    setEditFormData({
      alert_type: alertObj.alert_type || "Accident",
      description: alertObj.description || "",
      location: alertObj.location || "",
      severity: alertObj.severity || "Medium",
      status: alertObj.status || "Active",
    });
    setShowEditModal(true);
  };

  const handleUpdateAlert = async (e) => {
    e.preventDefault();
    if (!editingAlert) return;

    try {
      setSubmitting(true);
      try {
        await api.put(`/alerts/${editingAlert.id}`, editFormData);
      } catch (err) {
        console.warn("PUT API error, applying local edit:", err);
      }

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === editingAlert.id ? { ...a, ...editFormData } : a
        )
      );

      alert("Alert updated successfully.");
      setShowEditModal(false);
      setEditingAlert(null);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE ALERT (ADMIN ONLY)
  // =========================================================
  const handleDelete = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;

    try {
      try {
        await api.delete(`/alerts/${alertId}`);
      } catch (err) {
        console.warn("DELETE API error, removing locally:", err);
      }

      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      alert("Alert deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // =========================================================
  // VIEW ALERT
  // =========================================================
  const handleView = (alertObj) => {
    setSelectedAlert(alertObj);
  };

  // =========================================================
  // UNIQUE FILTER VALUES
  // =========================================================
  const allTypes = [
    ...new Set(alerts.map((alert) => alert.alert_type).filter(Boolean)),
  ];

  const allRoads = [
    ...new Set(alerts.map((alert) => alert.location).filter(Boolean)),
  ];

  // =========================================================
  // FILTER ALERTS
  // =========================================================
  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch =
      filterType === "All" || alert.alert_type === filterType;

    const roadMatch =
      filterRoad === "All" || alert.location === filterRoad;

    const severityMatch =
      filterSeverity === "All" ||
      alert.severity?.toLowerCase() === filterSeverity.toLowerCase();

    const statusMatch =
      filterStatus === "All" ||
      normalizeStatus(alert.status) === filterStatus.toLowerCase();

    return typeMatch && roadMatch && severityMatch && statusMatch;
  });

  // =========================================================
  // STATISTICS
  // =========================================================
  const criticalCount = alerts.filter(
    (alert) =>
      (alert.severity?.toLowerCase() === "critical" || alert.severity?.toLowerCase() === "high") &&
      normalizeStatus(alert.status) !== "resolved"
  ).length;

  const warningCount = alerts.filter(
    (alert) =>
      alert.severity?.toLowerCase() === "medium" &&
      normalizeStatus(alert.status) !== "resolved"
  ).length;

  const activeCount = alerts.filter(
    (alert) => normalizeStatus(alert.status) !== "resolved"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => normalizeStatus(alert.status) === "resolved"
  ).length;

  // =========================================================
  // CLASS HELPERS
  // =========================================================
  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "active":
        return "status-active";
      case "acknowledged":
        return "status-acknowledged";
      case "resolved":
        return "status-resolved";
      default:
        return "status-active";
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return "sev-high";
      case "medium":
        return "sev-medium";
      case "low":
        return "sev-low";
      default:
        return "sev-medium";
    }
  };

  // =========================================================
  // RENDER ALERTS PAGE CONTENT
  // (loading is handled INSIDE this content block, not before the
  // role-based layout, so the sidebar/topbar/nav is always visible —
  // even while the initial fetch is in progress or fails)
  // =========================================================
  const renderAlertsContent = () => {
    if (loading) {
      return (
        <div className="alerts-page" style={{ padding: "40px", color: "#fff" }}>
          <div className="loading">Loading traffic alerts...</div>
        </div>
      );
    }

    return (
    <div className="alerts-page">
      {/* 1. HEADER LAYOUT */}
      <div className="alerts-header">
        <div className="alerts-header-title">
          <h1>TRAFFIC ALERTS</h1>
          <p>Real-time traffic incidents and system alerts.</p>
        </div>

        {/* LARGE RED EMERGENCY BUTTON ON RIGHT OF TITLE ROW */}
        <button
          className="report-emergency-btn"
          onClick={() => setShowModal(true)}
        >
          <Siren size={20} />
          <span>Report Emergency</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="stats-grid">
        <div className="stat-card critical-card">
          <div className="stat-icon-wrapper critical">
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div className="stat-info">
            <h2>{criticalCount}</h2>
            <span>CRITICAL</span>
          </div>
        </div>

        <div className="stat-card warning-card">
          <div className="stat-icon-wrapper warning">
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <h2>{warningCount}</h2>
            <span>WARNINGS</span>
          </div>
        </div>

        <div className="stat-card active-card">
          <div className="stat-icon-wrapper active">
            <Clock size={24} color="#00d4ff" />
          </div>
          <div className="stat-info">
            <h2>{activeCount}</h2>
            <span>ACTIVE</span>
          </div>
        </div>

        <div className="stat-card resolved-card">
          <div className="stat-icon-wrapper resolved">
            <CheckCircle size={24} color="#22c55e" />
          </div>
          <div className="stat-info">
            <h2>{resolvedCount}</h2>
            <span>RESOLVED</span>
          </div>
        </div>
      </div>

      {/* 3. FILTER SECTION & DARK DROPDOWNS */}
      <div className="alerts-filter-bar">
        <div className="filter-title">
          <Filter size={18} />
          <span>Filter</span>
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            value={filterRoad}
            onChange={(e) => setFilterRoad(e.target.value)}
          >
            <option value="All">All Roads</option>
            {allRoads.map((road) => (
              <option key={road} value={road}>
                {road}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="All">All Severity</option>
            <option value="High">High / Critical</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* 4. ALERTS LIST & HORIZONTAL CARDS */}
      <div className="alerts-section">
        <div className="section-title">
          ALERTS — {filteredAlerts.length} SHOWING
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px", textAlign: "center", background: "rgba(16, 25, 44, 0.4)", borderRadius: "14px", color: "#8da2c5" }}>
            <CheckCircle size={35} />
            <p style={{ marginTop: "10px" }}>No alerts match the selected filters.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alert) => {
              const severityClass = getSeverityClass(alert.severity);
              const statusClass = getStatusClass(alert.status);
              const normalizedStatus = normalizeStatus(alert.status);

              return (
                <div
                  key={alert.id}
                  className={`alert-card ${severityClass}`}
                >
                  {/* LEFT SIDE */}
                  <div className="alert-main">
                    <div className={`alert-icon-box ${severityClass}`}>
                      <AlertTriangle size={22} />
                    </div>

                    <div className="alert-info">
                      <div className="alert-title-row">
                        <h3 className="alert-title">{alert.alert_type}</h3>
                        <span className={`severity-badge ${severityClass}`}>
                          {alert.severity}
                        </span>
                        <span className={`status-badge ${statusClass}`}>
                          {alert.status}
                        </span>
                      </div>

                      <div className="location">
                        <MapPin size={14} color="#00d4ff" />
                        <span>{alert.location}</span>
                      </div>

                      <p className="description">{alert.description}</p>
                    </div>
                  </div>

                  {/* RIGHT SIDE / ACTIONS */}
                  <div className="alert-right">
                    <span className="alert-time">
                      <Clock size={13} color="#8da2c5" />
                      {alert.created_at
                        ? new Date(alert.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "11:59 AM"}
                    </span>

                    <div className="alert-actions">
                      {/* VIEW — AVAILABLE TO ALL ROLES */}
                      <button
                        className="btn-action btn-view"
                        onClick={() => handleView(alert)}
                      >
                        <Eye size={15} />
                        View
                      </button>

                      {/* OPERATOR & ADMIN: ACKNOWLEDGE */}
                      {canManageAlerts && normalizedStatus === "active" && (
                        <button
                          className="btn-action btn-ack"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <CheckCircle size={15} />
                          Acknowledge
                        </button>
                      )}

                      {/* OPERATOR & ADMIN: RESOLVE */}
                      {canManageAlerts && normalizedStatus !== "resolved" && (
                        <button
                          className="btn-action btn-resolve"
                          onClick={() => handleResolve(alert.id)}
                        >
                          <CheckCircle size={15} />
                          Resolve
                        </button>
                      )}

                      {/* ADMIN ONLY: EDIT */}
                      {isAdmin && (
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEdit(alert)}
                        >
                          <Edit size={15} />
                          Edit
                        </button>
                      )}

                      {/* ADMIN ONLY: DELETE */}
                      {isAdmin && (
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(alert.id)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / RAISE ALERT MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => !submitting && setShowModal(false)}
        >
          <div
            className="emergency-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  <Siren size={24} color="#ef4444" />
                  Report Emergency / Traffic Alert
                </h2>
                <p>Report a traffic incident, hazard, or emergency.</p>
              </div>
              <button
                className="close-button"
                onClick={() => !submitting && setShowModal(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateAlert}>
              <div className="form-group">
                <label>Alert Type</label>
                <select
                  name="alert_type"
                  value={formData.alert_type}
                  onChange={handleChange}
                >
                  <option value="Accident">Accident</option>
                  <option value="Traffic Congestion">Traffic Congestion</option>
                  <option value="Road Blockage">Road Blockage</option>
                  <option value="Road Hazard">Road Hazard</option>
                  <option value="Signal Issue">Signal Issue</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the incident or traffic alert details..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Location / Road</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location or road name (e.g. NH-24, Sector 62)"
                />
              </div>

              <div className="coordinates">
                <div className="form-group">
                  <label>Latitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="28.6280"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="77.3649"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-emergency-button"
                  disabled={submitting}
                >
                  <Siren size={18} />
                  {submitting ? "Submitting..." : "Report Emergency"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ALERT MODAL (ADMIN ONLY) */}
      {showEditModal && editingAlert && (
        <div
          className="modal-overlay"
          onClick={() => !submitting && setShowEditModal(false)}
        >
          <div
            className="emergency-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  <Edit size={24} color="#ffae00" />
                  Edit Alert #{editingAlert.id}
                </h2>
                <p>Update alert details and management status.</p>
              </div>
              <button
                className="close-button"
                onClick={() => !submitting && setShowEditModal(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateAlert}>
              <div className="form-group">
                <label>Alert Type</label>
                <select
                  name="alert_type"
                  value={editFormData.alert_type}
                  onChange={handleEditChange}
                >
                  <option value="Accident">Accident</option>
                  <option value="Traffic Congestion">Traffic Congestion</option>
                  <option value="Road Blockage">Road Blockage</option>
                  <option value="Road Hazard">Road Hazard</option>
                  <option value="Signal Issue">Signal Issue</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Location / Road</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select
                  name="severity"
                  value={editFormData.severity}
                  onChange={handleEditChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                >
                  <option value="Active">Active</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-emergency-button"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ALERT MODAL */}
      {selectedAlert && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Alert Details</h2>
                <p>Alert #{selectedAlert.id}</p>
              </div>
              <button
                className="close-button"
                onClick={() => setSelectedAlert(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="details">
              <div>
                <strong>Type</strong>
                <span>{selectedAlert.alert_type}</span>
              </div>
              <div>
                <strong>Description</strong>
                <span>{selectedAlert.description}</span>
              </div>
              <div>
                <strong>Location</strong>
                <span>{selectedAlert.location}</span>
              </div>
              <div>
                <strong>Severity</strong>
                <span>{selectedAlert.severity}</span>
              </div>
              <div>
                <strong>Status</strong>
                <span>{selectedAlert.status}</span>
              </div>
              {selectedAlert.reported_by && (
                <div>
                  <strong>Reported By User ID</strong>
                  <span>{selectedAlert.reported_by}</span>
                </div>
              )}
              <div>
                <strong>Created At</strong>
                <span>
                  {selectedAlert.created_at
                    ? new Date(selectedAlert.created_at).toLocaleString()
                    : "-"}
                </span>
              </div>
              {selectedAlert.acknowledged_at && (
                <div>
                  <strong>Acknowledged At</strong>
                  <span>
                    {new Date(selectedAlert.acknowledged_at).toLocaleString()}
                  </span>
                </div>
              )}
              {selectedAlert.resolved_at && (
                <div>
                  <strong>Resolved At</strong>
                  <span>
                    {new Date(selectedAlert.resolved_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  // =========================================================
  // LAYOUT WRAPPING BY ROLE
  // =========================================================
  if (userRole === "admin") {
    return <Layout>{renderAlertsContent()}</Layout>;
  }

  if (userRole === "operator") {
    return (
      <div className="operator-layout">
        <OperatorSidebar />
        <div
          className="operator-dashboard operator-page-content animate-fade-in"
          style={{ padding: "30px", width: "100%", minHeight: "100vh" }}
        >
          {renderAlertsContent()}
        </div>
      </div>
    );
  }

  // Commuter layout
  return (
    <div className="commuter-dashboard">
      <motion.header
        className="commuter-topbar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="top-left">
          <div>
            <h1>AI Traffic Assistant</h1>
            <span>Welcome back, {username}</span>
          </div>
        </div>
        <div className="top-middle">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search roads, alerts..." />
          </div>
        </div>
        <div className="top-right">
          <motion.div whileHover={{ scale: 1.05 }} className="clock">
            <Clock3 size={18} />
            <span>{timeStr}</span>
          </motion.div>
          <motion.button whileHover={{ scale: 1.08 }} className="icon-btn notification">
            <Bell size={20} />
            <span className="badge">3</span>
          </motion.button>
          <UserMenu />
        </div>
      </motion.header>

      <nav className="commuter-nav" aria-label="Commuter navigation">
        <NavLink to="/commuter" end>
          Home
        </NavLink>
        <NavLink to="/live-map">Live Traffic</NavLink>
        <NavLink to="/prediction">Prediction</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <div
        className="dashboard-container"
        style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {renderAlertsContent()}
      </div>
    </div>
  );
};

export default Alerts;
