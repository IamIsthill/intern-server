<<<<<<< HEAD
import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { Supervisor } from '../../models/Supervisor.js'
import { app } from '../../server.js'
import { Department } from '../../models/Department.js'
import { createSupervisor, findSupervisorByEmail, loginSupervisor } from '../../services/supervisor.services.js'

vi.mock('../../services/supervisor.services.js')
vi.mock('../../models/Supervisor.js')
vi.mock('../../models/Department.js')
vi.mock('../../database/index.js', () => ({
    startApp: vi.fn(),
    onDbError: vi.fn(),
    connectDb: vi.fn()
}))
vi.mock('../../middleware/auth.js', () => ({
    authenticateJWT: (req, res, next) => next()
}))

describe('GET /supervisors/all', () => {
    it('should return all supervisors', async () => {
        const mockSupervisors = [
            { name: 'John Doe', department: 'HR' },
            { name: 'Jane Smith', department: 'IT' }
        ]
        // Supervisor.find.mockResolvedValue(mockSupervisors)
        Supervisor.find.mockReturnValue({
            select: vi.fn().mockResolvedValue(mockSupervisors)
        })

        const response = await request(app).get('/supervisors/all')

        expect(response.status).toBe(200)
        expect(response.body.supervisors).toEqual(mockSupervisors)
    })

    it('should handle errors', async () => {
        Supervisor.find.mockRejectedValue(new Error('Database error'))

        const response = await request(app).get('/supervisors/all')

        expect(response.status).toBe(500)
    })
})

describe('POST /supervisors/register', () => {
    const url = '/supervisors/register'

    it('returns 400 and error message if required params was not passed', async () => {
        const res = await request(app).post(url)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({
            message: expect.any(String)
        })
    })

    describe('returns 400 if params is not valid', () => {
        let user
        beforeEach(() => {
            user = {
                firstName: 'foo',
                lastName: 'bar',
                age: 12,
                password: '12345678',
                department: 'IT',
                email: 'foo@bar.com'
            }
        })
        // it('password with a space', async () => {
        //     user.password = 'password with space'
        //     const res = await request(app).post(url).send(user)

        //     expect(res.status).toBe(400)
        //     expect(res.body).toEqual({
        //         message: "\"password\" with value \"password with space\" fails to match the required pattern: /^S+$/"
        //     })
        // })
        it('password less than 8', async () => {
            user.password = '1234567'
            const res = await request(app).post(url).send(user)

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                message: "\"password\" length must be at least 8 characters long"
            })
        })
        it('not an email', async () => {
            user.email = 'not an email'
            const res = await request(app).post(url).send(user)

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                message: "\"email\" must be a valid email"
            })
        })
        it('age exceeds 150', async () => {
            user.age = 151
            const res = await request(app).post(url).send(user)

            expect(res.status).toBe(400)
            expect(res.body).toEqual({
                message: "\"age\" must be less than or equal to 150"
            })
        })
    })

    it('returns 201 and the created user if successful', async () => {
        const user = {
            firstName: 'foo',
            lastName: 'bar',
            age: 12,
            password: '12345678',
            department: 'IT',
            email: 'foo@bar.com'
        }
        Department.findOne.mockResolvedValue({
            _id: '12'
        })
        createSupervisor.mockResolvedValue(user)
        // Supervisor.create.mockReturnValue({
        //     select: vi.fn().mockResolvedValue(user)
        // })

        const res = await request(app).post(url).send(user)

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual(user)
    }
    )
    it('handler errors', async () => {
        Department.findOne.mockRejectedValue(new Error('Department not found'))

        const res = await request(app).post(url)

        expect(res.statusCode).toBe(400)
    })
})

