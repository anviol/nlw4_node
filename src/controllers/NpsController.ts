import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    
    async execute(request: Request, response: Response) {

        const { survey_id } = request.params;

        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveyUserRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveyUsers.filter(survey => (
            survey.value <= 6
        )).length;

        const passive = surveyUsers.filter(survey => (
            survey.value >= 7 && survey.value <= 8
        )).length;

        const promotors = surveyUsers.filter(survey => (
            survey.value >= 9
        )).length;

        const totalAnswers = surveyUsers.length;

        const calculate = (promotors - detractor) / totalAnswers * 100;

        response.json({
            detractor,
            passive,
            promotors,
            nps: calculate
        })

    }
}

export { NpsController };