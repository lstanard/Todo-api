var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Go to the bank',
	completed: true
}];

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10),
		matched;

	todos.forEach(function (todo) {
		if (todo.id === todoId)
			matched = todo;
	});

	if (matched)
		res.json(matched);
	else
		res.sendStatus(404).send();
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});