import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import {

    Activity,
    AlertTriangle,
    Bell,
    Camera,
    Car,
    Clock3,
    Cpu,
    Map,
    Navigation,
    Radar,
    Search,
    Shield,
    Signal,
    Sun,
    TrendingUp,
    Wifi,
    Zap

} from "lucide-react";

import "../styles/operatorDashboard.css";
import OperatorSidebar from "../components/OperatorSidebar";
import UserMenu from "../components/UserMenu";

const stats = [

    {

        title:"Active Signals",
        value:"124",
        icon:<Signal size={32}/>,
        color:"#00d4ff"

    },

    {

        title:"Live Cameras",
        value:"52",
        icon:<Camera size={32}/>,
        color:"#00ff9d"

    },

    {

        title:"Incidents",
        value:"08",
        icon:<AlertTriangle size={32}/>,
        color:"#ff5c72"

    },

    {

        title:"Emergency Units",
        value:"17",
        icon:<Shield size={32}/>,
        color:"#ffc400"

    }

];

const cameras=[

    {
        name:"Camera 01",
        status:"ONLINE"
    },

    {
        name:"Camera 02",
        status:"ONLINE"
    },

    {
        name:"Camera 03",
        status:"OFFLINE"
    },

    {
        name:"Camera 04",
        status:"ONLINE"
    }

];

const incidents=[

    "Accident at NH44 Junction",

    "Heavy Traffic near Bus Stand",

    "Road Closure at Main Bridge",

    "VIP Convoy Scheduled"

];

