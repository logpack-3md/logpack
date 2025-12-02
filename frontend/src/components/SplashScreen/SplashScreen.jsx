"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
    const PRIMARY_COLOR = "var(--primary)";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center font-sans overflow-hidden bg-background"
        >
            <div className="relative flex items-center justify-center">
                {/* LOADING */}
                <motion.div
                    className="absolute"
                    style={{ width: 220, height: 220 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity="0" />
                                <stop offset="50%" stopColor={PRIMARY_COLOR} stopOpacity="0.5" />
                                <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity="1" />
                            </linearGradient>
                        </defs>

                        {/* Trilho */}
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            stroke={PRIMARY_COLOR}
                            strokeWidth="1.5"
                            strokeOpacity="0.1"
                        />

                        {/* Parte ativa que gira */}
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            stroke="url(#spinner-gradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray="80 150"
                        />
                    </svg>
                </motion.div>

                {/* Segundo anel (interno) girando ao contrário para efeito tecnológico */}
                <motion.div
                    className="absolute"
                    style={{ width: 190, height: 190 }}
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                        <circle
                            cx="50"
                            cy="50"
                            r="48"
                            stroke={PRIMARY_COLOR}
                            strokeWidth="1"
                            strokeOpacity="0.2"
                            strokeDasharray="10 10"
                        />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 p-6"
                >
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                        <Image
                            src="/Logo/Logo_Light.svg"
                            alt="LogPack Logo"
                            width={110}
                            height={110}
                            priority
                            className="object-contain drop-shadow-2xl"

                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* =============================================
          TEXTO DE STATUS
         ============================================= */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex flex-col items-center gap-2"
            >
                <h2 className="text-xl font-bold tracking-tight" style={{ color: "oklch(0.9219 0 0)" }}>
                    LOGPACK
                </h2>
                <span
                    className="text-xs uppercase tracking-[0.3em] opacity-50 animate-pulse"
                    style={{ color: "oklch(0.9219 0 0)" }}
                >
                    Carregando Sistema...
                </span>
            </motion.div>
        </motion.div>
    );
}