import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  Car,
  TriangleAlert,
  Flame,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Layout from "../../components/admin/Layout";
import api from "../../services/api";
import "../../styles/admin/analytics.css";

// Fallback demo data so the page still looks complete before real
// traffic_data rows exist in the database.
const DEMO_OVERVIEW = {
  roads_monitored: 6,
  avg_speed: 34.2,
  high_congestion_roads: 2,
  accident_reports: 3,
};

const DEMO_TREND = Array.from({ length: 7 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  avg_speed: 28 + Math.round(Math.random() * 15),
  avg_congestion_score: +(1 + Math.random() * 2).toFixed(2),
}));

const DEMO_PERFORMANCE = [
  { road_name: "NH-44", avg_speed: 22.4, readings: 120, high_congestion_pct: 42.5, accidents: 2 },
  { road_name: "Outer Ring Road", avg_speed: 29.1, readings: 98, high_congestion_pct: 28.0, accidents: 1 },
  { road_name: "Anna Salai", avg_speed: 33.8, readings: 87, high_congestion_pct: 15.2, accidents: 0 },
  { road_name: "MG Road", avg_speed: 40.5, readings: 76, high_congestion_pct: 6.4, accidents: 0 },
];

const DEMO_HEATMAP = [
  {
    road_name: "NH-44",
    cells: Array.from({ length: 24 }).map((_, hour) => ({
      hour,
      avg_congestion_score: +(1 + Math.random() * 2).toFixed(2),
    })),
  },
  {
    road_name: "Outer Ring Road",
    cells: Array.from({ length: 24 }).map((_, hour) => ({
      hour,
      avg_congestion_score: +(1 + Math.random() * 2).toFixed(2),
    })),
  },
];

const DEMO_INSIGHTS = [
  "NH-44 recorded the highest share of high-congestion readings this week.",
  "Peak monitoring activity was around 18:00 hrs.",
  "3 accident report(s) logged in this period.",
];

