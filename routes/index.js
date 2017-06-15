var express = require('express');
var request = require('request');
var Q = require('q');

module.exports = function() {
    
    /********************* Routes(API) ******************************/
    return new express.Router()
    .get('/list', getRegionCountries)
    .get('/list/:region/sort', getRegionCountriesBySort);
    
    /********************** Handlers ********************************/
    
    function getRegionCountries(req, res, next) {
        var regionList = ['africa', 'americas', 'asia', 'europe', 'oceania'];
        if(req.query && req.query.q) {
            if(regionList.indexOf(req.query.q) > -1) {
                getRegionCountrylist(req.query.q)
                .then(function(list) {
                    res.send(list);
                }).catch(function(error) {
                    next(error);
                });
            } else {
                var error = new Error('Invalid region');
                res.statusCode = 400;
                next(error);    
            }
        } else {
            var error = new Error('Required query parameter "q=region" is missing');
            res.statusCode = 400;
            next(error);
        }  
    }
        
    function getRegionCountriesBySort(req, res, next) {
        var regionList = ['africa', 'americas', 'asia', 'europe', 'oceania'];
        if(regionList.indexOf(req.params.region) > -1) {
            getRegionCountrylist(req.params.region)
            .then(function(list) {
                getCountryDetails(list)
                .then(function(countries) {
                    var response = [];
                    countries.sort(function(obj1, obj2) {
                        return obj1.population - obj2.population;
                    });
                    for(var i in countries) {
                        response.push(countries[i].name);
                    }
                    res.send(response);
                }).catch(function(error) {
                    next(error);
                });
            }).catch(function(error) {
                next(error);
            });
        } else {
            var error = new Error('Invalid region');
            res.statusCode = 400;
            next(error);    
        }
    }
        
    //Get country list of a specified region    
    function getRegionCountrylist(region) {
        var deferred = Q.defer();
        request('https://restcountries.eu/rest/v2/region/' + region, function (error, response, body) {
            if(error) {
                deferred.reject(error);
            } else {
                body = JSON.parse(body);    
                var list = [];
                for(var i in body) {
                    list.push(body[i].name);
                }
                deferred.resolve(list);
            }  
        });
        return deferred.promise;
    }  
    
    //Get countries details - country ['country1', 'country2']
    function getCountryDetails(countries) {
        var deferred = Q.defer();
        var bResponseSent = false;
        var counter = 0;
        var countryDetails = [];
        for(var country in countries) {
            request(encodeURI('https://restcountries.eu/rest/v2/name/' + countries[country]), function (error, response, body) {
                if(error && !bResponseSent) {
                    bResponseSent = true;
                    deferred.reject(error);
                } else {
                    counter++;
                    countryDetails.push(JSON.parse(body)[0]);    
                    if(countries.length === counter && !bResponseSent) {
                        bResponseSent = true;
                        deferred.resolve(countryDetails);    
                    }
                }  
            });   
        }
        return deferred.promise;
    }
};