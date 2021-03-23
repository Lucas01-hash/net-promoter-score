import request from 'supertest';
import { app } from '../app';
import createConnection from '../database';

describe('Surveys', () => {
	beforeAll(async () => {
		const connection = await createConnection();
		await connection.runMigrations();
	});

	it('should be able to create a new Survey', async () => {
		const response = await request(app).post('/surveys').send({
			title: `title Example`,
			description: 'Survey test description example',
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
	});

	it('should be able to create a new Survey', async () => {
		await request(app).post('/surveys').send({
			title: `title Example`,
			description: 'Survey test description example',
		});

		const response = await request(app).get('/surveys');
		expect(response.body.length).toBe(10);
	});
});
