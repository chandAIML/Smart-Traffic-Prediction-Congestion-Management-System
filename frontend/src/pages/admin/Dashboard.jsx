import Layout from "../../components/admin/Layout";
import StatCard from "../../components/admin/StatCard";
import GlassCard from "../../components/admin/GlassCard";
import {

    MapContainer,
    TileLayer,
    Marker,
    Popup

} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    Camera,
    Activity,
    Car,
    TriangleAlert,
    TrendingUp,
    BrainCircuit,
    ShieldCheck,
    MapPinned
} from "lucide-react";

import "../../styles/admin/cards.css";
import "../../styles/admin/dashboard.css";

export default function Dashboard() {

    const alerts = [

        {
            road: "NH-44",
            severity: "High",
            status: "Accident"
        },

        {
            road: "Anna Salai",
            severity: "Medium",
            status: "Heavy Traffic"
        },

        {
            road: "Bypass Road",
            severity: "Low",
            status: "Road Work"
        }

    ];

    const cameraIcon = new L.DivIcon({

        html: `

        <div class="camera-marker">

            📷

        </div>

    `,

        className: "",

        iconSize: [30, 30]

    });

    return (

        <Layout>

            <div className="dashboard">

                <div className="stats-grid">
                    <StatCard

                        title="Active Cameras"

                        value="128"

                        change="12 Today"

                        icon={<Camera />}

                        color="#00F5D4"

                    />

                    <StatCard

                        title="Traffic Flow"

                        value="93%"

                        change="5%"

                        icon={<Activity />}

                        color="#8B5CF6"

                    />

                    <StatCard

                        title="Vehicles"

                        value="18.2K"

                        change="845"

                        icon={<Car />}

                        color="#FF9B2F"

                    />

                    <StatCard

                        title="Incidents"

                        value="16"

                        change="2"

                        icon={<TriangleAlert />}

                        color="#FF5C7A"

                    />
                </div>

                <div className="dashboard-grid">

                    <GlassCard className="map-card">

                        <div className="card-header">

                            <h2>

                                <MapPinned />

                                Live Traffic Map

                            </h2>

                            <button>

                                View Live

                            </button>

                        </div>

                        <MapContainer

                            center={[13.0827, 80.2707]}

                            zoom={12}

                            className="traffic-map"

                            zoomControl={false}

                        >

                            <TileLayer

                                attribution='&copy; OpenStreetMap contributors'

                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

                            />

                            <Marker

                                position={[13.0827, 80.2707]}

                                icon={cameraIcon}

                            >

                                <Popup>

                                    AI Camera 01

                                </Popup>

                            </Marker>

                            <Marker

                                position={[13.045, 80.235]}

                                icon={cameraIcon}

                            >

                                <Popup>

                                    AI Camera 02

                                </Popup>

                            </Marker>

                            <Marker

                                position={[13.115, 80.287]}

                                icon={cameraIcon}

                            >

                                <Popup>

                                    AI Camera 03

                                </Popup>

                            </Marker>

                        </MapContainer>

                    </GlassCard>

                    <GlassCard className="alerts-card">

                        <div className="card-header">

                            <h2>

                                <TriangleAlert />

                                Recent Alerts

                            </h2>

                        </div>

                        {

                            alerts.map((item, index) => (

                                <div

                                    className="alert-item"

                                    key={index}

                                >

                                    <div>

                                        <h4>

                                            {item.road}

                                        </h4>

                                        <p>

                                            {item.status}

                                        </p>

                                    </div>

                                    <span>

                                        {item.severity}

                                    </span>

                                </div>

                            ))

                        }

                    </GlassCard>

                    <GlassCard className="insight-card">

                        <div className="card-header">

                            <h2>

                                <BrainCircuit />

                                AI Insights

                            </h2>

                        </div>

                        <div className="insight-box">

                            <ShieldCheck />

                            <h3>

                                Congestion Prediction

                            </h3>

                            <p>

                                AI predicts increased congestion
                                on NH-44 between 5PM and 7PM.

                            </p>

                        </div>

                    </GlassCard>

                    <GlassCard className="trend-card">

                        <div className="card-header">

                            <h2>

                                <TrendingUp />

                                Traffic Trend

                            </h2>

                        </div>

                        <div className="trend-placeholder">

                            <div className="bar one"></div>

                            <div className="bar two"></div>

                            <div className="bar three"></div>

                            <div className="bar four"></div>

                            <div className="bar five"></div>

                            <div className="bar six"></div>

                            <div className="bar seven"></div>

                        </div>

                    </GlassCard>

                </div>

            </div>

        </Layout>

    );

}