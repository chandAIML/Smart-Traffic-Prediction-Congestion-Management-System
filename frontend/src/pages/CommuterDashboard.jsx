import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    Clock3,
    MapPinned,
    Route,
    Car,
    Navigation,
    CloudSun,
    AlertTriangle,
    TrendingUp,
    Heart,
    Sparkles,
    ArrowRight,
    Bus,
    ShieldCheck
} from "lucide-react";

import "../styles/commuterDashboard.css";
import UserMenu from "../components/UserMenu";

const stats = [
  {
    title: "Today's Trips",
    value: "6",
    icon: <Car size={30} />,
    color: "#00d4ff",
  },
  {
    title: "Distance",
    value: "42 km",
    icon: <Route size={30} />,
    color: "#00ff95",
  },
  {
    title: "Average ETA",
    value: "18 mins",
    icon: <Clock3 size={30} />,
    color: "#ffae00",
  },
  {
    title: "Saved Routes",
    value: "12",
    icon: <Heart size={30} />,
    color: "#ff3d81",
  },
];

const destinations = [
  {
    name: "Home",
    eta: "12 mins",
    traffic: "Low",
    color: "#00d4ff",
  },
  {
    name: "Office",
    eta: "26 mins",
    traffic: "Medium",
    color: "#00ff95",
  },
  {
    name: "Airport",
    eta: "48 mins",
    traffic: "Heavy",
    color: "#ff5f5f",
  },
  {
    name: "Shopping Mall",
    eta: "19 mins",
    traffic: "Low",
    color: "#ffaa00",
  },
];

const alerts = [
  "Accident reported near Ring Road.",
  "Rain expected after 2 PM.",
  "Metro services delayed by 8 minutes.",
];

