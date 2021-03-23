import { Router } from 'express';
import { AnswerController } from './controller/AnswerController';
import { NpsController } from './controller/NpsController';
import { SendMailController } from './controller/sendMailController';
import { SurveyController } from './controller/SurveyController';
import { UserController } from './controller/UserController';
const router = Router();

const userController = new UserController();
const surveysController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);
router.post('/surveys', surveysController.create);
router.post('/sendMail', sendMailController.execute);
router.get('/surveys', surveysController.show);
router.get('/answers/:value', answerController.execute);
router.get('/nps/:survey_id', npsController.execute);
export { router };
