const express = require('express');
const {
  models: { Employee, Department },
} = require('./db');

const app = express();

//body parser
app.use(express.json());

app.get('/api/employees', async (req, res, next) => {
  try {
    res.send(await Employee.findAll());
  } catch (err) {
    console.error(err);
  }
});

app.post('/api/departments', async (req, res, next) => {
  try {
    const newDept = await Department.create(req.body);
    if (newDept) {
      res.status(201).send(newDept);
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/api/departments/:id/employees', async (req, res, next) => {
  try {
    res.send(
      await Employee.findAll({
        where: {
          departmentId: req.params.id,
        },
      })
    );
  } catch (err) {
    console.error(err);
  }
});

module.exports = app;
