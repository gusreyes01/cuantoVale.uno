angular.module('F1FeederApp.controllers', ['ajoslin.promise-tracker']).

/* Drivers controller */
controller('driversController', function($scope, ergastAPIservice,promiseTracker) {
    $scope.loadingTracker = promiseTracker();
    $scope.condition = "new";
    $scope.nameFilter = null;
    $scope.driversList = [];
    $scope.category = "MLM1055";
    $scope.modelsList = "";
    $scope.capacityList = "";



    ergastAPIservice.getCategories($scope.category).success(function(response) {
      $scope.categories = response.children_categories;
    });


//use `tracker:` shortcut in $http config to link our http promise to a tracker
  //This shortcut is included in promise-tracker-http-interceptor.js


    $scope.categoryChange = function() {
      $scope.prodValue = 0;
      $scope.modelsList = "";
      $scope.capacityList = "";
      $scope.capacity = "";
      ergastAPIservice.getCategories($scope.categoriesList.id).success(function(response) {
        $scope.models = response.children_categories;
      });
    }

    $scope.modelChange = function() {
      $scope.prodValue = 0;
      $scope.capacityList = "";
      ergastAPIservice.getCategories($scope.modelsList.id).success(function(response) {
        $scope.capacity = response.children_categories;
        if(response.children_categories.length == 0){
          $scope.capacityList = $scope.modelsList;
          $scope.capacityChange();
        }

      });
    }

    $scope.capacityChange = function() {
        if ($scope.prodFilter != "") {
            ergastAPIservice.getProducts($scope.capacityList.id,$scope.condition,$scope.loadingTracker).success(function(response) {
                    //Digging into the response to get the relevant data
                    var log = [];
                    $scope.prodValue = 0;
                    var sumPrice = 0;
                    console.log(response.results);
                    angular.forEach(response.results, function(value, key) {
                        sumPrice += value.price;
                    });
                    $scope.driversList = response.results;
                    $scope.prodValue = (sumPrice / (response.results.length))*0.9;
                    console.log(response.results.length);
                });
            } else {
                sumPrice = 0;
            }     
            if($scope.prodValue == 0){
              $scope.prodValue = "No hay información disponible para este producto."
            }
};


});