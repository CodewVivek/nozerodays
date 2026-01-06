"use client";
import React from "react";
import { motion } from "framer-motion";

export const MovingBorderButton = ({
    children,
    onClick,
    duration = 2000,
    className,
    containerClassName,
    borderClassName,
    as: Component = "button",
    borderRadius,
    ...otherProps
}) => {
    return (
        <Component
            className={`bg-transparent relative text-xl  p-[1px] overflow-hidden ${containerClassName}`}
            style={{
                borderRadius: "1.75rem",
            }}
            onClick={onClick}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{
                    borderRadius: "1.75rem",
                }}
            >
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    style={{
                        borderRadius: "1.75rem",
                    }}
                    transition={{
                        duration: duration / 1000,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={`absolute inset-0 aspect-square h-full w-full bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--primary)_360deg)] opacity-40 ${borderClassName}`}
                />
            </div>
            <div
                className={`relative h-full w-full bg-background border border-border/50 backdrop-blur-xl text-foreground flex items-center justify-center antialiased ${className}`}
                style={{
                    borderRadius: "calc(1.75rem - 1px)",
                }}
            >
                {children}
            </div>
        </Component>
    );
};
