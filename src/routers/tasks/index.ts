import express from 'express';
import {saveTask} from "../../controllers/task";


const router = express.Router();

router.post('', saveTask);

export default router;
