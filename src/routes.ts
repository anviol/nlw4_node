import { Router } from 'express';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

router.post('/Users', userController.create);

router.post('/Surveys', surveyController.create);
router.get('/Surveys', surveyController.show);

router.post('/sendMail', sendMailController.execute);

export { router };
