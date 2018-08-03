const urlConfiguration = require('./urlConfigs.js');
const request = require('request');
const esprima = require('esprima');
const toValue = require('esprima-to-value');
var debug = require('debug')('express-sequelize');


function requestAndParsePromise(serverType, url) {
    return new Promise((resolve) => {
        request.get(url, (error, response, body) => {
           //var parsedJavascript = esprima.parse(body);
            //let returnData = toValue(parsedJavascript.body[0].expression.arguments)[0].config;
            //console.log(body);
            var parsedJson = JSON.parse(body);
            let returnArray = [];
 
            parsedJson.Jurisdictions.forEach((jurisdiction) =>{
                returnArray.push({
                    JurisdictionId: jurisdiction.JurisdictionId,
                    DisplayName: jurisdiction.DisplayName,
                    CanRegister: jurisdiction.CanRegister,
                    Country: jurisdiction.Country,
                    PhoneCode: jurisdiction.PhoneCode,
                    State: jurisdiction.State
                })
            }, this);

            resolve(returnArray);
        });
    });
};

function requestAndParsePromiseWithAuth(serverType, URL) {
    var username = 'guest@customer1';
    var password = 'guest';
    var options = {
        url: URL,
        auth: {
          user: username,
          password: password
        }
      }

    return new Promise((resolve) => {
        request.get(options, (error, response, body) => {
            var parsedJson = JSON.parse(body);
            let returnArray = [];
 
            parsedJson.forEach((metric) =>{
                metric.metricValues.forEach((metricValue) =>{
                    returnArray.push({
                        MetricName: metric.metricName,
                        MetricPath: metric.metricPath,
                        MaxValue: metricValue.max
                    })
                }, this);    
            }, this);
               

            resolve(returnArray);
        });
    });
};

function initData (models) {
    return new Promise((resolve) => {
        models.appdmetrix.sync({
            force: false
        }).then(() => {
            return models.appdmetrix.count();
        }).then((instanceCountValue) => {
            let promiseArray = [];
            if (instanceCountValue > 0) {
                return resolve();
            }
            else {
                urlConfiguration.forEach(function (url) {
                        promiseArray.push(requestAndParsePromiseWithAuth(url.name, url.url));
                }, this);
                return Promise.all(promiseArray);
            }
        }).then((returnResults) => {
            // Flatten the 2d array
            if (returnResults) {
                var allItems = [].concat.apply([], returnResults);
                return models.appdmetrix.bulkCreate(allItems);
            }
        }).then(() => {
            resolve();
        });
    });
};

module.exports = initData;