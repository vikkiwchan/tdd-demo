const Sequelize = require('sequelize');
const { STRING, TEXT } = Sequelize;
const faker = require('faker');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_demo_db',
  { logging: false }
);

const Employee = db.define('employee', {
  name: {
    type: STRING,
  },
  bio: {
    type: TEXT,
  },
});

Employee.addHook('beforeSave', (employee) => {
  if (!employee.bio) {
    employee.bio = `BIO FOR ${employee.name} ${faker.lorem.paragraphs(3)} ${
      employee.name
    }`;
  }
});

const Department = db.define('department', {
  name: {
    type: STRING,
  },
});

Employee.belongsTo(Department);
Department.hasMany(Employee);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [moe, lucy, larry, hr, engineering] = await Promise.all([
    Employee.create({ name: 'moe' }),
    Employee.create({ name: 'lucy' }),
    Employee.create({ name: 'larry' }),
    Department.create({ name: 'hr' }),
    Department.create({ name: 'engineering' }),
  ]);
  lucy.departmentId = engineering.id;
  larry.departmentId = engineering.id;
  await Promise.all([lucy.save(), larry.save()]);
  // console.log(lucy);
  return {
    employees: { moe, lucy, larry },
    departments: { hr, engineering },
  };
};

module.exports = {
  syncAndSeed,
};
