export class TaskCountQueryDto {
  employeeIds: number[];

  constructor(employeeIds: number[]) {
    this.employeeIds = employeeIds;
  }
}