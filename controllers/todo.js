const Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode'),
  Todo = require('../models/Todo'),
  Response = require('../models/Response'),
  StatusCode = require('../models/StatusCode');

// Add a todo
exports.addTodo = async (req, res, next) => {
  const response = new Response();

  try {
    const { title, description, done } = req.body;

    // if (!title || !description) {
    //   response.setError('Title and description is required!');

    //   const { ...responseObj } = response;

    //   return res
    //     .status(StatusCode.getStatusCode(responseObj))
    //     .json(responseObj);
    // }

    await Todo.create({ title, description, done });

    response.setSuccess('Todo successfully created!');

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error, 'error');

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Update todo
exports.updateTodo = async (req, res, next) => {
  const response = new Response();

  try {
    const updTodo = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { updTodo },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    response.setSuccessAndDataWithMessage(
      { todo },
      'Todo updated successfully!',
    );

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get todo
exports.getTodo = async (req, res, next) => {
  const response = new Response();

  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      response.setNotFound('Todo not found!');

      const { ...responseObj } = response;

      return res
        .status(StatusCode.getStatusCode(responseObj))
        .json(responseObj);
    }

    response.setSuccessAndData({ todo });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};

// Get current logged in user's todos
exports.getMyTodos = async (req, res, next) => {
  const response = new Response();

  try {
    const todos = await Todo.find({ userId: req.user.id }).sort('name');

    response.setSuccessAndData({ todos });

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  } catch (error) {
    console.log(error);

    response.setServerError(error);

    const { ...responseObj } = response;

    res.status(StatusCode.getStatusCode(responseObj)).json(responseObj);
  }
};
