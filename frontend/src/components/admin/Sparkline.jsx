import { motion } from "framer-motion";

export default function Sparkline({ color }) {

    return (

        <svg
            width="150"
            height="70"
            viewBox="0 0 150 70"
        >

            <defs>

                <linearGradient
                    id={`line-${color}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >

                    <stop offset="0%" stopColor={color} stopOpacity=".2"/>

                    <stop offset="100%" stopColor={color}/>

                </linearGradient>

                <linearGradient
                    id={`fill-${color}`}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                >

                    <stop
                        offset="0%"
                        stopColor={color}
                        stopOpacity=".28"
                    />

                    <stop
                        offset="100%"
                        stopColor={color}
                        stopOpacity="0"
                    />

                </linearGradient>

                <filter id={`glow-${color}`}>

                    <feGaussianBlur
                        stdDeviation="4"
                        result="blur"
                    />

                    <feMerge>

                        <feMergeNode in="blur"/>

                        <feMergeNode in="SourceGraphic"/>

                    </feMerge>

                </filter>

            </defs>

            <motion.path

                d="M5 55
                   C25 52
                   30 18
                   55 26

                   S85 62
                   105 20

                   S135 8
                   145 18

                   L145 70

                   L5 70

                   Z"

                fill={`url(#fill-${color})`}

                initial={{

                    opacity:0

                }}

                animate={{

                    opacity:1

                }}

            />

            <motion.path

                d="M5 55
                   C25 52
                   30 18
                   55 26

                   S85 62
                   105 20

                   S135 8
                   145 18"

                stroke={`url(#line-${color})`}

                strokeWidth="4"

                strokeLinecap="round"

                fill="none"

                filter={`url(#glow-${color})`}

                initial={{

                    pathLength:0

                }}

                animate={{

                    pathLength:1

                }}

                transition={{

                    duration:2

                }}

            />

        </svg>

    );

}