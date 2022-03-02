const express = require('express');
const router = new express.Router();
const controller = require('../controller/appController')

let routes = (app) => {
    try {
        router.post('/api/v1/task/addDetails', controller.addDetails);
        router.get('/api/v1/task/getDetails', controller.getDetails);
        router.get('/api/v1/task/format02', controller.getDetails_format02);
        app.use(router);    
        
    } catch (error) {
        console.log(error);
    }
};

module.exports = routes;