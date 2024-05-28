import log4js from 'log4js';
import axios from 'axios';
import { TaskSaveDto } from 'src/dto/task/taskSaveDto';
import Task, { ITask } from 'src/model/task';
import { InternalError } from 'src/system/internalError';
import {TaskQueryDto} from "../../dto/task/TaskQueryDto";
import httpStatus from "http-status";
import {TaskCountQueryDto} from "../../dto/task/TaskCountQueryDto";

const EMPLOYEE_SERVICE_URL = 'http://localhost:8080/api/employee/';

export const getEmployee = async (employeeId?: number) => {
  if (employeeId === undefined) {
    throw new Error('Employee ID is required');
  }

  try {
    const response = await axios.get(`${EMPLOYEE_SERVICE_URL}${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching employee:', error);
    throw error;
  }
};

export const createTask = async (taskSaveDto: TaskSaveDto): Promise<ITask> => {
  const logger = log4js.getLogger();
  const { employeeId, title, description, dueDate, status } = taskSaveDto;

  try {
    const employeeData = await getEmployee(employeeId);
    if (!employeeData) {
      throw new Error('Employee not found');
    }

    const taskData: Partial<ITask> = { employeeId, title, description, dueDate, status };
    const task = new Task(taskData);
    await task.save();

    return task;
  } catch (error) {
    logger.error('Error in creating tasks.', error);
    throw new InternalError(error);
  }
};

export const getTaskList = async (query: TaskQueryDto) => {
  try {
    const { employeeId, size, from } = query;

    if (!employeeId) {
      throw new Error('employeeId is required');
    }


    const taskList = await Task.find({ employeeId })
      .sort({ dueDate: -1 }) // сортування за спаданням за датою
      .skip(from || 0) // пропускаємо перші "from" завдань
      .limit(size || 10); // обмежуємо кількість завдань за замовчуванням на 10

    return { status: httpStatus.OK, data: taskList };
  } catch (error) {
    console.error('Error while fetching Task list:', error);
    throw { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
  }
};

export const getTaskCounts = async (queryDto: TaskCountQueryDto) => {
  const logger = log4js.getLogger();
  try {
    const counts = await Task.aggregate([
      { $match: { employeeId: { $in: queryDto.employeeIds } } },
      { $group: { _id: '$employeeId', count: { $sum: 1 } } },
    ]);

    const result: { [key: number]: number } = {};
    queryDto.employeeIds.forEach(id => {
      result[id] = 0;
    });
    counts.forEach((item: { _id: number; count: number }) => {
      result[item._id] = item.count;
    });

    return { status: httpStatus.OK, data: result };
  } catch (error) {
    logger.error('Error while fetching task counts:', error);
    throw new InternalError(error);
  }
};