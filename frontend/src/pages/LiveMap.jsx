import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Clock3,
  Car,
  Activity,
  Camera,
  AlertTriangle,
  TrendingUp,
  Zap,
  Info,
  Navigation,
  MapPin
} from "lucide-react";
import api from "../services/api";
import TrafficMap from "../components/TrafficMap";
import GlassCard from "../components/admin/GlassCard";
import Layout from "../components/admin/Layout";
import OperatorSidebar from "../components/OperatorSidebar";
import UserMenu from "../components/UserMenu";
import "../styles/liveMap.css";

export default function LiveMap() {
  const [liveData, setLiveData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // FIND ROUTE (Rapido-style pickup/drop search) ------------------
  // Reads ?origin=&destination= from the URL as an initial value
  // (so links from the dashboard still work), but the user can also
  // pick pickup/drop right here and hit "Find Route".
  const [searchParams, setSearchParams] = useSearchParams();
  const [placeOptions, setPlaceOptions] = useState([]);
  const [pickup, setPickup] = useState(searchParams.get("origin") || "");
  const [drop, setDrop] = useState(searchParams.get("destination") || "");
  const [routeOrigin, setRouteOrigin] = useState(searchParams.get("origin") || "");
  const [routeDestination, setRouteDestination] = useState(searchParams.get("destination") || "");
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    api
      .get("/routes/options")
      .then((res) => setPlaceOptions(res.data.places || []))
      .catch(() => setPlaceOptions([]));
  }, []);

  const handleFindRoute = () => {
    if (!pickup || !drop) return;
    setRouteOrigin(pickup);
    setRouteDestination(drop);
    setSearchParams({ origin: pickup, destination: drop });
  };
  // -----------------------------------------------------------------

  // Filter States
  const [selectedRoad, setSelectedRoad] = useState("All Roads");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedTime, setSelectedTime] = useState("Live / Now");

  // Get Role and Profile from localStorage
  const userRole = localStorage.getItem("role") || "commuter";
  const rawUsername = localStorage.getItem("username") || "User";
  const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();

  // Clock state (for Commuter header)
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    if (userRole === "commuter") {
      const updateClock = () => {
        const now = new Date();
        setTimeStr(
          now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })
        );
      };
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    }
  }, [userRole]);

  const fetchLiveData = async () => {
    try {
      const res = await api.get("/traffic/live");
      setLiveData(res.data);
      setError("");
    } catch (err) {
      setError("Could not load live traffic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Fetch the real route recommendation whenever origin/destination
  // are present in the URL (e.g. coming from "Go" on Favorite Routes,
  // or the AI Route Recommendation card).
  useEffect(() => {
    if (!routeOrigin || !routeDestination) {
      setRouteInfo(null);
      return;
    }
    setRouteLoading(true);
    setRouteError("");
    api
      .get("/routes/recommend", {
        params: { origin: routeOrigin, destination: routeDestination },
      })
      .then((res) => setRouteInfo(res.data))
      .catch(() => setRouteError("No known route between these points yet."))
      .finally(() => setRouteLoading(false));
  }, [routeOrigin, routeDestination]);

  // Filtered Live Data for map
  const filteredData = selectedRoad === "All Roads"
    ? liveData
    : liveData.filter(r => r.road_name === selectedRoad);

  // Derived Insights from filteredData (or liveData if no matches)
  const dataForInsights = filteredData.length > 0 ? filteredData : liveData;

  const avgSpeed = dataForInsights.length > 0
    ? Math.round(dataForInsights.reduce((acc, curr) => acc + curr.average_speed, 0) / dataForInsights.length)
    : 0;

  const hasHigh = dataForInsights.some(r => r.congestion_level === "High");
  const hasMedium = dataForInsights.some(r => r.congestion_level === "Medium");
  const overallCongestion = hasHigh ? "HIGH" : (hasMedium ? "MEDIUM" : "LOW");
  const overallStatus = hasHigh ? "Heavy Traffic" : (hasMedium ? "Moderate Traffic" : "Clear / Flowing");

  const totalCameras = 3;
  const camerasOnline = dataForInsights.length > 0
    ? `${dataForInsights.length} / ${totalCameras}`
    : `0 / ${totalCameras}`;

  const highCongestionZones = dataForInsights.filter(r => r.congestion_level === "High").length;

  let mostCongestedRoad = "None";
  const highRoads = dataForInsights.filter(r => r.congestion_level === "High");
  const medRoads = dataForInsights.filter(r => r.congestion_level === "Medium");
  if (highRoads.length > 0) {
    mostCongestedRoad = highRoads[0].road_name;
  } else if (medRoads.length > 0) {
    mostCongestedRoad = medRoads[0].road_name;
  } else if (dataForInsights.length > 0) {
    mostCongestedRoad = dataForInsights[0].road_name;
  }

  // Summary Text
  const getTrafficSummary = () => {
    if (dataForInsights.length === 0) return "No traffic data available.";
    const highList = dataForInsights.filter(r => r.congestion_level === "High").map(r => r.road_name);
    const avgSpd = avgSpeed;
    if (highList.length > 0) {
      return `High congestion detected around ${highList.join(", ")}. Average speed is currently ${avgSpd} km/h.`;
    }
    return `Traffic is flowing smoothly. Average speed is currently ${avgSpd} km/h.`;
  };

  // Shared Page Content
  const renderContent = () => (
    <div className="live-traffic-dashboard">
      <div className="live-map-header">
        <h1>LIVE TRAFFIC</h1>
        <p>
          {routeOrigin && routeDestination
            ? `Route: ${routeOrigin} → ${routeDestination}`
            : "Real-time traffic monitoring"}
        </p>
      </div>

      {/* FIND ROUTE — Rapido-style pickup/drop search bar */}
      <div className="find-route-bar">
        <div className="find-route-field">
          <MapPin size={16} color="#22c55e" />
          <select value={pickup} onChange={(e) => setPickup(e.target.value)}>
            <option value="">Pickup location</option>
            {placeOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="find-route-field">
          <MapPin size={16} color="#ef4444" />
          <select value={drop} onChange={(e) => setDrop(e.target.value)}>
            <option value="">Drop location</option>
            {placeOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          className="find-route-btn"
          disabled={!pickup || !drop}
          onClick={handleFindRoute}
        >
          <Navigation size={16} />
          Find Route
        </button>
      </div>

      {/* FILTER / CONTROL BAR */}
      <div className="filter-control-bar">
        <div className="filters-left">
          <div className="filter-select-wrapper">
            <select
              value={selectedRoad}
              onChange={(e) => setSelectedRoad(e.target.value)}
              className="filter-select"
            >
              <option value="All Roads">Select Road</option>
              <option value="All Roads">All Roads</option>
              <option value="NH-24">NH-24</option>
              <option value="Ring Road">Ring Road</option>
              <option value="MG Road">MG Road</option>
              <option value="Outer Ring Road">Outer Ring Road</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="filter-select"
            >
              <option value="All Areas">Select Area</option>
              <option value="All Areas">All Areas</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="filter-select"
            >
              <option value="Live / Now">Select Time</option>
              <option value="Live / Now">Live / Now</option>
            </select>
          </div>
        </div>

        <div className="legend-right">
          <span className="legend-label">Traffic Status:</span>
          <span className="legend-item"><i className="legend-dot low" /> Low</span>
          <span className="legend-item"><i className="legend-dot medium" /> Medium</span>
          <span className="legend-item"><i className="legend-dot high" /> High</span>
        </div>
      </div>

      {/* GRID: MAP (70-75%) and INSIGHTS (25-30%) */}
      <div className="live-traffic-grid">
        <div className="map-panel">
          <GlassCard className="map-glass-card">
            {loading && <p className="loading-text">Loading live traffic map...</p>}
            {error && <p className="live-map-error">{error}</p>}
            {/* Map always renders regardless of backend data availability */}
            <TrafficMap
              liveData={filteredData}
              origin={routeOrigin}
              destination={routeDestination}
            />
          </GlassCard>
        </div>

        <div className="insights-panel">
          <div className="insights-header">
            <h2>Traffic Insights</h2>
          </div>

          {/* ROUTE RECOMMENDATION — only shown when this page was
              opened with ?origin=&destination= (Favorite Routes "Go",
              AI Route Recommendation card, Quick Destinations, etc.) */}
          {(routeOrigin && routeDestination) && (
            <div className="traffic-summary-box" style={{ marginBottom: 16 }}>
              <div className="summary-title-row">
                <Navigation size={16} color="#00d4ff" />
                <h3>{routeOrigin} → {routeDestination}</h3>
              </div>

              {routeLoading && <p>Finding the best route…</p>}
              {routeError && <p>{routeError}</p>}

              {routeInfo && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {routeInfo.routes.map((r) => (
                    <div
                      key={r.road_name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: r.recommended ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)",
                        border: r.recommended ? "1px solid #00d4ff" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div>
                        <strong>{r.road_name}</strong>
                        {r.recommended && <span style={{ color: "#00d4ff", fontSize: 11, marginLeft: 8 }}>RECOMMENDED</span>}
                        <div style={{ fontSize: 12, color: "#8da2c5" }}>
                          {r.distance_km} km · {r.congestion_level} traffic
                        </div>
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        {r.estimated_travel_time_minutes} min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="insight-cards-grid">
            <div className="compact-insight-card">
              <div className="insight-icon"><Car size={18} color="#00ff95" /></div>
              <div className="insight-details">
                <span className="insight-label">Avg Speed</span>
                <span className="insight-value">{avgSpeed} km/h</span>
              </div>
            </div>

            <div className="compact-insight-card">
              <div className="insight-icon"><Activity size={18} color="#ffae00" /></div>
              <div className="insight-details">
                <span className="insight-label">Congestion</span>
                <span className="insight-value">{overallCongestion}</span>
              </div>
            </div>

            <div className="compact-insight-card">
              <div className="insight-icon"><Camera size={18} color="#00d4ff" /></div>
              <div className="insight-details">
                <span className="insight-label">Cameras</span>
                <span className="insight-value">{camerasOnline}</span>
              </div>
            </div>

            <div className="compact-insight-card">
              <div className="insight-icon"><AlertTriangle size={18} color="#ff5f5f" /></div>
              <div className="insight-details">
                <span className="insight-label">Incidents</span>
                <span className="insight-value">{highCongestionZones > 0 ? `${highCongestionZones} Zone` : "None"}</span>
              </div>
            </div>

            <div className="compact-insight-card">
              <div className="insight-icon"><TrendingUp size={18} color="#00ff95" /></div>
              <div className="insight-details">
                <span className="insight-label">Most Congested</span>
                <span className="insight-value">{mostCongestedRoad}</span>
              </div>
            </div>

            <div className="compact-insight-card">
              <div className="insight-icon"><Zap size={18} color="#00d4ff" /></div>
              <div className="insight-details">
                <span className="insight-label">Traffic Status</span>
                <span className="insight-value">{overallStatus}</span>
              </div>
            </div>
          </div>

          {/* Traffic Summary */}
          {liveData.length > 0 && (
            <div className="traffic-summary-box">
              <div className="summary-title-row">
                <Info size={16} color="#00d4ff" />
                <h3>Traffic Summary</h3>
              </div>
              <p>{getTrafficSummary()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Wrap based on user role to match the role layout exactly
  if (userRole === "admin") {
    return <Layout>{renderContent()}</Layout>;
  }

  if (userRole === "operator") {
    return (
      <div className="operator-layout">
        <OperatorSidebar />
        <div className="operator-dashboard operator-page-content animate-fade-in" style={{ padding: "30px", width: "100%", minHeight: "100vh" }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  // default to commuter role / layout
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
            <input type="text" placeholder="Search destination..." />
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
        <NavLink to="/commuter" end>Home</NavLink>
        <NavLink to="/live-map">Live Traffic</NavLink>
        <NavLink to="/prediction">Prediction</NavLink>
        <a href="/commuter#routes">Routes</a>
        <NavLink to="/alerts">Alerts</NavLink>
        <a href="/commuter#profile">Profile</a>
      </nav>

      <div className="dashboard-container" style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        {renderContent()}
      </div>
    </div>
  );
}
