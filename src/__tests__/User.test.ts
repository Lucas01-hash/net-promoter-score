import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
	beforeAll(async () => {
		const connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it('should be able to create a new user', async () => {
		// o let hash gera uma string aleatoria para não dar erro de validaão com o mesmo email de users diferentes
		let hash = Math.random().toString(36).substring(1);
		const response = await request(app)
			.post('/users')
			.send({
				email: `user@${hash}.com`,
				name: 'user example 2',
			});

		expect(response.status).toBe(201);
	});
});
