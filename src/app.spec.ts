import app from './app'
import { calculateDiscount } from './util'
import request from 'supertest'

describe('App', () => {
    it('should return correct discount amount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })
    it('should return 200 status code', async () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const response = await request(app).get('/').send()
        expect(response.statusCode).toBe(200)
    })
})