describe('POST /auth/login/supervisor', () => {
    const url = "/auth/login/supervisor"
    let user, params

    beforeEach(() => {
        user = {
            email: "supervisor@supervisor.com",
            password: "$2a$10$eXhvW5rq00IxotvTG0SuKejd4fAXeTe.UNaybJc6O/HzxH2nIB9fe",
            accountType: "supervisor"
        }
        params = {
            email: "supervisor@supervisor.com",
            password: "12345678"
        }
    })

    it('returns 400 if params was not supplied', async () => {
        const res = await request(app).post(url)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }))
    })
    it('returns 400 if email param is invalid', async () => {
        params.email = 'invalid email'
        const res = await request(app).post(url).send(params)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: "\"email\" must be a valid email"
        }))
    })
    it('returns 400 if password is not a string', async () => {
        params.password = 12345678
        const res = await request(app).post(url).send(params)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: "\"password\" must be a string"
        }))
    })
    it('returns 400 if user was not found', async () => {
        params.email = 'fake@fake.com'
        Supervisor.findOne.mockReturnValue({
            lean: vi.fn().mockResolvedValue(null)
        })
        const res = await request(app).post(url).send(params)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: "No user found"
        }))

    })

    it('returns 400 if password was incorrect', async () => {
        params.password = 'wrong password'
        // Supervisor.findOne.mockReturnValue({
        //     lean: vi.fn().mockResolvedValue(user)
        // })
        findSupervisorByEmail.mockResolvedValue(user)
        loginSupervisor.mockRejectedValue(new Error('Invalid credentials'))
        const res = await request(app).post(url).send(params)

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual(expect.objectContaining({
            message: "Invalid credentials"
        }))

    })

    it('returns 200 and token if login if successful', async () => {
        Supervisor.findOne.mockReturnValue({
            lean: vi.fn().mockResolvedValue(user)
        })
        loginSupervisor.mockResolvedValue({
            message: "Login Successful",
            token: "Good token"
        })

        const res = await request(app).post(url).send(params)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            message: "Login Successful",
            token: expect.any(String)
        }))
    })
})
=======
// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import request from 'supertest'
// import { Supervisor } from '../../models/Supervisor.js'
// import { app } from '../../server.js'
// import { Department } from '../../models/Department.js'
// import { createSupervisor, findSupervisorByEmail, loginSupervisor } from '../../services/supervisor.services.js'

// vi.mock('../../services/supervisor.services.js')
// vi.mock('../../models/Supervisor.js')
// vi.mock('../../models/Department.js')
// vi.mock('../../database/index.js', () => ({
//     startApp: vi.fn(),
//     onDbError: vi.fn(),
//     connectDb: vi.fn()
// }))
// vi.mock('../../middleware/auth.js', () => ({
//     authenticateJWT: (req, res, next) => next()
// }))

// describe('GET /supervisors/all', () => {
//     it('should return all supervisors', async () => {
//         const mockSupervisors = [
//             { name: 'John Doe', department: 'HR' },
//             { name: 'Jane Smith', department: 'IT' }
//         ]
//         // Supervisor.find.mockResolvedValue(mockSupervisors)
//         Supervisor.find.mockReturnValue({
//             select: vi.fn().mockResolvedValue(mockSupervisors)
//         })

//         const response = await request(app).get('/supervisors/all')

//         expect(response.status).toBe(200)
//         expect(response.body.supervisors).toEqual(mockSupervisors)
//     })

//     it('should handle errors', async () => {
//         Supervisor.find.mockRejectedValue(new Error('Database error'))

//         const response = await request(app).get('/supervisors/all')

//         expect(response.status).toBe(500)
//     })
// })

// describe('POST /supervisors/register', () => {
//     const url = '/supervisors/register'

//     it('returns 400 and error message if required params was not passed', async () => {
//         const res = await request(app).post(url)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual({
//             message: expect.any(String)
//         })
//     })

//     describe('returns 400 if params is not valid', () => {
//         let user
//         beforeEach(() => {
//             user = {
//                 firstName: 'foo',
//                 lastName: 'bar',
//                 age: 12,
//                 password: '12345678',
//                 department: 'IT',
//                 email: 'foo@bar.com'
//             }
//         })
//         // it('password with a space', async () => {
//         //     user.password = 'password with space'
//         //     const res = await request(app).post(url).send(user)

//         //     expect(res.status).toBe(400)
//         //     expect(res.body).toEqual({
//         //         message: "\"password\" with value \"password with space\" fails to match the required pattern: /^S+$/"
//         //     })
//         // })
//         it('password less than 8', async () => {
//             user.password = '1234567'
//             const res = await request(app).post(url).send(user)

