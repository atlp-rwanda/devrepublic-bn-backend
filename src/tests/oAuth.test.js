import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import dotenv from 'dotenv';
import mock from 'node-mocks-http';
import passport from 'passport';
import authController from '../controllers/authController';

const {
  expect
} = chai;

dotenv.config();

chai.use(chaiHttp);

describe('GOOGLE oAuthentication tests', () => {
  before(() => {
    sinon.stub(passport, 'authenticate').callsFake((strategy, scope, callback) => callback(null, { firstName: 'Jim', email: 'jim.ntare@gmail.com' }));
  });

  it('should save signup gmail user and save in db', async () => {
    const req = {
      user: {
        id: '112126980710850867897',
        displayName: 'Jim Ntare',
        name: { familyName: 'Ntare', givenName: 'Jim' },
        emails: [{ value: 'jim.ntare@gmail.com', verified: true }],
        provider: 'google',
      }
    };
    const res = mock.createResponse();
    await authController.oAuthLogin(req, res);
    expect(res.statusCode).to.equal(302);
  });

  it('should login the user', async () => {
    const req = {
      user: {
        id: '112126980710850867897',
        displayName: 'Jim Ntare',
        name: { familyName: 'Ntare', givenName: 'Jim' },
        emails: [{ value: 'jim.ntare@gmail.com', verified: true }],
        provider: 'google',
      }
    };
    const res = mock.createResponse();
    await authController.oAuthLogin(req, res);
    expect(res.statusCode).to.equal(302);
  });
});

describe('FACEBOOK oAuthentication tests', () => {
  it('should save signup fb user and save in db', async () => {
    const req = {
      user: {
        id: '11212698071085sd67897',
        displayName: 'Jim Ntare',
        name: { familyName: 'Ntare', givenName: 'Jim' },
        emails: [{ value: 'jim.ntare@hotmail.com', verified: true }],
        provider: 'facebook',
      }
    };
    const res = mock.createResponse();
    await authController.oAuthLogin(req, res);
    expect(res.statusCode).to.equal(302);
  });

  it('should login the user', async () => {
    const req = {
      user: {
        id: '11212698071085sd67897',
        displayName: 'Jim Ntare',
        name: { familyName: 'Ntare', givenName: 'Jim' },
        emails: [{ value: 'jim.ntare@hotmail.com', verified: true }],
        provider: 'facebook',
      }
    };
    const res = mock.createResponse();
    await authController.oAuthLogin(req, res);
    expect(res.statusCode).to.equal(302);
  });
});
