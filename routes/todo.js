const express = require('express'),
    router = express.Router(),
    {
        addTodo,
        updateTodo,
        getTodo,
        getMyTodos,
    } = require('../controllers/todo'),
    protect = require('../middleware/auth');

router.get('/', getMyTodos);
// router.get('/', protect, getMyTodos);
router.route('/:id').get(getTodo).put(updateTodo);
// router.route('/:id').get(protect, getTodo).put(protect, updateTodo);
router.post('/', addTodo);
// router.post('/', protect, addTodo);

module.exports = router;
