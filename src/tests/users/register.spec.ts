import request from 'supertest'
import app from '../../app'

describe('POST /auth/register', () => {
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // arrange

            const userData = {
                firstName: 'Gaurav',
                lastName: 'Roy',
                email: 'gaurav@mail.com',
                passsword: 'test@123',
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // assert

            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // arrange

            const userData = {
                firstName: 'Gaurav',
                lastName: 'Roy',
                email: 'gaurav@mail.com',
                passsword: 'test@123',
            }

            // act

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // assert

            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })

        it('should presist the user in the database', async () => {
            // arrange

            const userData = {
                firstName: 'Gaurav',
                lastName: 'Roy',
                email: 'gaurav@mail.com',
                passsword: 'test@123',
            }

            // act

            // const response =

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            await request(app).post('/auth/register').send(userData)

            // assert
        })
    })
    describe('Fields are missing', () => {})
})
