import { motion } from "framer-motion";
import Sparkline from "./Sparkline";
import "./../../styles/admin/statcard.css";

export default function StatCard({

    title,
    value,
    change,
    icon,
    color

}) {

    return (

        <motion.div

            className="premium-card"

            style={{

                "--accent": color,

                "--accent-light": `${color}22`

            }}

            initial={{

                opacity:0,

                y:25

            }}

            animate={{

                opacity:1,

                y:0

            }}

            whileHover={{

                y:-8,

                scale:1.02

            }}

            transition={{

                duration:.35

            }}

        >

            <div className="premium-top-line"></div>

            <div className="premium-glow"></div>

            <div className="premium-dot"></div>

            <div className="premium-content">

                <div className="premium-left">

                    <div className="premium-icon">

                        <div className="icon-glow"></div>

                        {icon}

                    </div>

                    <div className="premium-text">

                        <h5>

                            {title}

                        </h5>

                        <h1>

                            {value}

                        </h1>

                        <span>

                            ↑ {change}

                        </span>

                    </div>

                </div>

                <div className="premium-right">

                    <Sparkline color={color}/>

                </div>

            </div>

        </motion.div>

    );

}