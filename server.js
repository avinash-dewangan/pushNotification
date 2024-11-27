// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use Express to parse incoming request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// In-memory storage for applications (for simplicity, you can use a database in real scenarios)
let applications = [];

// Serve a simple HTML page (index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission and store application
app.post('/submit', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).send('Name and email are required.');
    }
    
    // Store the application (you can add more details as needed)
    const application = { name, email, status: 'pending' };
    applications.push(application);

    // Emit a notification to all approvers about the new application
    io.emit('notification', {
        message: `New application submitted by ${name} (${email}) - Pending approval.`,
        type: 'new-application'
    });

    // Respond to the applicant
    res.send('<h1>Application Submitted Successfully!</h1>');
});


// Handle application approval (for simplicity, we assume Person B approves it)
app.post('/approve/:email', (req, res) => {
    const email = req.params.email;

    // Find the application by email
    const application = applications.find(app => app.email === email);

    if (application && application.status === 'pending') {
        // Mark the application as approved
        application.status = 'approved';

        // Emit a notification to the applicant (Person A) that their application was approved
        io.emit('notification', {
            message: `Your application has been approved!`,
            type: 'application-approved',
            email: email  // Notify only the applicant
        });

        res.send('<h1>Application Approved!</h1>');
    } else {
        res.send('<h1>Application not found or already approved.</h1>');
    }
});

// Listen for client connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
