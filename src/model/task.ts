import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  employeeId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
}
const TaskSchema  = new Schema({
  employeeId: {
    type: Number,
    ref: 'Employee',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Completed'],
  },
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
