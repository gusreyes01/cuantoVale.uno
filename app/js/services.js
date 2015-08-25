angular.module('F1FeederApp.services', [])
  .factory('ergastAPIservice', function($http) {

    var ergastAPI = {};

    ergastAPI.getCategories = function(category) {
        console.log(category);
       var url = 'https://api.mercadolibre.com/categories/'+category;
      console.log(url);
      return $http({
        method: 'GET', 
          url: url
      });
    
    }


    // ergastAPI.getProducts = function(query,condition,capacity) {
    //    var url = 'https://api.mercadolibre.com/sites/MLM/search?category=MLM1055&q='+query+" "+capacity+'&condition='+condition+'&limit=50'
    //   console.log(url);
    //   return $http({
    //     method: 'GET', 
    //       url: url
    //   });
    
    // }


    ergastAPI.getProducts = function(capacity,condition, loadingTracker) {
       var url = 'https://api.mercadolibre.com/sites/MLM/search?category='+capacity+'&condition='+condition+'&limit=50'
      console.log(url);
      return $http({
        method: 'GET', 
          url: url,
          tracker: loadingTracker
      });
    
    }


    return ergastAPI;
  });