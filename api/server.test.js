// Write your tests here
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwtDecode = require('jwt-decode');

const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db.seed.run()
})
afterAll(async () => {
    await db.destroy()
})

test('[0] Sanity', () => {
  expect(true).toBe(true);
})

describe('server.js', () => {

  describe('[POST] /api/auth/register', () => {
    test('[1] creates a new user in the database', async () => {
      let userDB = await db('users');
      expect(userDB).toHaveLength(2);

      await request(server).post('/api/auth/register').send({ username: 'pengin', password: '12345'});
      const pengin = await db('users').where('username', 'pengin').first();
      expect(pengin).toMatchObject({ username: 'pengin'});

      userDB = await db('users');
      expect(userDB).toHaveLength(3);
    })
    test('[2] saves the user password with bcrypt instead of plain txt', async () => {
      await request(server).post('/api/auth/register').send({ username: 'pengin', password: '12345' });
      const pengin = await db('users').where('username', 'pengin').first();
      expect(bcrypt.compareSync('12345', pengin.password)).toBeTruthy()
    })
    test('[3] responds with proper status on success', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'pengin', password: '12345'});
      expect(res.status).toBe(201);
    })
  })
  describe('[POST] /api/auth/login', () => {
  test('[4] correct status and message on valid credentials', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'andy', password: '1234' })
    expect(res.body.message).toMatch(/welcome, andy/i)
  }) 
  test('[5] correct status and message on invalid credentials', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
    res = await request(server).post('/api/auth/login').send({ username: 'andy', password: '12345' })
      expect(res.body.message).toMatch(/invalid credentials/i)
      expect(res.status).toBe(401)
  })
  test('[6] responding with token after correct {username, subject, exp', async () => {
    let res = await request(server).post('/api/auth/login').send( {username: 'andy', password: '1234' });
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty('exp');
    expect(decoded).toMatchObject({
      subject: 1,
      username: 'andy'
    })
    res = await request(server).post('/api/auth/login').send({ username: 'susan', password: '1234' })
    decoded = jwtDecode(res.body.token)
      expect(decoded).toHaveProperty('exp')
      expect(decoded).toMatchObject({
        subject: 2,
        username: 'susan',
      })
  }) 
  })
  describe('[GET] /api/jokes', () => {
    test('[7] requests without a token are bounced with proper status and message', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    })
    test('[8] requests with an invalid token are bounced with proper status and message', async () => {
      const res = await request(server).get('/api/jokes').set('Authorization', 'foobar')
      expect(res.body.message).toMatch(/token invalid/i)
    })
  })
})