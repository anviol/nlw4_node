import { Request, Response } from "express";
import { getCustomRepository, Repository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {
    
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({
            email
        });

        if (!user) {
            response.status(400).json({
                error: 'User does not exists.'
            })
        }

        const survey = await surveysRepository.findOne({
            id: survey_id
        });

        if (!survey) {
            response.status(400).json({
                error: 'Survey does not exists.'
            })
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [
                {user_id: user.id},
                {value: null}
            ],
            relations: ['user', 'survey']
        })

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
        const variabbles = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: `${process.env.URL_MAIL}answers`
        }

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variabbles, npsPath);

            return response.status(201).json(surveyUserAlreadyExists);
        }
        const surveyUsers = surveysUsersRepository.create({
            user_id: user.id,
            survey_id: survey.id
        })

        await surveysUsersRepository.save(surveyUsers);

       
        await SendMailService.execute(email, survey.title, variabbles, npsPath);

        return response.status(201).json(surveyUsers);

    }

}

export { SendMailController }