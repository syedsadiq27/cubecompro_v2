import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('GraphQL health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('health', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health }' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.health).toBe('ok');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
