const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/download/:id', async (req, res) => {
    const id = req.params.id;
    const username = req.query.username; // Extract username from query parameters
    const filename = `${username}.pdf`; // Set the filename using the username
    const apiUrl = `https://api.ferretly.com/api/Subjects/${id}/downloadBackgroundReport`;

    const headers = {
        'X-Api-Key': process.env.FERRETLY_API_KEY,
        'Cookie': 'ARRAffinity=a9f9772ce09355a7e804dc3dca8211edd8f71abfbd54f1fedd3602246c0c13d3; ARRAffinitySameSite=a9f9772ce09355a7e804dc3dca8211edd8f71abfbd54f1fedd3602246c0c13d3',
    };

    try {
        const response = await axios({
            url: apiUrl,
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
            headers: {
                'Content-Type': 'application/pdf',
                ...headers,
            },
        });

        // Set the response headers for PDF download with the dynamic filename
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Send the PDF as the response
        res.send(response.data);

        console.log('PDF downloaded successfully.');
    } catch (error) {
        console.error('Error making API call:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});