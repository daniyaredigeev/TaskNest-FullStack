import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

//можно вывести  общие функции в setup.ts
describe('BoardsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userToken: string;
  let adminToken: string;
  let createdBoardId: string;
  let userTaskId: string;

  const userEmail = 'user@test.com';
  const adminEmail = 'admin@test.com';
  const password = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Очистка данных перед тестами (Критерий 1: роль уже есть в схеме)
    await prisma.task.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();

    // Регистрация (Критерий 2: работает без токена)
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: userEmail, password, name: 'User' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: adminEmail, password, name: 'Admin' })
      .expect(201);

    // Повышаем до ADMIN напрямую
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });

    // Логин (Критерий 2)
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password })
      .expect(200);
    userToken = userLogin.body.accessToken;

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password })
      .expect(200);
    adminToken = adminLogin.body.accessToken;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('Критерии 3-4: GET /boards', () => {
    it('Критерий 3: GET /boards без токена → 401', async () => {
      // Arrange & Act & Assert
      await request(app.getHttpServer()).get('/boards').expect(401);
    });

    it('Критерий 4: GET /boards с токеном USER → 200', async () => {
      // Act
      await request(app.getHttpServer())
        .get('/boards')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
  });

  describe('Критерии 5-6: POST /boards', () => {
    it('Критерий 5: POST /boards с токеном USER → 403', async () => {
      // Act
      await request(app.getHttpServer())
        .post('/boards/create') // Уточни путь в своем контроллере
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Forbidden Board' })
        .expect(403);
    });

    it('Критерий 6: POST /boards с токеном ADMIN → 201', async () => {
      // Act
      const res = await request(app.getHttpServer())
        .post('/boards/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Admin Board' })
        .expect(201);

      createdBoardId = res.body.id;
    });
  });

  describe('Критерий 7: POST /tasks', () => {
   it('Критерий 7: Автоматическое определение userId', async () => {
  const fakeId = '00000000-0000-0000-0000-000000000000';

  const res = await request(app.getHttpServer())
    .post('/tasks/create') // Проверь, /tasks или /tasks/create в контроллере
    .set('Authorization', `Bearer ${userToken}`)
    .send({ 
      title: 'My Task', 
      boardId: createdBoardId, 
      status: 'TODO', // ДОБАВЬ ЭТУ СТРОКУ (обязательно для твоего DTO)
      userId: fakeId 
    })
    .expect(201);

  // Assert
  userTaskId = res.body.id;
  const task = await prisma.task.findUnique({ where: { id: userTaskId } });
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  
  expect(task!.userId).toBe(user!.id); 
  expect(task!.userId).not.toBe(fakeId);
});
    });

  describe('Критерии 8-10: PATCH & DELETE Tasks', () => {
    it('Критерий 8: PATCH своей задачи → 200', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Updated' })
        .expect(200);
    });

   it('Критерий 9: PATCH чужой задачи от ADMIN → 200 OK', async () => {
  // Act & Assert
  await request(app.getHttpServer())
    .patch(`/tasks/${userTaskId}`)
    .set('Authorization', `Bearer ${adminToken}`) // Админ
    .send({ title: 'Admin Edit' })
    .expect(200); // Админу можно, поэтому 200
});

    it('Критерий 10: DELETE чужой задачи от ADMIN → 200', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${userTaskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

 
});