import { useState } from "react";
import { motion } from "framer-motion";

export default function Background({ children }) {

    const [pos, setPos] = useState({ x: 0, y: 0 });

    return (

        <div
            className="background"
            onMouseMove={(e) =>
                setPos({
                    x: e.clientX,
                    y: e.clientY,
                })
            }
        >

            <div
                className="mouse-glow"
                style={{
                    left: pos.x,
                    top: pos.y,
                }}
            ></div>

            <div className="grid"></div>

            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="blob blob3"></div>

            <motion.div
                className="content"
                initial={{
                    opacity: 0,
                    scale: .95,
                    y: 40
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                }}
                transition={{
                    duration: 1
                }}
            >

                {children}

            </motion.div>

        </div>

    );

}