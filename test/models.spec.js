const { expect } = require('chai');
const {
  syncAndSeed,
  models: { Employee },
} = require('../db');

describe('Models', () => {
  let seed;
  beforeEach(async () => {
    seed = await syncAndSeed();
  });
  describe('seeded data', () => {
    it('there are 3 employees', async () => {
      // const seed = await syncAndSeed();
      expect(Object.keys(seed.employees).length).to.equal(3);
    });
    it('lucy is an employee', () => {
      expect(seed.employees.lucy.name).to.equal('lucy');
      expect(seed.employees.lucy.bio).to.be.ok;
    });
    it('there are 2 departments', async () => {
      // const seed = await syncAndSeed();
      expect(Object.keys(seed.departments).length).to.equal(2);
    });
    // testing associations
    it('lucy is in engineering', () => {
      const lucy = seed.employees.lucy;
      const engineering = seed.departments.engineering;
      expect(lucy.departmentId).to.equal(engineering.id);
    });
    it('larry is in engineering', () => {
      const larry = seed.employees.larry;
      const engineering = seed.departments.engineering;
      expect(larry.departmentId).to.equal(engineering.id);
    });
  });

  describe('maximum employees in department', () => {
    it('a department can only have a max of 3 employees', async () => {
      await Employee.create({
        name: 'whatever',
        departmentId: seed.departments.engineering.id,
      });
      try {
        await Employee.create({
          name: 'one more',
          departmentId: seed.departments.engineering.id,
        });
        throw new Error('nooooo');
      } catch (err) {
        expect(err.message).to.equal('no more than 3');
      }
    });
    it('a department can only have a max of 3 employees, but I can update an employee already in department', async () => {
      await Employee.create({
        name: 'whatever',
        departmentId: seed.departments.engineering.id,
      });
      const lucy = seed.employees.lucy;
      lucy.bio = 'New bio';
      await lucy.save();
    });
  });
});
