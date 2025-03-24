import { Intern } from "../../models/interns";
import { faker } from "@faker-js/faker";
import { createId } from "../../utils/createId";

class FakeIntern {
    constructor(options = {}) {
        this._id = createId()
        this.firstName = faker.person.firstName()
        this.lastName = faker.person.lastName()
        this.age = 18
        this.phone = faker.number.int({ min: 11111111111, max: 99999999999 }).toString()
        this.school = faker.book.title()
        this.internshipHours = options.internshipHours || 486
        this.email = faker.internet.email()
        this.password = faker.internet.password()
        this.status = options.status || 'active'
        this.accountType = options.accountType || 'intern'
        this.isApproved = options.isApproved || 'approved'
        this.supervisor = createId(options.supervisor) || createId()
        this.logs = [
            {
                _id: createId(),
                taskId: createId(),
                note: faker.lorem.sentence()
            },
            {
                _id: createId(),
                taskId: createId(),
                note: faker.lorem.sentence()
            }
        ]
    }

    obj() {
        return {
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age,
            phone: this.phone,
            school: this.school,
            internshipHours: this.internshipHours,
            email: this.email,
            password: this.password,
            status: this.status,
            accountType: this.accountType,
            isApproved: this.isApproved,
            supervisor: this.supervisor,
            logs: this.logs
        };
    }
}

export class InternFactory {
    constructor(generate = 1, options = {}) {
        this.generate = generate
        this.interns = []
        this.options = options
        this._generateInterns()
    }

    _generateInterns() {
        if (typeof this.generate !== 'number' || this.generate < 1) {
            throw new Error('Invalid generate parameter. Must be a positive number.');
        }
        for (let i = 0; i < this.generate; i++) {
            this.interns.push(new FakeIntern(this.options).obj())
        }
    }

    async create() {
        try {
            await Intern.insertMany(this.interns);
        } catch (err) {
            console.error("Error inserting interns:", err);
            throw err;
        }
    }
}