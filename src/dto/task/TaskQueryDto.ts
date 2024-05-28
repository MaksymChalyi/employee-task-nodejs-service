export class TaskQueryDto {
  employeeId: number;
  size?: number;
  from?: number;

  constructor(employeeId: number, size?: number, from?: number) {
    this.employeeId = employeeId;
    this.size = size;
    this.from = from;
  }
}