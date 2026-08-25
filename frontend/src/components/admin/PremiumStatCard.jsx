import { motion } from "framer-motion";
import "./../../styles/admin/premiumStatCard.css";
import Sparkline from "./Sparkline";

export default function PremiumStatCard({

    title,
    value,
    change,
    icon,
    color

}) {

    return (

        <motion.div

            className="premium-stat"

            style={{

                "--accent":color

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

                y:-8

            }}

        >

            <div className="gradient-bg"></div>

            <div className="shine"></div>

            <div className="status"></div>

            <div className="header">

                <span>

                    {title}

                </span>

            </div>

            <div className="body">

                <div className="left">

                    <div className="icon">

                        {icon}

                    </div>

                    <div className="numbers">

                        <h1>

                            {value}

                        </h1>

                        <p>

                            ↑ {change}

                        </p>

                    </div>

                </div>

                <div className="right">

<Sparkline color={color}/>

                </div>

            </div>

        </motion.div>

    );

}