export default function CommuterDashboard() {
    const navigate = useNavigate();
    const rawUsername = localStorage.getItem("username") || "Commuter";
    const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();

const [time, setTime] = useState("");

useEffect(() => {

    const updateClock = () => {

        const now = new Date();

        setTime(

            now.toLocaleTimeString([],{

                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"

            })

        );

    };

    updateClock();

    const timer = setInterval(updateClock,1000);

    return ()=>clearInterval(timer);

},[]);
  return (
    <div className="commuter-dashboard">

      <motion.header

    className="commuter-topbar"

    initial={{
        opacity:0,
        y:-30
    }}

    animate={{
        opacity:1,
        y:0
    }}

    transition={{
        duration:.6
    }}

>

    <div className="top-left">

        <div>

            <h1>

                AI Traffic Assistant

            </h1>

            <span>

                Welcome back, {username}

            </span>

        </div>

    </div>

    <div className="top-middle">

        <div className="search-box">

            <Search size={18}/>

            <input

                type="text"

                placeholder="Search destination..."

            />

        </div>

    </div>

    <div className="top-right">

        <motion.div

            whileHover={{
                scale:1.05
            }}

            className="clock"

        >

            <Clock3 size={18}/>

            <span>

                {time}

            </span>

        </motion.div>

        <motion.button

            whileHover={{
                scale:1.08
            }}

            className="icon-btn notification"

        >

            <Bell size={20}/>

            <span className="badge">

                3

            </span>

        </motion.button>

        <UserMenu />

    </div>

</motion.header>

      <nav className="commuter-nav" aria-label="Commuter navigation">
        <NavLink to="/commuter" end>Home</NavLink>
        <NavLink to="/live-map">Live Traffic</NavLink>
        <NavLink to="/prediction">Prediction</NavLink>
        <NavLink to="/live-map">Routes</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <div className="dashboard-container">

        {/* Hero */}

        <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
        >

          <div>

            <h1>

              AI Smart Travel Assistant

            </h1>

            <p>

              Your personalized commuting dashboard powered by AI.
              Receive smarter route suggestions, weather alerts,
              congestion analysis and estimated arrival times.

            </p>

            <div className="hero-buttons">

              <button onClick={() => navigate("/live-map")}>

                <Navigation size={18} />

                Start Navigation

              </button>

              <button className="secondary" onClick={() => navigate("/live-map")}>

                <MapPinned size={18} />

                View Live Map

              </button>

            </div>

          </div>

          <motion.div

            className="hero-circle"

            animate={{
              rotate:360
            }}

            transition={{
              duration:25,
              repeat:Infinity,
              ease:"linear"
            }}

          >

            <Sparkles size={120}/>

          </motion.div>

        </motion.div>

        {/* Stats */}

        <div className="stats-grid">

          {stats.map((item,index)=>(

            <motion.div

              className="stat-card"

              key={index}

              initial={{
                opacity:0,
                y:40
              }}

              animate={{
                opacity:1,
                y:0
              }}

              transition={{
                delay:index*.12
              }}

              whileHover={{
                y:-8,
                scale:1.03
              }}

            >

              <div

                className="icon"

                style={{
                  color:item.color
                }}

              >

                {item.icon}

              </div>

              <div>

                <h2>

                  {item.value}

                </h2>

                <span>

                  {item.title}

                </span>

              </div>

            </motion.div>

          ))}

        </div>

        {/* Quick Destinations */}

        <motion.div

          className="section"

          initial={{
            opacity:0
          }}

          whileInView={{
            opacity:1
          }}

        >

          <h2>

            Quick Destinations

          </h2>

          <div className="destination-grid">

            {destinations.map((place,index)=>(

              <motion.div

                key={index}

                whileHover={{
                  scale:1.05
                }}

                className="destination-card"

              >

                <div

                  className="traffic-dot"

                  style={{
                    background:place.color
                  }}

                />

                <h3>

                  {place.name}

                </h3>

                <p>

                  ETA : {place.eta}

                </p>

                <span>

                  Traffic : {place.traffic}

                </span>

                <button onClick={() => navigate("/live-map")}>

                  Navigate

                  <ArrowRight size={16}/>

                </button>

              </motion.div>

            ))}

          </div>

        </motion.div>
                {/* AI Route + Weather */}

        <div className="two-column-grid">

          <motion.div
            className="ai-card"
            initial={{ opacity:0, x:-40 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ duration:.6 }}
            whileHover={{ y:-5 }}
          >

            <div className="card-header">

              <Sparkles size={22}/>

              <h2>AI Route Recommendation</h2>

            </div>

            <div className="route-box">

              <div className="route">

                <Navigation size={20}/>

                <div>

                  <h3>MKCE → Karur Bus Stand</h3>

                  <span>Fastest Route</span>

                </div>

              </div>

              <div className="route-details">

                <div>

                  <h4>ETA</h4>

                  <span>14 mins</span>

                </div>

                <div>

                  <h4>Traffic</h4>

                  <span className="green">Low</span>

                </div>

                <div>

                  <h4>Distance</h4>

                  <span>9.6 km</span>

                </div>

              </div>

              <div className="ai-message">

                AI detected smooth traffic flow on NH44.
                Choosing this route saves approximately
                <strong> 8 minutes </strong>
                compared to your regular route.

              </div>

              <button onClick={() => navigate("/live-map")}>

                Start AI Navigation

              </button>

            </div>

          </motion.div>



          <motion.div

            className="weather-card"

            initial={{ opacity:0, x:40 }}

            whileInView={{ opacity:1, x:0 }}

            transition={{ duration:.6 }}

            whileHover={{ y:-5 }}

          >

            <div className="card-header">

              <CloudSun size={24}/>

              <h2>

                Weather

              </h2>

            </div>

            <div className="weather-main">

              <CloudSun size={70}/>

              <div>

                <h1>

                  29°C

                </h1>

                <span>

                  Partly Cloudy

                </span>

              </div>

            </div>

            <div className="weather-grid">

              <div>

                <h4>

                  Humidity

                </h4>

                <span>

                  74%

                </span>

              </div>

              <div>

                <h4>

                  Wind

                </h4>

                <span>

                  14 km/h

                </span>

              </div>

              <div>

                <h4>

                  Visibility

                </h4>

                <span>

                  8 km

                </span>

              </div>

              <div>

                <h4>

                  UV

                </h4>

                <span>

                  Moderate

                </span>

              </div>

            </div>

          </motion.div>

        </div>



        {/* Alerts */}



        <motion.div

          className="section"

          initial={{ opacity:0 }}

          whileInView={{ opacity:1 }}

        >

          <h2>

            Live Traffic Alerts

          </h2>

          <div className="alert-list">

            {alerts.map((alert,index)=>(

              <motion.div

                key={index}

                className="alert-card"

                whileHover={{ scale:1.02 }}

              >

                <AlertTriangle size={22}/>

                <span>

                  {alert}

                </span>

              </motion.div>

            ))}

          </div>

        </motion.div>



        {/* Weekly Analytics */}



        <motion.div

          className="analytics-card"

          initial={{ opacity:0,y:40 }}

          whileInView={{ opacity:1,y:0 }}

        >

          <div className="card-header">

            <TrendingUp size={22}/>

            <h2>

              Weekly Travel Summary

            </h2>

          </div>

          <div className="analytics-grid">

            <div>

              <h1>

                168 km

              </h1>

              <span>

                Total Distance

              </span>

            </div>

            <div>

              <h1>

                12 hrs

              </h1>

              <span>

                Travel Time

              </span>

            </div>

            <div>

              <h1>

                91%

              </h1>

              <span>

                On-Time Arrivals

              </span>

            </div>

            <div>

              <h1>

                24

              </h1>

              <span>

                Trips Completed

              </span>

            </div>

          </div>

        </motion.div>
        
        {/* Bottom Grid */}

        <div className="bottom-grid">

          {/* Favorite Routes */}

          <motion.div
            className="favorites-card"
            initial={{ opacity:0, y:40 }}
            whileInView={{ opacity:1, y:0 }}
            whileHover={{ y:-5 }}
          >

            <div className="card-header">

              <Heart size={22}/>

              <h2>

                Favorite Routes

              </h2>

            </div>

            <div className="favorite-item">

              <div>

                <h3>

                  Home → College

                </h3>

                <span>

                  12 km • 16 mins

                </span>

              </div>

              <button onClick={() => navigate("/live-map")}>

                Go

              </button>

            </div>

            <div className="favorite-item">

              <div>

                <h3>

                  College → Bus Stand

                </h3>

                <span>

                  8 km • 11 mins

                </span>

              </div>

              <button onClick={() => navigate("/live-map")}>

                Go

              </button>

            </div>

            <div className="favorite-item">

              <div>

                <h3>

                  Home → Airport

                </h3>

                <span>

                  56 km • 54 mins

                </span>

              </div>

              <button onClick={() => navigate("/live-map")}>

                Go

              </button>

            </div>

          </motion.div>





          {/* Public Transport */}

          <motion.div

            className="transport-card"

            initial={{ opacity:0,y:40 }}

            whileInView={{ opacity:1,y:0 }}

            whileHover={{ y:-5 }}

          >

            <div className="card-header">

              <Bus size={22}/>

              <h2>

                Public Transport

              </h2>

            </div>

            <div className="transport-item">

              <Bus size={18}/>

              <div>

                <h3>

                  Bus 21A

                </h3>

                <span>

                  Arriving in 4 mins

                </span>

              </div>

            </div>

            <div className="transport-item">

              <Bus size={18}/>

              <div>

                <h3>

                  Bus 47C

                </h3>

                <span>

                  Arriving in 9 mins

                </span>

              </div>

            </div>

            <div className="transport-item">

              <Bus size={18}/>

              <div>

                <h3>

                  Metro Line 2

                </h3>

                <span>

                  Delayed by 6 mins

                </span>

              </div>

            </div>

          </motion.div>





          {/* Recent Trips */}

          <motion.div

            className="recent-card"

            initial={{ opacity:0,y:40 }}

            whileInView={{ opacity:1,y:0 }}

            whileHover={{ y:-5 }}

          >

            <div className="card-header">

              <Clock3 size={22}/>

              <h2>

                Recent Trips

              </h2>

            </div>

            <table>

              <thead>

                <tr>

                  <th>Route</th>

                  <th>Time</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>Home → College</td>

                  <td>08:15 AM</td>

                  <td className="green">

                    Completed

                  </td>

                </tr>

                <tr>

                  <td>College → Bus Stand</td>

                  <td>02:10 PM</td>

                  <td className="green">

                    Completed

                  </td>

                </tr>

                <tr>

                  <td>Bus Stand → Home</td>

                  <td>06:40 PM</td>

                  <td className="orange">

                    Scheduled

                  </td>

                </tr>

              </tbody>

            </table>

          </motion.div>

        </div>





        {/* Quick Actions */}

        <motion.div

          className="quick-actions"

          initial={{ opacity:0 }}

          whileInView={{ opacity:1 }}

        >

          <h2>

            Quick Actions

          </h2>

          <div className="action-grid">

            <button onClick={() => navigate("/live-map")}>

              <Navigation size={22}/>

              Navigate

            </button>

            <button onClick={() => navigate("/alerts")}>

              <Bell size={22}/>

              Alerts

            </button>

            <button onClick={() => navigate("/live-map")}>

              <Route size={22}/>

              My Routes

            </button>

            <button onClick={() => navigate("/live-map")}>

              <MapPinned size={22}/>

              Live Map

            </button>

          </div>

        </motion.div>





        {/* Safety Card */}

        <motion.div

          className="safety-card"

          initial={{ opacity:0,y:40 }}

          whileInView={{ opacity:1,y:0 }}

        >

          <ShieldCheck size={50}/>

          <div>

            <h2>

              Safety Score

            </h2>

            <p>

              Your driving route is considered safe today.
              AI predicts low congestion and no severe weather
              conditions.

            </p>

          </div>

          <h1>

            96%

          </h1>

        </motion.div>

      </div>

    </div>

  );

}
