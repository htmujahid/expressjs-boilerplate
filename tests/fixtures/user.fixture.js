const { faker } = require('@faker-js/faker');
const { User } = require('../../src/database/queries');
const { ObjectId } = require('mongodb');

const password = 'password1';

const userOne = {
    _id: ObjectId.createFromHexString(faker.database.mongodbObjectId()),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    emailVerified: null,
};

const userTwo = {
    _id: ObjectId.createFromHexString(faker.database.mongodbObjectId()),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),    
    email: faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    emailVerified: null,
};

const userThree = {
    _id: ObjectId.createFromHexString(faker.database.mongodbObjectId()),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),    
    email: faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    emailVerified: null,
};

const admin = {
    _id: ObjectId.createFromHexString(faker.database.mongodbObjectId()),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password,
    role: 'admin',
    emailVerified: null,
};

const insertUsers = async (users) => {
    await User.registerManyUsers(users);
};

module.exports = {
    userOne,
    userTwo,
    userThree,
    admin,
    insertUsers,
};
