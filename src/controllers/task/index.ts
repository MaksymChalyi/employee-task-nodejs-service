import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TaskSaveDto } from '../../dto/task/taskSaveDto';
import { InternalError } from '../../system/internalError';
import {createTask} from "../../services/task";

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