import winston from "winston"

const logger = winston.createLogger({
    level: "info",
    defaultMeta: { serviceName: "auth-service" },
    transports: [
        new winston.transports.File({
            level: "info",
            dirname: "logs",
            filename: "app.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
})

export default logger
