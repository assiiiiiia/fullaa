import express from 'express';
import db from './db.js';

const router = express.Router();

// Ensure all paths include `/api`
const apiBasePath = '/api';

// Middleware to prefix all routes with `/api`
router.use(apiBasePath, (req, res, next) => {
  next();
});

// Get the number of tasks due today
router.get('/tasks/today', (req, res) => {
  const query = `
    SELECT COUNT(*) AS taskCount
    FROM tasks
    WHERE DATE(due_date) = CURDATE() 
      AND due_date > NOW()
      AND (status = 'pas commencé' OR status = 'en cours')
  `;

  db.query(query, (err, results) => { 
    if (err) {
      console.error('Error fetching tasks due today:', err);
      return res.status(500).send('Server Error');
    }
    res.json({ taskCount: results[0].taskCount });
  });
});

// Get all tasks due today and order by priority, filter by status
router.get('/tasks', (req, res) => {
  const query = `
    SELECT * 
    FROM tasks
    WHERE DATE(due_date) = CURDATE() 
      AND due_date > NOW()
      AND (status = 'pas commencé' OR status = 'en cours')
    ORDER BY FIELD(priority, 'urgent', 'important', 'moins important')
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Server Error');
    }
    res.json(results); 
  });
});

// Update a task
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task_name, category, due_date, status, priority } = req.body;

  const query = `
    UPDATE tasks 
    SET 
      task_name = ?, 
      category = ?, 
      due_date = ?, 
      status = ?, 
      priority = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [task_name, category, due_date, status, priority, id],
    (err, result) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche." });
      }
      res.status(200).json({ message: "Tâche mise à jour avec succès." });
    }
  );
});

// API endpoint to fetch tasks grouped by status
router.get('/tasks-by-status', (req, res) => {
  const query = `
    SELECT * 
    FROM tasks
    ORDER BY FIELD(status, 'pas commence', 'en cours', 'termine')`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des tâches :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    const groupedTasks = {
      "pas commence": [],
      "en cours": [],
      "termine": [],
    };

    results.forEach((task) => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].push(task);
      }
    });

    res.json(groupedTasks);
  });
});
router.post('/tasks-add', (req, res) => {
  const { task_name, category, due_date, due_time, priority } = req.body;
  console.log('Route /tasks-add appelée avec les données :', req.body);

  // Validation de la priorité
  const validPriorities = ['moins important', 'important', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ message: "Priorité invalide." });
  }

  // If no time is provided, set it to 23:59:59 of that day
  const dueDateTime = due_time ? `${due_date} ${due_time}` : `${due_date} 23:59:59`;
  const dueDateObj = new Date(dueDateTime);

  // Check for valid date and ensure it's not in the past
  if (isNaN(dueDateObj)) {
    return res.status(400).json({ message: "Date ou heure invalide." });
  }

  const currentDate = new Date();
  if (dueDateObj < currentDate) {
    return res.status(400).json({ message: "La date d'échéance ne peut pas être dans le passé." });
  }

  const query = `INSERT INTO tasks (task_name, category, due_date, priority) VALUES (?, ?, ?, ?)`;
  const values = [task_name, category, dueDateTime, priority];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res.status(500).json({ message: "Erreur lors de l'insertion de la tâche." });
    }
    res.json({ message: "Tâche insérée avec succès !" });
  });
});

// Route to update task status
router.put('/tasks/:id/status', (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pas commence', 'en cours', 'termine', 'annule'];
  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status');
  }

  const query = `UPDATE tasks SET status = ? WHERE id = ?`;
  const values = [status, taskId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).send('Error updating task status');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Task not found');
    }

    res.send('Task status updated successfully');
  });
});

// Endpoint to get completed tasks
router.get('/history', (req, res) => {
  const query = 'SELECT * FROM tasks WHERE status = "termine"';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching tasks');
    } else {
      res.json(results);
    }
  });
});

export default router;
