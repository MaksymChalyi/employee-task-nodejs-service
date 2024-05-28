import {Status} from 'src/dto/status/status';

export class TaskSaveDto {
  employeeId?: number;
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: Status;

  constructor(data: Partial<TaskSaveDto>) {
    this.employeeId=data.employeeId;
    this.title=data.title;
    this.description=data.description;
    this.dueDate=data.dueDate;
    this.status=data.status || Status.Pending;

  }
}
