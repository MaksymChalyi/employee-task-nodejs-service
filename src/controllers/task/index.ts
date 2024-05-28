import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TaskSaveDto } from '../../dto/task/taskSaveDto';
import { InternalError } from '../../system/internalError';
import {createTask, getTaskList} from "../../services/task";
import {TaskQueryDto} from "../../dto/task/TaskQueryDto";


export const saveTask = async (req: Request, res: Response) => {
  const taskSaveDto = new TaskSaveDto(req.body);

  try {
    const task = await createTask(taskSaveDto);
    res.status(httpStatus.CREATED).send(task);
  } catch (error) {
    const { message, status } = new InternalError(error);
    res.status(status).send({ message });
  }
};

export const getTasksByEmployeeId = async (req: Request, res: Response) => {
  try {
    const { employeeId, size, from } = req.query;

    if (!employeeId) {
      return res.status(400).send({ message: 'employeeId is required' });
    }

    const queryDto = new TaskQueryDto(
      Number(employeeId),
      size ? Number(size) : undefined,
      from ? Number(from) : undefined
    );

    const result = await getTaskList(queryDto);

    return res.status(result.status).send(result.data);
  } catch (error: any) {
    if (error instanceof InternalError) {
      return res.status(error.status).send({ message: error.message });
    }
    return res.status(500).send({ message: 'Internal server error' });
  }
};