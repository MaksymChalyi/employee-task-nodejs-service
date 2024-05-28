import log4js from 'log4js';
// import axios from 'axios';
import { TaskSaveDto } from 'src/dto/task/taskSaveDto';
import Task, { ITask } from 'src/model/task';
import { InternalError } from 'src/system/internalError';

// const EMPLOYEE_SERVICE_URL = 'http://localhost:8080/api/employee';

export const createTask = async (taskSaveDto: TaskSaveDto): Promise<ITask> => {
  const logger = log4js.getLogger();
  const { employeeId, title, description, dueDate, status } = taskSaveDto;

  try {
    // Перевірка наявності Employee
    // const employeeResponse = await axios.get(`${EMPLOYEE_SERVICE_URL}/${employeeId}`);
    // if (!employeeResponse.data) {
    //   throw new Error('Employee not found');
    // }

    const taskData: Partial<ITask> = { employeeId, title, description, dueDate, status };
    const task = new Task(taskData);
    await task.save();

    return task;
  } catch (error) {
    logger.error('Error in creating tasks.', error);
    throw new InternalError(error);
  }
};