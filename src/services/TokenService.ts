import fs from "fs"
import path from "path"
import { JwtPayload, sign } from "jsonwebtoken"
import createHttpError from "http-errors"
import { Config } from "../config"
import { User } from "../entity/User"
import { RefreshToken } from "../entity/RefreshToken"
import { Repository } from "typeorm"

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            )
        } catch {
            const error = createHttpError(500, "Error while eading private key")
            throw error
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1d",
            issuer: "auth-service",
        })
        return accessToken
    }
    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        })
        return refreshToken
    }
    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365 // 1 Year
        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        })
        return newRefreshToken
    }
}
