/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('storageManage', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.optAudit = '8';
	// 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.rdcs = [];
	$scope.getRdcs = function(){
		    $http({
		    	method:'POST',
		    	url:'/i/rdc/findRdcDTOByPage',
		    	params:{
		    		pageNum : $scope.bigCurrentPage,
		    		pageSize : $scope.maxSize, 
		    		audit:$scope.optAudit,
		    		keyword:$scope.keyword
		    	}
		    }).success(function (data) {
		    	 $scope.bigTotalItems = data.total;
			     $scope.rdcs = data.list;
		    });
	}
    
    $scope.pageChanged = function () {
    	 $scope.getRdcs();
    }
    $scope.getRdcs();
    // 获取当前冷库的列表
    $scope.auditChanged = function(optAudiet){
    	$scope.getRdcs();
    }

    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    
    $scope.selected = [];
    $scope.toggle = function (rdc, list) {
		  var idx = list.indexOf(rdc);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(rdc);
		  }
    };
    $scope.exists = function (rdc, list) {
    	return list.indexOf(rdc) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.rdcs.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.rdcs.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.rdcs.slice(0);
        }
    };


    $scope.goRdcMap = function () {
        $state.go('coldStorageMap', {});
    }

    $scope.goSearch = function () {
        $scope.getRdcs();
    }


    $scope.goEditRdc = function (rdcID) {
        $state.go('coldStorageEdit', {"rdcID": rdcID});
    }
    
    $scope.deleteRdc = function(rdcID){
    	$http({
    		method:'DELETE',
    		url:'/i/rdc/deleteByRdcID',
    		params:{
    			'rdcID':rdcID
    		}
    	}).success(resDelRdc);
    }
    
    $scope.deleteRdcs = function(){
    	var rdcIDs = $scope.getrdcIDsFromSelected();
    	if(rdcIDs.length >0 ){
    		$http({
    			method:'DELETE',
    			url:'/i/rdc/deleteByRdcIDs',
    			params:{
    				'rdcIDs': rdcIDs
    			}
    		}).success(resDelRdc);
    	}
    }
    
    $scope.getrdcIDsFromSelected = function(audit){
    	var rdcIDs = [];
    	for(i in $scope.selected){
    		if(audit != undefined)
    			$scope.selected[i].audit = audit;
    		rdcIDs.push($scope.selected[i].id);
    	}
    	return rdcIDs;
    }
    
    function resDelRdc(data){
    	if(data.status == 0){
			alert("删除成功");
			location.reload();
		}
    }
    
    $scope.getAudit = function(i){
    	if(i==0)
    		return '待审核';
    	else if(i>0){
    		return '通过';
    	}else{
    		return '未通过';
    	}
    }
    
    $scope.changeAudit = function(rdc){
    	var r=confirm("通过审核？");
    	rdc.audit = r?1:-1;
    	$http({
    		'method':'POST',	
    		'url':'/i/rdc/changeAudit',
    		'params':{
    			'rdcID':rdc.id,
    			'audit':rdc.audit
    		}
    	})
    }
    $scope.changeAudits = function(){
    	var r=confirm("通过审核？");
    	var audit = r?1:-1
    	var rdcIDs = $scope.getrdcIDsFromSelected(audit);
    	if(rdcIDs.length >0 ){
    		$http({
    			method:'POST',
    			url:'/i/rdc/changeAudits',
    			params:{
    				'rdcIDs': rdcIDs,
    				'audit':audit
    			}
    		});
    	}
    }
    
    $scope.goAddRdc = function () {
        $http.get('/i/user/findUser').success(function(data){
            $rootScope.user = data;
            if($rootScope.user == null || $rootScope.user.id == 0){
                url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd";
                window.location.href = url;
            } else {
                $location.path("/coldStorageAdd");
            }
        })
    }
});