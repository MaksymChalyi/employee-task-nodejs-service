import express from 'express';
import { getTaskCountsController, getTasksByEmployeeId, saveTask} from "../../controllers/task";

const router = express.Router();

router.post('', saveTask);
router.get('', getTasksByEmployeeId);
router.post('/_counts', getTaskCountsController);

export default router;
