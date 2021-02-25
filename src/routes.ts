import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post('/Users', userController.create);

router.post('/Surveys', surveyController.create);
router.get('/Surveys', surveyController.show);

export { router };
