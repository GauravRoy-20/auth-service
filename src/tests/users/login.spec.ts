import { DataSource } from "typeorm"
import { AppDataSource } from "../../config/data-source"

describe("POST /auth/login", () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // database truncate
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe("Given all fields", () => {
        it("should login the user", () => {})
    })
})
