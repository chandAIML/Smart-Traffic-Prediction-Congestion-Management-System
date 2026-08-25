import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {

    return (

        <motion.div

            className={`glass-card ${className}`}

            whileHover={{

                y:-8,

                scale:1.02

            }}

            transition={{

                duration:.3

            }}

        >

            <div className="glass-shine"></div>

            {children}

        </motion.div>

    );

}