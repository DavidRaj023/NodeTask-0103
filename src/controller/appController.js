const { sql,poolPromise } = require('../services/dbService')
const fs = require('fs');
const constants = require('../utils/constant');
const util = require('../utils/util');

class MainController {
  async addDetails(req, res){
    try {
        if(req.body != null) {
          const info = req.body;
          await validate(info.city);
          console.log(info);
          const pool = await poolPromise;
          const result = await pool.request()
          .input('city',sql.VarChar , info.city)
          .input('male',sql.VarChar , info.male)
          .input('female',sql.VarChar , info.female)
          .query(constants.QUERY_INSERT);
          res.send(info.city + " Details Successfully Added");
        } else {
          res.send('Please fill all the details!')
        }        
    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
  }

  async getDetails(req, res){
    try {
      const searchQuery = constants.QUERY_GETALLDATA;
      const pool = await poolPromise
      const result = await pool.request().query(searchQuery);
      const info = result.recordset;
      let maleDetails = [];
      let femaleDetails = [];
      let categories = [];
      if(info.length == 0){
        res.status(200).send({
        result: "No data Found"
        })
      }
      
      info.forEach(detail => {
        maleDetails.push({
          "label" : detail.city,
          "value": detail.male,
          "tooltext": "Total Male Population at Chennai : " + util.numberFormatter(detail.male)
        });
      })
      
      info.forEach(detail => {
        femaleDetails.push({
          "label" : detail.city,
          "value": detail.female,
          "tooltext": "Total Female Population at Chennai : " + util.numberFormatter(detail.female)
        });
      });

      info.forEach(detail => {
        let temp = {
          "label" : detail.city
        }
        categories.push(temp)
      })
      
      res.status(200).send({
        "data": {maleDetails, femaleDetails, categories}
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDetails_format02(req, res){
    try {
      const searchQuery = constants.QUERY_GETALLDATA;
      const pool = await poolPromise
      const result = await pool.request().query(searchQuery);
      const info = result.recordset;
      let columns = [];
      let dataSource = [];
      
      if(info.length == 0){
        res.status(200).send({
        result: "No data Found"
        })
      }
      info.forEach(detail => {
       columns.push({
          "title" : detail.city,
          "dataIndex": detail.city,
          "key": detail.city
        });
      });
      
      let key = 1;
      info.forEach(detail => {
        
        dataSource.push({
          "key" : key,
          "city": detail.city,
          "male": detail.male,
          "female": detail.female
        });
        key ++;
      });

      res.status(200).send({
        "data": {columns, dataSource}
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const validate = async(value) =>{
  try {
    const pool = await poolPromise
    const result = await pool.request()
    .query(constants.QUERY_GETALLNAME)
    var data = result.recordset;
    console.log(data);
    const check = util.findFromSet(value, data);
    if(check){
      throw new Error(value) + " Details has been already entered";
    }
  } catch (error) {
      throw new Error(error);
  }
}

const controller = new MainController();
module.exports = controller;
