import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const urlEncoderParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use(express.static('public'));

// Storage object, tells multer where to put the file and what name to give it
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).fields([{ name: 'file', maxCount: 1 }]);

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '/uploadForm.html'));
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        // Check if successful
        if (err) return res.end("Error uploading file");

        const username = req.body.username;

        const uploadedFile = req.files['file'][0];

        console.log(`Username: ${username}`);
        console.log(`File Path: ${uploadedFile.path}`);
        res.end(`File and Form data uploaded Successfully!`);
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

app.get('/userPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'user.html'));
});

app.get('/studentForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'student.html'));
});

app.get('/adminForm', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'admin.html'));
});

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const userName = req.query.name;
    if (userId && userName) {
        res.send(`<html><body><h1>User ${userName}'s ID is : ${userId}</h1></body></html>`);
    } else res.status(400).send(`User ID and name is required`);
});

// Get Func
app.get('/getUser', (req, res) => {
    var response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
    };

    console.log("Response is: ", response);
    res.end(`Received Data ${JSON.stringify(response)}`);
});

app.get('/getStudent', (req, res) => {
    var response = {
        studentId: req.query.studentId,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        section: req.query.section
    };

    console.log("Response is: ", response);
    res.end(`Received Data ${JSON.stringify(response)}`);
});

app.post('/postAdmin', (req, res) => {
    upload(req, res, (err) => {
        if (err) return res.status(400).send (`Error uploading File.`);

        const uploadedFile = req.files['file'][0];
        var htmlResponse = `
            <html>
                <head>
                    <style>
                        * {
                            box-sizing: border-box;
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                        .file-info { color: green; }
                        .admin-info {
                                    background: white;
                                    padding: 40px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                    width: 100%;
                                    max-width: 400px;
                        }
                        body {
                                    height: 100vh;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    background: #f0f2f5;
                        }
                    </style>
                </head>
                <body>
                    <div class="admin-info">
                        <p>Admin ID: ${req.body.adminId}</p>
                        <p>First Name: ${req.body.firstName}</p>
                        <p>Last Name: ${req.body.lastName}</p>
                        <p>Department: ${req.body.department}</p>
                        <p>Uploaded File Path: ${uploadedFile.path}</p>
                    </div>
                </body>
            </html>
        `;

        res.send(htmlResponse);
    })
});


const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
