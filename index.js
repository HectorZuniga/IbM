const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config();

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: process.env.apikey,
    }),
    serviceUrl:  process.env.URL,
});
const app = express()
app.use(express.static(__dirname + 'index.html'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/autor', (req, res) => {
    res.statusCode = 200;
    res.send({ "alumno": "Hector Zuniga" , "servicio":"Cloud Foundry en IBM Cloud"})
})

app.post('/', (req, res) => {
    const texto = req.body.text;

    const toneParams = {
        toneInput: { 'text': texto },
        contentType: 'application/json',
    };   
    toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            JSON.stringify(toneAnalysis, null, 2);
            res.send({ "respuesta": toneAnalysis })
        })
        .catch(err => {
            console.log('error:', err);
        }); 
})

app.listen(8080, function () {
    console.log('app is running in http://localhost:8080')
})