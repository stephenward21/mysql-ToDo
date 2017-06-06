var express = require('express');
var router = express.Router();

var config = require('../config/config');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.host,
	user: config.userName,
	password: config.passWord,
	database: config.database

});

console.log(config);

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var message = req.query.msg;
	if (message == "added"){
		message = "your task was added!";
	}else if(message == "updated"){
		message = "Your task was updated!";
	}else if(message == "deleted"){
		message = "Your task was deleted!";
	}
	var selectQuery = "SELECT * FROM tasks ORDER BY taskDate";
	connection.query(selectQuery, (error, results)=>{
		res.render('index', {
			message: message,
			taskArray: results

		});
	});

  // res.render('index', { message: message });

});

router.post('/addItem',(req,res)=>{
	// res.json(req.body);
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;
	// We know what they submitted from the form. It comes to this route inside req.body.NAMEOFFIELD. 
	// Now we need to insert the info into mySQL.
	var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES ('"+newTask+"','"+dueDate+"')"
	// res.send(insertQuery);
	connection.query(insertQuery, (error,results)=>{
		if(error) throw error;
		res.redirect('/?msg=added');
	});
});

router.get('/delete/:id', (req,res)=>{
	var idToDelete = req.params.id;
	var deleteQuery = "DELETE FROM tasks WHERE id = " + idToDelete;
	connection.query(deleteQuery, (error,results)=>{
		res.redirect('/?msg=deleted');
	});
	
});

router.get('/edit/:id', (req,res)=>{
	var idToEdit = req.params.id;
	var selectQuery = "SELECT * FROM tasks WHERE id = ?";
	connection.query(selectQuery, [idToEdit], (error,results)=>{
		res.render('edit', {
			task: results[0],
		});

		// res.json(results);
	});
	
});
router.post('/editItem',(req,res)=>{
	// res.json(req.body);
	var newTask = req.body.newTask;
	var newTaskDate = req.body.newTaskDate;
	var idToEdit = req.query.id;

	var updateQuery = "UPDATE tasks SET taskName = ?, taskDate = ? WHERE id = ?";
	// // res.send(insertQuery);
	connection.query(updateQuery, [newTask, newTaskDate, idToEdit], (error,results)=>{
		if(error) throw error;
		res.redirect('/?msg=updated');
	});
});



module.exports = router;
