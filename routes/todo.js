const express = require('express'),
    router = express.Router(),
    {
        addTodo,
        updateTodo,
        getTodo,
        getMyTodos,
    } = require('../controllers/todo'),
    protect = require('../middleware/auth');

router.get('/', protect, getMyTodos);
router.route('/:id').get(protect, getTodo).put(protect, updateTodo);
router.post('/register', addTodo);

module.exports = router;
