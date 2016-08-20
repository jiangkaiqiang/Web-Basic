var coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox','ngSanitize','ui.select',
                                         'ngCookies', 'xeditable','angucomplete-alt','angular-table']);
var user;

angular.element(document).ready(function($ngCookies, $location) {
	$.ajax({
	      url: '/i/user/findUser',
	      type: "GET",
	      dataType: 'json',
	      cache: false
	    }).success(function(data){
	    	user = data;
	    	if(user.username == null){
	    		if(window.location.pathname != "/login.html" && window.location.pathname != '/register.html'){
	    			document.location.href = "/login.html";
	    		}
	        }
	    	angular.bootstrap(document, ['ColdWeb']);
	    })
});


coldWeb.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

coldWeb.run(function(userService) {
      userService.setUser(user);
	  userService.setStorage();
});


coldWeb.config(function($httpProvider) {
	$httpProvider.interceptors.push(function ($q,$injector) {
        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {
            	var modal = $injector.get('$Modal');
            	modal.open({
            		animation : true,
                    templateUrl: 'app/template/error.html',
                    controller: 'error',
                    backdrop: true,
                    resolve: {
                    	rejection : function() {
                    		return rejection;
                    	}
                    }
                });

                return $q.reject(rejection);
            }
        };
    });
});


coldWeb.factory('baseTools',['$rootScope',function(){
	return {
		getFormatTimeString: function(delta){
			delta = delta ? delta + 8 * 60 * 60 * 1000: 8 * 60 * 60 * 1000;
			return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/,"")
		},
		formatTime: function(timeString){
			if (typeof(timeString) == "string"){				
				return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
			}else{
				return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"")
			}
		},
		getEchartSingleOption: function(title, xData, yData, yName, yUnit, lineName, type){
			option = {
				    tooltip : {
				        trigger: 'axis'
				    },
				    title: {
		                text: title
		            },
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            data : xData
				        }
				    ],
				    yAxis : [
					        {
					            type : 'value',
					            name : yName,
					            axisLabel : {
					                formatter: '{value} ' + yUnit
					            }
					        }
					    ],
				    series : [
				        {
				            name:lineName,
				            type: type,
				            data:yData,
				        }
				    ]
				};
			return option
		}
	}
}])


coldWeb.factory('userService', ['$rootScope', '$state', '$http', function ($rootScope, $state,$http) {
    return {
        setUser: function (user) {
            $rootScope.user = user;
        },
        setStorage: function () {
        	$rootScope.initAllByRdcId = function(rdcId){
        		$rootScope.rdcId = rdcId;
        		// 初始化冷库
        		$http.get('/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(
        				function(data,status,headers,config){
        					$rootScope.mystorages = data;
        					$rootScope.storageModal = data[0];
        				});
        		// 初始化压缩机组
        		$http.get('/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(
        				function(data,status,headers,config){
        					$rootScope.compressorGroups = data;
        					// 初始化压缩机
        					angular.forEach($rootScope.compressorGroups,function(item){
        						$http.get('/i/compressor/findBygroupId?groupId=' + item.id).success(
        								function(data,status,headers,config){
        									item.compressors = data;
        								})
        					})
        				})
        	  // 初始化电量
        	  $http.get('/i/power/findByRdcId?rdcId=' + rdcId).success(
        			  function(data,status,headers,config){
        				  $rootScope.powers = data;
        			  })
        	 //  初始化月台门
             $http.get('/i/platformDoor/findByRdcId?rdcId=' + rdcId).success(
            		 function(data,status,headers,config){
            			 $rootScope.platformDoors = data;
            		 })
             // 初始化
        	}
        	
        	$rootScope.changeRdc = function(value){
        		if(value){
        			if(value.originalObject == $rootScope.vm.choserdc){
        				return
        			}
            		$rootScope.vm.choserdc = value.originalObject
        		}
        		$rootScope.initAllByRdcId($rootScope.vm.choserdc.id)
        	}

            var compressors = [];
            var mystorages = [];
            if ($rootScope.user != null && $rootScope.user!='' && $rootScope.user!= undefined && $rootScope.user.id != 0){
            	$http.get('/i/rdc/findRDCsByUserid?userid=' + $rootScope.user.id).success(
            			function(data,status,headers,config){
            				if(data.length == 0){
            					document.location.href = "/notAudit.html";
            				}
            				$rootScope.vm = {choserdc:data[0],allUserRdcs:data};
            				$rootScope.initAllByRdcId($rootScope.vm.choserdc.id)
            			})
            }

            $rootScope.toMyCompressor = function (compressorID) {
                $state.go('compressorPressure', {'compressorID': compressorID});
            };
            $rootScope.toMyBlowers = function () {
                $state.go('compressorBlower', {'userId': $rootScope.user.id});
            };
            //$rootScope.mystorages = [{'name': "上海-浦东-#1", 'id': 1}, {'name': "上海-浦东-#2",'id': 2}, {'name': "北京-五环-#1", 'id': 3}];
//      xuyanan coldStorageDiv.html - -
 /*           $rootScope.openColdDiv = function (storageID){
            	console.log("openColdDiv: "+storageID);
            	$state.go('coldStorageDiv',{'storageID': storageID});
            }*/
            $rootScope.openColdDiv = function (){
                console.log("openColdDiv: "+$rootScope.rdcId);
                $state.go('coldStorageDiv',{'storageID': $rootScope.rdcId});
            }
            $rootScope.openWarn = function (){
                console.log("openWarn: "+$rootScope.rdcId);
                $state.go('warn',{'rdcId': $rootScope.rdcId});
            }
            $rootScope.toRdcPower = function () {
                console.log($rootScope.rdcId);
                $state.go('rdcPower', {'rdcId': $rootScope.rdcId});
            };
            $rootScope.toMyStorageTemper = function (storageID) {
                console.log(storageID);
                $state.go('coldStorageTemper', {'storageID': storageID});
            };
            $rootScope.toMyStorageDoor = function (storageID) {
                console.log(storageID);
                $state.go('coldStorageDoor', {'storageID': storageID});
            };
            $rootScope.toMap = function () {
                $state.go('coldStorageMap', {});
            };
            $rootScope.toReport = function () {
                var time = 'daily';
                var item = 'data';
                $state.go('report', {'time':time,'item':item});
            };
        },
    };
}]);


