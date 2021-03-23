import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import sendMailService from '../services/sendMailService';

class SendMailController {
	async execute(req: Request, res: Response) {
		const { email, survey_id } = req.body;

		const usersRepository = getCustomRepository(UsersRepository);
		const surveysRepository = getCustomRepository(SurveysRepository);
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const userAlreadyExists = await usersRepository.findOne({ email });

		if (!userAlreadyExists) {
			return res.status(400).json({
				error: 'User does not exists',
			});
		}

		const survey = await surveysRepository.findOne({ id: survey_id });

		if (!survey) {
			return res.status(400).json({
				error: 'Survey does not exists',
			});
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsmail.hbs');

		const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
			where: { user_id: userAlreadyExists.id, value: null },
			relations: ['user', 'survey'],
		});

		const variables = {
			name: userAlreadyExists.name,
			title: survey.title,
			description: survey.description,
			id: '',
			link: process.env.URL_MAIL,
		};

		if (surveyUserAlreadyExists) {
			variables.id = surveyUserAlreadyExists.id;
			await sendMailService.execute(email, survey.title, variables, npsPath);

			return res.json(surveyUserAlreadyExists);
		}

		// salvando as informações na tabela
		const surveyUser = surveysUsersRepository.create({
			user_id: userAlreadyExists.id,
			survey_id,
		});
		await surveysUsersRepository.save(surveyUser);
		variables.id = surveyUser.id;

		await sendMailService.execute(email, survey.title, variables, npsPath);

		return res.json(surveyUser);
	}
}

export { SendMailController };
