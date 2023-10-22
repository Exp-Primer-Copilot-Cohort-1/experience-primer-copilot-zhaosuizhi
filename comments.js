// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

// Create express app
const app = express();

// Use body parser
app.use(bodyParser.json());

// Use cors
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Get comments by post id
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// Create comment
app.post('/posts/:id/comments', async (req, res) => {
  // Get id
  const commentId = randomBytes(4).toString('hex');

  // Get content and status
  const { content, status } = req.body;

  // Get comments
  const comments = commentsByPostId[req.params.id] || [];

  // Push comment
  comments.push({ id: commentId, content, status });

  // Set comments
  commentsByPostId[req.params.id] = comments;

  // Send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status },
  });

  // Send response
  res.status(201).send(comments);
});

// Send event to event bus
app.post('/events', async (req, res) => {
  // Get type and data
  const { type, data } = req.body;

  // Log type
  console.log(`Event received: ${type}`);

  // Check type
  if (type === 'CommentModerated') {
    // Get id, postId, content, status
    const { id, postId, content, status } = data;

    // Get comments
    const comments = commentsByPostId[postId];

    // Get comment
    const comment = comments.find((comment) => comment.id === id);

    // Set status
    comment.status = status;

    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, content, status },
    });
  }

  // Send response
  res.send({});
}
