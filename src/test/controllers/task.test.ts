import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as taskService from '../../services/task';
import { getTaskCountsController, getTasksByEmployeeId, saveTask } from "../../controllers/task";
import {ObjectId} from "mongodb";
import {TaskSaveDto} from "../../dto/task/taskSaveDto";
// import {ITask} from "../../model/task";

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/tasks', saveTask);
app.get('/api/tasks', getTasksByEmployeeId);
app.post('/api/tasks/_counts', getTaskCountsController);

describe('Task Controller', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should save the task', (done) => {
    const taskToSave = {
      employeeId: 38,
      title: "Finish project report",
      description: "National",
      dueDate: new Date("2024-05-16"),
      status: "Pending",
    };

    const savedTask:any = {
      ...taskToSave,
      _id: new ObjectId("66571a34ca3f5264dd86d938"),
      dueDate: new Date("2024-05-16T00:00:00.000Z"),
      __v: 0,
    };

    const createTaskStub = sandbox.stub(taskService, 'createTask').resolves(savedTask);

    chai.request(app)
      .post('/api/tasks')
      .send(taskToSave)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(201);

        // Convert _id and dueDate to strings for comparison
        const expectedResponse = {
          ...savedTask,
          _id: savedTask._id.toString(),
          dueDate: savedTask.dueDate.toISOString(),
        };
        const actualResponse = {
          ...res.body,
          _id: res.body._id.toString(),
          dueDate: new Date(res.body.dueDate).toISOString(),
        };

        expect(actualResponse).to.deep.equal(expectedResponse);
        sinon.assert.calledWith(createTaskStub, sinon.match.instanceOf(TaskSaveDto));
        done();
      });
  });



  it('should get task counts by employee IDs', (done) => {
    const employeeIds = [24, 23, 3, 4, 7];
    const taskCounts = {
      3: 0,
      4: 0,
      7: 0,
      23: 19,
      24: 2,
    };

    const getTaskCountsStub = sandbox.stub(taskService, 'getTaskCounts').resolves({ status: 200, data: taskCounts });

    chai.request(app)
      .post(`/api/tasks/_counts`)
      .send({ employeeIds })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body).to.deep.equal(taskCounts);
        sinon.assert.calledOnce(getTaskCountsStub); // Verify that the stub was called
        sinon.assert.calledWith(getTaskCountsStub, sinon.match({ employeeIds })); // Verify the arguments passed to the stub
        done();
      });
  });

  it('should get task counts', (done) => {
    const employeeIds = [24, 23, 3, 4, 7, 1, 2];
    const counts = {
      "1": 1,
      "2": 0,
      "3": 0,
      "4": 0,
      "7": 0,
      "23": 19,
      "24": 2,
    };

    const getTaskCountsStub = sandbox.stub(taskService, 'getTaskCounts');
    getTaskCountsStub.resolves({ status: 200, data: counts });

    chai.request(app)
      .post('/api/tasks/_counts')
      .send({ employeeIds })
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(counts);
        done();
      });
  });
});
