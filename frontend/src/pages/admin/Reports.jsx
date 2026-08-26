import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Printer,
  RefreshCw,
  Car,
  Gauge,
  Flame,
  TriangleAlert,
  Clock,
  MapPinned,
} from "lucide-react";

import Layout from "../../components/admin/Layout";
import api from "../../services/api";
import "../../styles/admin/reports.css";

const RANGE_OPTIONS = [
  { label: "24 Hours", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const DEMO_ROADS = ["NH-44", "Outer Ring Road", "Anna Salai", "MG Road"];

const DEMO_REPORT = {
  generated_at: new Date().toISOString(),
  range_days: 7,
  road_filter: "All Roads",
  total_readings: 381,
  roads_covered: 4,
  avg_speed: 31.5,
  high_congestion_count: 62,
  accident_count: 3,
  breakdown: [
    { road_name: "NH-44", readings: 120, avg_speed: 22.4, high_congestion_count: 51, accidents: 2 },
    { road_name: "Outer Ring Road", readings: 98, avg_speed: 29.1, high_congestion_count: 27, accidents: 1 },
    { road_name: "Anna Salai", readings: 87, avg_speed: 33.8, high_congestion_count: 13, accidents: 0 },
    { road_name: "MG Road", readings: 76, avg_speed: 40.5, high_congestion_count: 5, accidents: 0 },
  ],
};

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Reports() {
  const [days, setDays] = useState(7);
  const [road, setRoad] = useState("All Roads");
  const [roadOptions, setRoadOptions] = useState(DEMO_ROADS);

  const [report, setReport] = useState(DEMO_REPORT);
  const [loading, setLoading] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get("/reports/roads")
      .then((res) => {
        if (res.data?.length) setRoadOptions(res.data);
      })
      .catch(() => setRoadOptions(DEMO_ROADS));
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/generate?days=${days}&road=${encodeURIComponent(road)}`);
      const data = res.data?.total_readings ? res.data : { ...DEMO_REPORT, range_days: days, road_filter: road };
      setReport(data);
      setUsingDemo(!res.data?.total_readings);
      setHistory((prev) => [
        { id: Date.now(), generated_at: data.generated_at, range_days: days, road_filter: road },
        ...prev,
      ].slice(0, 6));
    } catch (err) {
      console.error("Report generation failed, showing demo data:", err);
      setReport({ ...DEMO_REPORT, range_days: days, road_filter: road });
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  // Generate an initial preview on first load.
  useEffect(() => {
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadCsv = () => {
    window.open(
      `http://127.0.0.1:8000/reports/export-csv?days=${days}&road=${encodeURIComponent(road)}`,
      "_blank"
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const statCards = useMemo(
    () => [
      { title: "Total Readings", value: report.total_readings, icon: <FileText size={22} />, color: "#00d4ff" },
      { title: "Roads Covered", value: report.roads_covered, icon: <Car size={22} />, color: "#8b5cf6" },
      { title: "Avg Speed", value: `${report.avg_speed} km/h`, icon: <Gauge size={22} />, color: "#22c55e" },
      { title: "High Congestion", value: report.high_congestion_count, icon: <Flame size={22} />, color: "#f59e0b" },
      { title: "Accidents", value: report.accident_count, icon: <TriangleAlert size={22} />, color: "#ef4444" },
    ],
    [report]
  );

  return (
    <Layout>
      <div className="reports-page">
        {/* HEADER */}
        <div className="reports-header">
          <div className="reports-header-title">
            <span className="reports-eyebrow">
              <FileText size={13} />
              Command Center · Reports
            </span>
            <h1>Traffic Reports</h1>
            <p>
              Build a custom report, preview it, then export as CSV or PDF.
              {usingDemo && <span className="demo-flag"> Showing sample data — connect a live traffic feed for real numbers.</span>}
            </p>
          </div>
        </div>

        {/* REPORT BUILDER */}
        <div className="glass-panel builder-panel">
          <div className="glass-shine" />
          <div className="panel-title-row">
            <div className="panel-title">Report Builder</div>
            <span className="panel-subtitle">Choose a range and road, then generate</span>
          </div>

          <div className="builder-controls">
            <div className="builder-field">
              <label>Date Range</label>
              <div className="range-toggle">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={days === opt.value ? "active" : ""}
                    onClick={() => setDays(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-field">
              <label>Road</label>
              <select value={road} onChange={(e) => setRoad(e.target.value)}>
                <option value="All Roads">All Roads</option>
                {roadOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="builder-actions">
              <button className="generate-btn" onClick={generateReport} disabled={loading}>
                <RefreshCw size={16} className={loading ? "spin" : ""} />
                {loading ? "Generating..." : "Generate Report"}
              </button>
              <button className="export-btn" onClick={handleDownloadCsv}>
                <Download size={16} />
                CSV
              </button>
              <button className="export-btn secondary" onClick={handlePrintPdf}>
                <Printer size={16} />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* PRINTABLE REPORT AREA */}
        <div className="printable-report">
          <div className="print-only report-print-header">
            <h2>TrafficVision AI — Traffic Report</h2>
            <p>
              Range: last {report.range_days} day(s) &middot; Road: {report.road_filter} &middot;
              Generated: {formatTimestamp(report.generated_at)}
            </p>
          </div>

          {/* STAT STRIP */}
          <div className="reports-stats-grid">
            {statCards.map((s, i) => (
              <motion.div
                key={s.title}
                className="reports-stat-card"
                style={{ "--accent": s.color }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="stat-icon-circle">{s.icon}</div>
                <div>
                  <h5>{s.title}</h5>
                  <h2>{s.value}</h2>
                </div>
              </motion.div>
            ))}
          </div>

          {/* BREAKDOWN TABLE */}
          <motion.div
            className="glass-panel breakdown-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-shine" />
            <div className="panel-title-row">
              <div className="panel-title">Road-wise Breakdown</div>
              <span className="panel-subtitle">Sorted by high-congestion readings</span>
            </div>
            <div className="breakdown-table-wrapper">
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Road</th>
                    <th>Readings</th>
                    <th>Avg Speed</th>
                    <th>High Congestion</th>
                    <th>Accidents</th>
                  </tr>
                </thead>
                <tbody>
                  {report.breakdown.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-row">No data recorded for this range/road.</td>
                    </tr>
                  )}
                  {report.breakdown.map((row) => (
                    <tr key={row.road_name}>
                      <td>
                        <div className="road-cell">
                          <MapPinned size={13} />
                          {row.road_name}
                        </div>
                      </td>
                      <td>{row.readings}</td>
                      <td>{row.avg_speed} km/h</td>
                      <td>
                        <span className={`congestion-pill ${row.high_congestion_count > 20 ? "high" : row.high_congestion_count > 5 ? "medium" : "low"}`}>
                          {row.high_congestion_count}
                        </span>
                      </td>
                      <td>{row.accidents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* RECENT REPORTS HISTORY (this session only) */}
        <motion.div
          className="glass-panel history-panel no-print"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="glass-shine" />
          <div className="panel-title-row">
            <div className="panel-title">Recently Generated</div>
            <span className="panel-subtitle">This session only</span>
          </div>
          {history.length === 0 ? (
            <p className="history-empty">No reports generated yet this session.</p>
          ) : (
            <ul className="history-list">
              <AnimatePresence initial={false}>
                {history.map((h) => (
                  <motion.li
                    key={h.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Clock size={14} />
                    <span>
                      Last {h.range_days} day(s) &middot; {h.road_filter}
                    </span>
                    <b>{formatTimestamp(h.generated_at)}</b>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