export default function OperatorDashboard(){

    const navigate = useNavigate();
    const rawUsername = localStorage.getItem("username") || "Operator";
    const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();

    const [time,setTime]=useState("");

    useEffect(()=>{

        const updateClock=()=>{

            const now=new Date();

            setTime(

                now.toLocaleTimeString([],{

                    hour:"2-digit",
                    minute:"2-digit",
                    second:"2-digit"

                })

            );

        };

        updateClock();

        const timer=setInterval(updateClock,1000);

        return ()=>clearInterval(timer);

    },[]);

    const particlesInit=async(engine)=>{

        await loadSlim(engine);

    };

    return(

        <div className="operator-layout">

            <OperatorSidebar />

            <div className="operator-dashboard operator-page-content">

            <Particles

                id="tsparticles"

                init={particlesInit}

                options={{

                    background:{
                        color:"transparent"
                    },

                    fpsLimit:60,

                    particles:{

                        number:{
                            value:55
                        },

                        color:{
                            value:"#00d4ff"
                        },

                        links:{
                            enable:true,
                            color:"#00d4ff",
                            opacity:.15
                        },

                        move:{
                            enable:true,
                            speed:1
                        },

                        opacity:{
                            value:.25
                        },

                        size:{
                            value:2
                        }

                    }

                }}

            />

            {/* TOPBAR */}

            <motion.header

                className="operator-topbar"

                initial={{

                    opacity:0,
                    y:-30

                }}

                animate={{

                    opacity:1,
                    y:0

                }}

            >

                <div className="top-left">

                    <h1>

                        AI Traffic Operations Center

                    </h1>

                    <span>

                        Welcome back, {username}

                    </span>

                </div>

                <div className="top-middle">

                    <div className="search-box">

                        <Search size={18}/>

                        <input

                            placeholder="Search cameras, roads..."

                        />

                    </div>

                </div>

                <div className="top-right">

                    <div className="clock">

                        <Clock3 size={18}/>

                        {time}

                    </div>

                    <button className="icon-btn notification">

                        <Bell size={20}/>

                        <span className="badge">

                            5

                        </span>

                    </button>

                    <UserMenu />

                </div>

            </motion.header>

            <div className="operator-container">

                {/* HERO */}

                <motion.div

                    className="hero"

                    initial={{

                        opacity:0,
                        y:40

                    }}

                    animate={{

                        opacity:1,
                        y:0

                    }}

                >

                    <div>

                        <h1>

                            Smart Traffic Command Center

                        </h1>

                        <p>

                            Monitor traffic, cameras, emergency vehicles,
                            incidents and AI recommendations in real time.

                        </p>

                        <div className="hero-buttons">

                            <button onClick={() => navigate("/live-map")}>

                                <Navigation size={18}/>

                                Open Live Map

                            </button>

                            <button className="secondary" onClick={() => navigate("/prediction")}>

                                <Radar size={18}/>

                                AI Monitor

                            </button>

                        </div>

                    </div>

                    <motion.div

                        className="hero-icon"

                        animate={{

                            rotate:360

                        }}

                        transition={{

                            repeat:Infinity,

                            duration:20,

                            ease:"linear"

                        }}

                    >

                        <Cpu size={120}/>

                    </motion.div>

                </motion.div>

                {/* STATS */}

                <div className="stats-grid">

                    {

                        stats.map((item,index)=>(

                            <motion.div

                                key={index}

                                className="glass-card"

                                initial={{

                                    opacity:0,

                                    y:30

                                }}

                                animate={{

                                    opacity:1,

                                    y:0

                                }}

                                transition={{

                                    delay:index*.12

                                }}

                                whileHover={{

                                    y:-10,

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

                        ))

                    }

                </div>
                                {/* ============================
                    MAIN GRID
                ============================ */}

                <div className="main-grid">

                    {/* Live Map */}

                    <motion.div

                        className="glass-card map-card shine"

                        initial={{opacity:0,x:-40}}

                        whileInView={{opacity:1,x:0}}

                        whileHover={{y:-5}}

                    >

                        <div className="section-header">

                            <Map size={22}/>

                            <h2>

                                Live City Traffic Map

                            </h2>

                        </div>

                        <div className="map-area">

                            <div className="grid-lines"></div>

                            <div className="pulse pulse1"></div>

                            <div className="pulse pulse2"></div>

                            <div className="pulse pulse3"></div>

                            <div className="pulse pulse4"></div>

                            <div className="pulse pulse5"></div>

                            <div className="road road1"></div>

                            <div className="road road2"></div>

                            <div className="road road3"></div>

                            <div className="road road4"></div>

                        </div>

                    </motion.div>



                    {/* AI Assistant */}

                    <motion.div

                        className="glass-card ai-panel shine"

                        initial={{opacity:0,x:40}}

                        whileInView={{opacity:1,x:0}}

                        whileHover={{y:-5}}

                    >

                        <div className="section-header">

                            <Zap size={22}/>

                            <h2>

                                AI Assistant

                            </h2>

                        </div>

                        <div className="ai-message">

                            AI has detected unusual congestion near

                            <strong>

                                NH44 Junction

                            </strong>

                            due to road maintenance.

                        </div>

                        <div className="ai-box">

                            <h4>

                                Suggested Action

                            </h4>

                            <p>

                                Redirect traffic through Bypass Road

                                to reduce congestion by

                                <strong>

                                    18%

                                </strong>

                            </p>

                        </div>

                        <div className="ai-box">

                            <h4>

                                Estimated Clearance

                            </h4>

                            <p>

                                16 Minutes

                            </p>

                        </div>

                    </motion.div>

                </div>



                {/* ============================
                    SIGNALS
                ============================ */}

                <motion.div

                    className="glass-card signal-card shine"

                    initial={{opacity:0,y:40}}

                    whileInView={{opacity:1,y:0}}

                >

                    <div className="section-header">

                        <Signal size={22}/>

                        <h2>

                            Live Signal Status

                        </h2>

                    </div>

                    <div className="signal-grid">

                        <div className="signal">

                            <span className="green-light"></span>

                            <h3>

                                North Junction

                            </h3>

                            <p>

                                GREEN

                            </p>

                        </div>

                        <div className="signal">

                            <span className="yellow-light"></span>

                            <h3>

                                East Avenue

                            </h3>

                            <p>

                                WAIT

                            </p>

                        </div>

                        <div className="signal">

                            <span className="red-light"></span>

                            <h3>

                                Bus Stand

                            </h3>

                            <p>

                                STOP

                            </p>

                        </div>

                        <div className="signal">

                            <span className="green-light"></span>

                            <h3>

                                Railway Gate

                            </h3>

                            <p>

                                GREEN

                            </p>

                        </div>

                    </div>

                </motion.div>



                {/* ============================
                    Cameras + Incidents
                ============================ */}

                <div className="bottom-layout">

                    <motion.div

                        className="glass-card camera-card shine"

                        initial={{opacity:0,x:-30}}

                        whileInView={{opacity:1,x:0}}

                    >

                        <div className="section-header">

                            <Camera size={22}/>

                            <h2>

                                Live Cameras

                            </h2>

                        </div>

                        <div className="camera-grid">

                            {

                                cameras.map((camera,index)=>(

                                    <div

                                        key={index}

                                        className="camera-box"

                                    >

                                        <Camera size={34}/>

                                        <h4>

                                            {camera.name}

                                        </h4>

                                        <span

                                            className={

                                                camera.status==="ONLINE"

                                                ?

                                                "online"

                                                :

                                                "offline"

                                            }

                                        >

                                            {camera.status}

                                        </span>

                                    </div>

                                ))

                            }

                        </div>

                    </motion.div>



                    <motion.div

                        className="glass-card incident-card shine"

                        initial={{opacity:0,x:30}}

                        whileInView={{opacity:1,x:0}}

                    >

                        <div className="section-header">

                            <AlertTriangle size={22}/>

                            <h2>

                                Incident Queue

                            </h2>

                        </div>

                        {

                            incidents.map((incident,index)=>(

                                <div

                                    key={index}

                                    className="incident"

                                >

                                    <AlertTriangle size={18}/>

                                    <span>

                                        {incident}

                                    </span>

                                </div>

                            ))

                        }

                    </motion.div>

                </div>
                                {/* ============================
                    OPERATIONS GRID
                ============================ */}

                <div className="operations-grid">

                    {/* Emergency Units */}

                    <motion.div

                        className="glass-card emergency-card shine"

                        initial={{opacity:0,y:30}}

                        whileInView={{opacity:1,y:0}}

                        whileHover={{y:-5}}

                    >

                        <div className="section-header">

                            <Shield size={22}/>

                            <h2>

                                Emergency Units

                            </h2>

                        </div>

                        <div className="unit">

                            <Car size={18}/>

                            <div>

                                <h4>

                                    Ambulance A-12

                                </h4>

                                <span>

                                    En Route • ETA 5 mins

                                </span>

                            </div>

                        </div>

                        <div className="unit">

                            <Car size={18}/>

                            <div>

                                <h4>

                                    Traffic Patrol P-08

                                </h4>

                                <span>

                                    Active Monitoring

                                </span>

                            </div>

                        </div>

                        <div className="unit">

                            <Car size={18}/>

                            <div>

                                <h4>

                                    Highway Rescue R-02

                                </h4>

                                <span>

                                    Available

                                </span>

                            </div>

                        </div>

                    </motion.div>



                    {/* Traffic Density */}

                    <motion.div

                        className="glass-card density-card shine"

                        initial={{opacity:0,y:30}}

                        whileInView={{opacity:1,y:0}}

                        whileHover={{y:-5}}

                    >

                        <div className="section-header">

                            <TrendingUp size={22}/>

                            <h2>

                                Traffic Density

                            </h2>

                        </div>

                        <div className="density-item">

                            <span>North Highway</span>

                            <div className="progress">

                                <div

                                    className="progress-fill high"

                                    style={{width:"85%"}}

                                ></div>

                            </div>

                            <strong>85%</strong>

                        </div>

                        <div className="density-item">

                            <span>City Center</span>

                            <div className="progress">

                                <div

                                    className="progress-fill medium"

                                    style={{width:"58%"}}

                                ></div>

                            </div>

                            <strong>58%</strong>

                        </div>

                        <div className="density-item">

                            <span>Airport Road</span>

                            <div className="progress">

                                <div

                                    className="progress-fill low"

                                    style={{width:"28%"}}

                                ></div>

                            </div>

                            <strong>28%</strong>

                        </div>

                    </motion.div>



                    {/* Weather */}

                    <motion.div

                        className="glass-card weather-card shine"

                        initial={{opacity:0,y:30}}

                        whileInView={{opacity:1,y:0}}

                        whileHover={{y:-5}}

                    >

                        <div className="section-header">

                            <Sun size={22}/>

                            <h2>

                                Weather

                            </h2>

                        </div>

                        <h1>

                            31°C

                        </h1>

                        <p>

                            Clear Sky

                        </p>

                        <div className="weather-info">

                            <div>

                                <span>Humidity</span>

                                <strong>64%</strong>

                            </div>

                            <div>

                                <span>Wind</span>

                                <strong>18 km/h</strong>

                            </div>

                            <div>

                                <span>Visibility</span>

                                <strong>12 km</strong>

                            </div>

                        </div>

                    </motion.div>

                </div>



                {/* ============================
                    SYSTEM STATUS
                ============================ */}

                <motion.div

                    className="glass-card system-card shine"

                    initial={{opacity:0,y:40}}

                    whileInView={{opacity:1,y:0}}

                >

                    <div className="section-header">

                        <Activity size={22}/>

                        <h2>

                            System Status

                        </h2>

                    </div>

                    <div className="system-grid">

                        <div>

                            <Wifi size={26}/>

                            <h3>

                                Network

                            </h3>

                            <span className="online">

                                Stable

                            </span>

                        </div>

                        <div>

                            <Cpu size={26}/>

                            <h3>

                                AI Engine

                            </h3>

                            <span className="online">

                                Running

                            </span>

                        </div>

                        <div>

                            <Radar size={26}/>

                            <h3>

                                Sensors

                            </h3>

                            <span className="online">

                                Connected

                            </span>

                        </div>

                        <div>

                            <Bell size={26}/>

                            <h3>

                                Alerts

                            </h3>

                            <span className="warning">

                                5 Pending

                            </span>

                        </div>

                    </div>

                </motion.div>

            </div>

            </div>

        </div>

    );

}