//             expect(res.status).toBe(400)
//             expect(res.body).toEqual({
//                 message: "\"password\" length must be at least 8 characters long"
//             })
//         })
//         it('not an email', async () => {
//             user.email = 'not an email'
//             const res = await request(app).post(url).send(user)

//             expect(res.status).toBe(400)
//             expect(res.body).toEqual({
//                 message: "\"email\" must be a valid email"
//             })
//         })
//         it('age exceeds 150', async () => {
//             user.age = 151
//             const res = await request(app).post(url).send(user)

//             expect(res.status).toBe(400)
//             expect(res.body).toEqual({
//                 message: "\"age\" must be less than or equal to 150"
//             })
//         })
//     })

//     it('returns 201 and the created user if successful', async () => {
//         const user = {
//             firstName: 'foo',
//             lastName: 'bar',
//             age: 12,
//             password: '12345678',
//             department: 'IT',
//             email: 'foo@bar.com'
//         }
//         Department.findOne.mockResolvedValue({
//             _id: '12'
//         })
//         createSupervisor.mockResolvedValue(user)
//         // Supervisor.create.mockReturnValue({
//         //     select: vi.fn().mockResolvedValue(user)
//         // })

//         const res = await request(app).post(url).send(user)

//         expect(res.statusCode).toBe(201)
//         expect(res.body).toEqual(user)
//     }
//     )
//     it('handler errors', async () => {
//         Department.findOne.mockRejectedValue(new Error('Department not found'))

//         const res = await request(app).post(url)

//         expect(res.statusCode).toBe(400)
//     })
// })

// describe('POST /auth/login/supervisor', () => {
//     const url = "/auth/login/supervisor"
//     let user, params

//     beforeEach(() => {
//         user = {
//             email: "supervisor@supervisor.com",
//             password: "$2a$10$eXhvW5rq00IxotvTG0SuKejd4fAXeTe.UNaybJc6O/HzxH2nIB9fe",
//             accountType: "supervisor"
//         }
//         params = {
//             email: "supervisor@supervisor.com",
//             password: "12345678"
//         }
//     })

//     it('returns 400 if params was not supplied', async () => {
//         const res = await request(app).post(url)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: expect.any(String)
//         }))
//     })
//     it('returns 400 if email param is invalid', async () => {
//         params.email = 'invalid email'
//         const res = await request(app).post(url).send(params)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: "\"email\" must be a valid email"
//         }))
//     })
//     it('returns 400 if password is not a string', async () => {
//         params.password = 12345678
//         const res = await request(app).post(url).send(params)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: "\"password\" must be a string"
//         }))
//     })
//     it('returns 400 if user was not found', async () => {
//         params.email = 'fake@fake.com'
//         Supervisor.findOne.mockReturnValue({
//             lean: vi.fn().mockResolvedValue(null)
//         })
//         const res = await request(app).post(url).send(params)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: "No user found"
//         }))

//     })

//     it('returns 400 if password was incorrect', async () => {
//         params.password = 'wrong password'
//         // Supervisor.findOne.mockReturnValue({
//         //     lean: vi.fn().mockResolvedValue(user)
//         // })
//         findSupervisorByEmail.mockResolvedValue(user)
//         loginSupervisor.mockRejectedValue(new Error('Invalid credentials'))
//         const res = await request(app).post(url).send(params)

//         expect(res.statusCode).toBe(400)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: "Invalid credentials"
//         }))

//     })

//     it('returns 200 and token if login if successful', async () => {
//         Supervisor.findOne.mockReturnValue({
//             lean: vi.fn().mockResolvedValue(user)
//         })
//         loginSupervisor.mockResolvedValue({
//             message: "Login Successful",
//             token: "Good token"
//         })

//         const res = await request(app).post(url).send(params)

//         expect(res.statusCode).toBe(200)
//         expect(res.body).toEqual(expect.objectContaining({
//             message: "Login Successful",
//             token: expect.any(String)
//         }))
//     })
// })
>>>>>>> staging
