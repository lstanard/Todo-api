var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=false&q=house
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true')
		where.completed = true;
	else if (query.hasOwnProperty('completed') && query.completed === 'false')
		where.completed = false;

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo)
			res.json(todo.toJSON());
		else
			res.status(404).send();
	}, function (e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	// This is how the instructor approached it

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0)
			res.status(404).json({error: 'No todo found with that ID.'});
		else
			res.status(204).send();
	}, function () {
		res.status(500).send();
	});

	// This is how I approached it, and it works fine.
	// Although, it's probably better to return a status of 204
	// instead of the results of the destory() method.

	// db.todo.findById(todoId).then(function (todo) {
	// 	if (!!todo)
	// 		res.json(todo.destroy());
	// 	else
	// 		res.status(404).send({"error": "No todo found with that ID."});
	// }, function (e) {
	// 	res.status(500).send();
	// });
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});

	// This is how I approached it, and it works fine.
	// The method above is better since it's properly using
	// promises, instead of the else clause below.

	// db.todo.findById(todoId).then(function (todo) {
	// 	if (!!todo) {
	// 		todo.update(body).then(function (todo) {
	// 			res.json(todo.toJSON());
	// 		});
	// 	} else {
	// 		res.status(404).send({"error": "No todo found with that ID."});
	// 	}
	// }, function (e) {
	// 	res.status(500).send();
	// });
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT);
	});
});