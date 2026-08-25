import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Map,
    BrainCircuit,
    TriangleAlert,
    BarChart3,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrafficCone
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../../styles/admin/sidebar.css";

const adminMenuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/admin" },
    { title: "Live Traffic", icon: <Map size={22} />, path: "/admin/live-traffic" },
    { title: "Prediction", icon: <BrainCircuit size={22} />, path: "/admin/prediction" },
    { title: "Alerts", icon: <TriangleAlert size={22} />, path: "/admin/alerts" },
    { title: "Analytics", icon: <BarChart3 size={22} />, path: "/admin/analytics" },
    { title: "Reports", icon: <FileText size={22} />, path: "/admin/reports" }
];

export default function Sidebar({
    menuItems = adminMenuItems,
    profile = { initial: "A", name: "Admin", role: "Super Administrator" }
}) {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <motion.aside

            className={`sidebar ${collapsed ? "collapsed" : ""}`}

            animate={{
                width: collapsed ? 90 : 285
            }}

            transition={{
                duration: .35
            }}

        >

            <div className="sidebar-top">

                <div className="logo-wrapper">

                    <div className="logo-circle">

                        <TrafficCone />

                    </div>

                    {!collapsed && (

                        <motion.div

                            initial={{
                                opacity:0,
                                x:-15
                            }}

                            animate={{
                                opacity:1,
                                x:0
                            }}

                            className="logo-text"

                        >

                            <h2>Traffic AI</h2>

                            <span>Command Center</span>

                        </motion.div>

                    )}

                </div>

                <button

                    className="collapse-btn"

                    onClick={() =>
                        setCollapsed(!collapsed)
                    }

                >

                    {

                        collapsed

                        ?

                        <ChevronRight size={20}/>

                        :

                        <ChevronLeft size={20}/>

                    }

                </button>

            </div>

            <div className="system-status">

                <div className="pulse"/>

                {

                    !collapsed

                    &&

                    <span>

                        System Online

                    </span>

                }

            </div>

            <nav>

                {

                    menuItems.map((item,index)=>(

                        <NavLink

                            key={index}

                            to={item.path}

                            className={({isActive})=>

                                isActive && !item.path.includes("#")

                                ?

                                "menu-item active"

                                :

                                "menu-item"

                            }

                        >

                            <motion.div

                                whileHover={{

                                    scale:1.08,

                                    rotate:-5

                                }}

                                className="icon"

                            >

                                {item.icon}

                            </motion.div>

                            {

                                !collapsed

                                &&

                                <span>

                                    {item.title}

                                </span>

                            }

                        </NavLink>

                    ))

                }

            </nav>

            <div className="sidebar-bottom">

                <div className="profile-card">

                    <div className="avatar">

                        {profile.initial}

                    </div>

                    {

                        !collapsed &&

                        <div>

                            <h4>

                                {profile.name?.replace(/\s*\([^)]*\)/g, "").trim()}

                            </h4>

                            <p>

                                {profile.role}

                            </p>

                        </div>

                    }

                </div>

                <button

                    className="logout-btn"

                >

                    <LogOut size={20}/>

                    {

                        !collapsed

                        &&

                        <span>

                            Logout

                        </span>

                    }

                </button>

            </div>

        </motion.aside>

    );

}
