import { faker } from "@faker-js/faker";
import { createId } from "../../utils/createId";
import { Tasks } from "../../models/Tasks";

class FakeTask {
    constructor(options = {}) {
        this.title = faker.book.title()
        this.description = faker.lorem.sentence()
        this.supervisor = createId(options.supervisor) || createId()
        this.deadline = faker.date.future()
        this.assignedInterns = options.assignedInterns.map(intern => createId(intern)) || [createId(), createId()]
    }
    obj() {
        return {
            title: this.title,
            description: this.description,
            supervisor: this.supervisor,
            deadline: this.deadline.toDateString(),
            assignedInterns: this.assignedInterns
        }
    }
}

class TaskFactory {
    constructor(generate, options = {}) {
        this.generate = generate
        this.tasks = []
        this.options = options
        this._generateTasks()
    }

    _generateTasks() {
        if (typeof this.generate !== 'number' || this.generate < 1) {
            throw new Error('Invalid generate parameter. Must be a positive number.');
        }
        for (let i = 0; i < this.generate; i++) {
            this.tasks.push(new FakeTask(this.options).obj())
        }
    }

    async create() {
        try {
            await Tasks.create(this.tasks)
        } catch (err) {
            throw err
        }
    }
}