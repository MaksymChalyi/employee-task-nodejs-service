import express from 'express';
import {getTasksByEmployeeId, saveTask} from "../../controllers/task";

const router = express.Router();

router.post('', saveTask);
router.get('', getTasksByEmployeeId);

export default router;
