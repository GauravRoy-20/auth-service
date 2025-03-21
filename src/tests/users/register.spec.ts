import request from "supertest"
import app from "../../app"
import { User } from "../../entity/User"
import { DataSource } from "typeorm"
import { AppDataSource } from "../../config/data-source"
import { Roles } from "../../constants"
import { isJWT } from "../../utils"
import { RefreshToken } from "../../entity/RefreshToken"

describe("POST /auth/register", () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
        // await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            // assert

            expect(response.statusCode).toBe(201)
        })

        it("should return valid json response", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            // assert

            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"))
        })

        it("should presist the user in the database", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post("/auth/register").send(userData)

            // assert

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })

        it("should return an id of the created user", async () => {})

        it("should assign a customer role", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post("/auth/register").send(userData)

            // assert

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users[0]).toHaveProperty("role")
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })
        it("should store the hashed password in the database", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post("/auth/register").send(userData)

            // assert

            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user[0].password).not.toBe(userData.password)
            expect(user[0].password).toHaveLength(60)
            expect(user[0].password).toMatch(/^\$2b\$\d+\$/)
        })

        it("should return 400 status code if email is already exists", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)
            const users = await userRepository.find()

            // assert

            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })

        it("should return the access token and refresh token inside a cookie", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            interface Headers {
                ["set-cookie"]: string[]
            }

            // assert

            let accessToken = null
            let refreshToken = null
            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || []

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken")) {
                    accessToken = cookie.split(";")[0].split("=")[1]
                }
                if (cookie.startsWith("refreshToken")) {
                    refreshToken = cookie.split(";")[0].split("=")[1]
                }
            })
            expect(accessToken).not.toBeNull()
            expect(isJWT(accessToken)).toBeTruthy()
            expect(refreshToken).not.toBeNull()
            expect(isJWT(refreshToken)).toBeTruthy()
        })
        it("should return the access token and refresh token inside a cookie", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "gaurav@mail.com",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            // assert

            const refreshTokenRepo = connection.getRepository(RefreshToken)
            // const refreshTokens = await refreshTokenRepo.find()
            // expect(refreshTokens).toHaveLength(1)
            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany()
            expect(tokens).toHaveLength(1)
        })
    })
    describe("Fields are missing", () => {
        it("should return 400 status code if email field is missing", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post("/auth/register")
                .send(userData)

            // assert

            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        })

        it("should return 400 status code if firstName field is missing", async () => {})

        it("should return 400 status code if lastName field is missing", async () => {})

        it("should return 400 status code if password field is missing", async () => {})
    })
    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            // arrange

            const userData = {
                firstName: "Gaurav",
                lastName: "Roy",
                email: "   gaurav@mail.com   ",
                password: "test@123",
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post("/auth/register").send(userData)

            // assert

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            const user = users[0]
            expect(user.email).toBe("gaurav@mail.com")
        })

        it("should return 400 status code if email is not a valid email", async () => {})

        it("should return 400 status code if password length is less than 8 character", async () => {})

        it("should return an array of error messages if email is missing", async () => {})
    })
})
