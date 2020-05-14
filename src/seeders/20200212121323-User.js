const bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'Users',
    [
      {
        id: '79660e6f-4b7d-4g21-81re-7av94jk91c8a',
        firstName: 'Bienjee',
        lastName: 'Bieio',
        email: 'jean@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'super administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '79660e6f-4b7d-4g21-81re-74f54jk91c8a',
        firstName: 'Paul',
        lastName: 'Jean',
        email: 'jdev@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        image: "http://res.cloudinary.com/dysa6ikka/image/upload/v1589801097/hecx0mei0ur7iyuikxbz.jpg",
        managerId: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        managerName: 'Muhoza devrpore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '79660e6f-4b7d-4g21-81re-74f54e9e1c8a',
        firstName: 'Aime',
        lastName: 'Bien',
        email: 'jeanne@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        managerId: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        managerName: 'Muhoza devrpore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '79660e6f-4b7d-4d21-81re-74f54e9e1c8a',
        firstName: 'Jacques',
        lastName: 'Boby',
        email: 'jeannette@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: false,
        role: 'requester',
        managerId: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        managerName: 'Muhoza devrpore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        firstName: 'Muhoza',
        lastName: 'devrpore',
        email: 'umuhozad@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '79660e6f-4b7d-4d21-81ad-74f54e9e1c8a',
        firstName: 'Kool',
        lastName: 'Kelly',
        email: 'jim@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'travel administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '79660e6f-4b7d-4d21-81ad-74f64e9e1c8a',
        firstName: 'Jamie',
        lastName: 'Jules',
        email: 'jules@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0119b84a-99a4-41c0-8a0e-6e0b6c905165',
        firstName: 'Joan',
        lastName: 'Mutesi',
        email: 'mutesi@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'travel administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0119b84a-99a4-41c0-8a0e-6f0b6c905165',
        firstName: 'devrepubli',
        lastName: 'devrpo',
        email: 'uwase@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'supplier',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '75c34027-a2f0-4b50-808e-0c0169fb074c',
        firstName: 'peter',
        lastName: 'Ishimwe',
        email: 'ishimwe@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0119b84a-99a4-41c0-8a0e-6g0b6c905165',
        firstName: 'peter',
        lastName: 'Ishimwe',
        email: 'peter@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        managerId: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        managerName: 'Muhoza devrpore',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'aed6785b-382f-43a7-a0b5-15a78dd02cc7',
        firstName: 'Bien',
        lastName: 'Aime',
        email: 'rejectuser@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        image: "http://res.cloudinary.com/dysa6ikka/image/upload/v1589802254/juxrjlxrgswovte9hjdb.jpg",
        managerId: '79660e6f-4b7d-4d21-81ad-74f64e9e1c8a',
        managerName: 'Jamie Jules',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'a3426db1-1d2f-4c2c-8f25-c99962aff3fe',
        firstName: 'bien',
        lastName: 'aime',
        email: 'jean@okay.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        managerId: '79660e6f-4b7d-4d21-81ad-74f64e9e1c8a',
        managerName: 'Jamie Jules',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
