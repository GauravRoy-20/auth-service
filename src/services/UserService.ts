import { Repository } from "typeorm"
import { User } from "../entity/User"
import { UserData } from "../types"
import createHttpError from "http-errors"
import bcrypt from "bcrypt"
import { Roles } from "../constants"

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(400, "Email is already exists!")
            throw err
        }

        // hash password
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(password, saltRounds)
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashPassword,
                role: Roles.CUSTOMER,
            })
        } catch {
            const error = createHttpError(
                500,
                "Failed to store the data in the database",
            )
            throw error
        }
    }
}