const RANGE_OPTIONS = [
  { label: "24 Hours", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

function heatColor(score) {
  if (score == null) return "rgba(255,255,255,0.04)";
  if (score < 1.5) return "rgba(34,197,94,0.75)"; // low - green
  if (score < 2.3) return "rgba(245,158,11,0.8)"; // medium - amber
  return "rgba(239,68,68,0.85)"; // high - red
}

const CONGESTION_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

export default function Analytics() {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const [overview, setOverview] = useState(DEMO_OVERVIEW);
  const [trend, setTrend] = useState(DEMO_TREND);
  const [performance, setPerformance] = useState(DEMO_PERFORMANCE);
  const [heatmap, setHeatmap] = useState(DEMO_HEATMAP);
  const [insights, setInsights] = useState(DEMO_INSIGHTS);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ov, tr, perf, heat, ins] = await Promise.all([
        api.get(`/analytics/overview?days=${days}`),
        api.get(`/analytics/trend?days=${days}`),
        api.get(`/analytics/road-performance?days=${days}`),
        api.get(`/analytics/heatmap?days=${days}`),
        api.get(`/analytics/insights?days=${days}`),
      ]);

      setOverview(ov.data?.roads_monitored ? ov.data : DEMO_OVERVIEW);
      setTrend(tr.data?.length ? tr.data : DEMO_TREND);
      setPerformance(perf.data?.length ? perf.data : DEMO_PERFORMANCE);
      setHeatmap(heat.data?.length ? heat.data : DEMO_HEATMAP);
      setInsights(ins.data?.insights?.length ? ins.data.insights : DEMO_INSIGHTS);
      setUsingDemo(!(ov.data?.roads_monitored));
    } catch (err) {
      console.error("Analytics fetch failed, showing demo data:", err);
      setOverview(DEMO_OVERVIEW);
      setTrend(DEMO_TREND);
      setPerformance(DEMO_PERFORMANCE);
      setHeatmap(DEMO_HEATMAP);
      setInsights(DEMO_INSIGHTS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleExport = () => {
    window.open(`http://127.0.0.1:8000/reports/export-csv?days=${days}`, "_blank");
  };

  const statCards = useMemo(
    () => [
      {
        title: "Roads Monitored",
        value: overview.roads_monitored,
        icon: <Car size={22} />,
        color: "#00d4ff",
      },
      {
        title: "Avg City Speed",
        value: `${overview.avg_speed} km/h`,
        icon: <Gauge size={22} />,
        color: "#22c55e",
      },
      {
        title: "High-Congestion Roads",
        value: overview.high_congestion_roads,
        icon: <Flame size={22} />,
        color: "#f59e0b",
      },
      {
        title: "Accident Reports",
        value: overview.accident_reports,
        icon: <TriangleAlert size={22} />,
        color: "#ef4444",
      },
    ],
    [overview]
  );

  // Historical Insights pie: bucket every heatmap reading into
  // Low / Medium / High congestion so the insights panel has an
  // actual chart to show, not just plain text lines.
  const congestionPieData = useMemo(() => {
    let low = 0, medium = 0, high = 0;
    heatmap.forEach((road) => {
      road.cells.forEach((cell) => {
        const score = cell.avg_congestion_score;
        if (score == null) return;
        if (score < 1.5) low += 1;
        else if (score < 2.3) medium += 1;
        else high += 1;
      });
    });
    return [
      { name: "Low", value: low },
      { name: "Medium", value: medium },
      { name: "High", value: high },
    ].filter((d) => d.value > 0);
  }, [heatmap]);

  return (
    <Layout>
      <div className="analytics-page">
        <div className="analytics-header">
          <div className="analytics-header-title">
            <h1>TRAFFIC ANALYTICS</h1>
            <p>
              Congestion heatmaps, trends & road performance insights.
              {usingDemo && <span className="demo-flag"> Showing sample data — connect live traffic feed for real numbers.</span>}
            </p>
          </div>

          <div className="analytics-controls">
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
            <button className="icon-btn" onClick={fetchAll} title="Refresh">
              <RefreshCw size={18} className={loading ? "spin" : ""} />
            </button>
            <button className="export-btn" onClick={handleExport}>
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="analytics-stats-grid">
          {statCards.map((s) => (
            <motion.div
              key={s.title}
              className="analytics-stat-card"
              style={{ "--accent": s.color }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div>
                <h5>{s.title}</h5>
                <h2>{s.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TRAFFIC TREND — full width panel */}
        <div className="glass-panel trend-panel">
          <div className="panel-title">Traffic Trend</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="speedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="congestionColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="#8da2c5" fontSize={12} />
              <YAxis stroke="#8da2c5" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#10192c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Area type="monotone" dataKey="avg_speed" name="Avg Speed (km/h)" stroke="#00d4ff" fill="url(#speedColor)" strokeWidth={2} />
              <Area type="monotone" dataKey="avg_congestion_score" name="Congestion Score" stroke="#f59e0b" fill="url(#congestionColor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* HISTORICAL INSIGHTS — full width panel, pie chart of
            congestion severity + the narrative insight lines */}
        <div className="glass-panel insights-panel">
          <div className="panel-title">Historical Insights</div>
          <div className="insights-panel-body">
            <div className="insights-pie-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={congestionPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {congestionPieData.map((entry) => (
                      <Cell key={entry.name} fill={CONGESTION_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#10192c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-caption">Congestion reading split (Low / Medium / High)</div>
            </div>

            <ul className="insights-list">
              {insights.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* HEATMAP */}
        <div className="glass-panel heatmap-panel">
          <div className="panel-title">Congestion Heatmap (by hour)</div>
          <div className="heatmap-scroll">
            <div className="heatmap-hours-row">
              <div className="heatmap-road-label" />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="heatmap-hour-label">{h}</div>
              ))}
            </div>
            {heatmap.map((row) => (
              <div key={row.road_name} className="heatmap-row">
                <div className="heatmap-road-label">{row.road_name}</div>
                {row.cells.map((cell) => (
                  <div
                    key={cell.hour}
                    className="heatmap-cell"
                    style={{ background: heatColor(cell.avg_congestion_score) }}
                    title={`${row.road_name} @ ${cell.hour}:00 — score ${cell.avg_congestion_score ?? "N/A"}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span><i style={{ background: "rgba(34,197,94,0.75)" }} /> Low</span>
            <span><i style={{ background: "rgba(245,158,11,0.8)" }} /> Medium</span>
            <span><i style={{ background: "rgba(239,68,68,0.85)" }} /> High</span>
          </div>
        </div>

        {/* ROAD PERFORMANCE TABLE */}
        <div className="glass-panel performance-panel">
          <div className="panel-title">Road Performance</div>
          <div className="performance-table-wrapper">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Road</th>
                  <th>Avg Speed</th>
                  <th>Readings</th>
                  <th>High Congestion %</th>
                  <th>Accidents</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((row) => (
                  <tr key={row.road_name}>
                    <td>{row.road_name}</td>
                    <td>{row.avg_speed} km/h</td>
                    <td>{row.readings}</td>
                    <td>
                      <div className="pct-bar-wrapper">
                        <div
                          className="pct-bar"
                          style={{
                            width: `${Math.min(row.high_congestion_pct, 100)}%`,
                            background:
                              row.high_congestion_pct > 30
                                ? "#ef4444"
                                : row.high_congestion_pct > 12
                                ? "#f59e0b"
                                : "#22c55e",
                          }}
                        />
                        <span>{row.high_congestion_pct}%</span>
                      </div>
                    </td>
                    <td>{row.accidents}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
