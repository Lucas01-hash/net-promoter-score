import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {
	async create(req: Request, res: Response) {
		const { name, email } = req.body;

		const schema = yup.object().shape({
			name: yup.string().required('nome é obrigatorio'),
			email: yup.string().email().required('email incorreto'),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: ' Falha na validação !' });
		}

		const usersRepository = getCustomRepository(UsersRepository);

		const userAlreadyExists = await usersRepository.findOne({ email });
		if (!userAlreadyExists) {
			const user = usersRepository.create({ name, email });
			await usersRepository.save(user);
			return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
		} else {
			return res.status(400).json({ message: 'usuario já existe' });
		}
	}
}

export { UserController };