coldWeb.filter('objectCount', function () {
    return function (input) {
        var size = 0, key;
        for (key in input) {
            if (input.hasOwnProperty(key)) size++;
        }
        return size;
    }
});

coldWeb.filter('toArray', function () {
    'use strict';

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).filter(function (key) {
            if (key.charAt(0) !== "$") {
                return key;
            }
        }).map(function (key) {
            if (!(obj[key] instanceof Object)) {
                obj[key] = {value: obj[key]};
            }

            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    };
});

coldWeb.directive('snippet', function () {
    return {
        restrict: 'E',
        template: '<pre><div class="hidden code" ng-transclude></div><code></code></pre>',
        replace: true,
        transclude: true,
        link: function (scope, elm, attrs) {
            scope.$watch(function () {
                return elm.find('.code').text();
            }, function (newValue, oldValue) {
                if (newValue != oldValue) {
                    elm.find('code').html(hljs.highlightAuto(newValue).value);
                }
            });
        }
    };
});

coldWeb.directive('activeLink', ['$location','$filter', function (location,filter) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = element.children().attr('href') + "";
            path = filter('limitTo')(path,path.length - 1 ,1);
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                if (newPath.indexOf(path) > -1) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);

coldWeb.filter('sizeformat',function(){
    return function(size){
        if(size / (1024 * 1024 * 1024) > 1)
            return (size/(1024*1024*1024)).toFixed(2)+'G';
        else if(size / (1024*1024) > 1)
            return (size/(1024*1024)).toFixed(2)+'M';
        else if(size / 1024 > 1)
            return (size/1024).toFixed(2)+'K';
        else
            return size+'B'
    }
});

coldWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/about");

    //index
    $stateProvider.state('about',{
    	url:'/about',
    	controller: 'base',
        templateUrl: 'app/template/about.html'
    }).state('login',{
    	url:'/login',
    	controller: 'login',
        templateUrl: 'app/template/login.html'
    }).state('warn', {
        url: '/warn/:rdcId',
        controller: 'warn',
        templateUrl: 'app/template/warn.html'
    }).state('myColdStorage',{
    	url:'/myColdStorage/:storageID',
    	controller: 'myColdStorage',
        templateUrl: 'app/template/myColdStorage.html'
    }).state('designStorage',{
    	url:'/designStorage',
    	controller: 'designStorage',
        templateUrl: 'app/template/designStorage.html'
    }).state('report',{
    	url:'/report-{time}-{item}',
    	controller: 'report',
        templateUrl: 'app/template/report.html'
    }).state('coldStorageMap', {
        url: '/coldStorageMap/:storageID',
        controller: 'coldStorageMap',
        templateUrl: 'app/template/coldStorageMap.html'
    }).state('coldStorageMonitor', {
        url: '/coldStorageMonitor/:storageID',
        controller: 'coldStorageMonitor',
        templateUrl: 'app/template/coldStorageMonitor.html'
    }).state('compressorMonitor', {
        url: '/compressorMonitor/:storageID',
        controller: 'compressorMonitor',
        templateUrl: 'app/template/compressorMonitor.html'
    }).state('coldStorageDoor', {
        url: '/coldStorageDoor/:storageID',
        controller: 'coldStorageDoor',
        templateUrl: 'app/template/coldStorageDoor.html'
    }).state('coldStorageInOutGoods', {
        url: '/coldStorageInOutGoods',
        controller: 'coldStorageInOutGoods',
        templateUrl: 'app/template/coldStorageInOutGoods.html'
    }).state('coldStorageTemper', {
        url: '/coldStorageTemper/:storageID',
        controller: 'coldStorageTemper',
        templateUrl: 'app/template/coldStorageTemper.html'
    }).state('compressorPressure', {
        url: '/compressorPressure/:compressorID',
        controller: 'compressorPressure',
        templateUrl: 'app/template/compressorPressure.html'
    }).state('compressorBlower', {
        url: '/compressorBlower/:userId',
        controller: 'compressorBlower',
        templateUrl: 'app/template/compressorBlower.html'
    }).state('coldStorageDiv', {
        url: '/coldStorageDiv/:storageID',
        controller: 'coldStorageDiv',
        templateUrl: 'app/template/coldStorageDiv.html'
    }).state('rdcPower', {
        url: '/rdcPower/:rdcId',
        controller: 'rdcPower',
        templateUrl: 'app/template/rdcPower.html'
    }).state('historyData',{
    	url:'/historyData',
    	controller: 'historyData',
        templateUrl: 'app/template/historyData.html'
    }).state('power',{
    	url:'/power/{powerid}',
    	controller: 'power',
        templateUrl: 'app/template/power.html'
    }).state('waterCost',{
    	url:'/waterCost',
    	controller: 'waterCost',
        templateUrl: 'app/template/waterCost.html'
    }).state('platformDoor',{
    	url:'/platformDoor/{doorid}',
    	controller: 'platformDoor',
        templateUrl: 'app/template/platformDoor.html'
    }).state('other',{
    	url:'/otherDevice',
    	controller: 'other',
        templateUrl: 'app/template/other.html'
    });

});