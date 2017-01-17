var app = angular.module('sowRecordApp', []);

app.controller('myCtrl', function($scope, $http, $window) {
	$http.defaults.headers.common['Accept'] = "application/json";
	$http.defaults.headers.common['Content-Type'] = "application/json";	

	//view all records start
	$scope.readRecords = function(){
		$("#banner").hide();
		$http.get("http://10.30.54.160:8082/sow/fetchAllSOW")		
	    .then(function(response) {
	        $scope.sowDetails = response.data;
	    });
		$("#update_user_modal").modal("hide");
		
	};	
	//view all records end	
	
	//SOW Number Populate page load
	$scope.sowNoPopulate = function(){
   	 	$http.get("http://10.30.54.160:8082/sow/fetchSOWRefNo")		
		.then(function(response) {
			$scope.formData = response.data;
			$scope.formData.sowNo = $scope.formData[0].sowNo;
 		});
    }
	//SOW Number Populate page load end
	
	$scope.cancelRecord = function(formData){		
		//$window.location.reload();
	}	
	
	//insert new records
	$scope.addRecord = function(formData) {		
		//$scope.formData = {};	
		var owner 		= 	$("#form_owner option:selected").val();
		var owner 		= 	$("#form_owner option:selected").val();
		var engmntModel = 	$("#form_engmntModel option:selected").val();
		var contractCurrency = 	$("#form_contractCurrency option:selected").val();
		var sowStatus 	= 	$("#form_sowStatus option:selected").val();
		var location 	= 	$("#form_location option:selected").val();
		var businessArea = $("#form_businessArea option:selected").val();
		
		var str = $("#form_sowStartDate").val();
        var end = $("#form_sowEndDate").val();
        var year = str.substring(0,4);
        var month = str.substring(5,7);
        var date = str.substring(8,10);
        var endYear = end.substring(0,4);
        var endMonth = end.substring(5,7);
        var endDate = end.substring(8,10);
        var startDate = new Date(year, month-1, date);
        var endDate = new Date(endYear, endMonth-1, endDate);
		
		if(!$("#form_sowNo").val()) {             
             alert('Please fill the SOW Reference No');
             $("#form_sowNo").focus();
             return false;
         }				
		else if(owner == ""){
			alert('Please Select Owner');    
			$('#form_owner').focus();
			return false;        	               
         }

		else if(engmntModel == ""){
        	 alert('Please Select Engament Model');    
        	 $('#form_engmntModel').focus();        	 
             return false;
         }
		
		else if($("#requiredFirst").length > 0 && $("#form_resCount").val() == ""){			
				 alert('Please fill the Resource Count');
	             $("#form_resCount").focus();
	             return false;
         }
		
		else if(!$("#form_projectDtls").val()) {
             alert('Please fill the Project Details');
             $("#form_projectDtls").focus();
             return false;
         }         
		else if(contractCurrency == ""){
        	 alert('Please Select Contract Currency');    
        	 $('#form_contractCurrency').focus();        	 
             return false;
         }
		// date
		else if(!$("#form_sowStartDate").val() == "" && $("#form_sowEndDate").val() < $("#form_sowStartDate").val()){
         	alert('End Date must be greater than or equal to  Start Date.');   
         	$('#form_sowEndDate').focus();
         	return false; 
         }     
         //date end         
		else if(sowStatus == ""){
        	 alert('Please Select Sow Status');    
        	 $('#form_sowStatus').focus();        	 
             return false;
         }         
		else if(location == ""){
        	 alert('Please Select Location');    
        	 $('#form_location').focus();        	 
             return false;
         }
		else if(businessArea == ""){
        	 alert('Please Select Business Area');    
        	 $('#form_businessArea').focus();        	 
             return false;
         }   
         else{        	 
         $http.post("http://10.30.54.160:8082/sow/addSOW", angular.toJson(formData))		
		.then(function(response) {
			$scope.sowDetails = response.data;
			$scope.readRecords();
			alert("Record Added Successfully")
 		});
         //$window.location.reload();
         $("#add_new_record_modal").modal("hide");			
        }
	}
		
	$('#form_engmntModel').on('change', function() {		
		if($(this).val() == 'T and M'){
			 $('#resCount').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirst'> *</span>");			 
			 if($("#requiredFirst").length){				
					 alert('Please fill the Resource Count');
		             $("#form_resCount").focus();
		             return false;
				
	        	 
	         }
    			 
		}else{
			$('#resCount').html("Resource Count");
			$("#form_resCount").val("");
		}        	
     });	
		
	//Update a record start
	$scope.GetUserDetails = function(id){
		$http.get("http://10.30.54.160:8082/sow/fetchSOW?data="+id)	
		.then(function(response){				
			$scope.formModalData = response.data[0];
			//$scope.formModalData.valueMillion = $scope.formModalData.sowValue/1000000;
		})
		// Open modal popup
		$("#update_user_modal").modal("show"); 	
	};
	//Update a record end
	
	//Save a record start
	$scope.saveUserDetails = function(formModalData){		
		$http.post("http://10.30.54.160:8082/sow/addSOW/", angular.toJson(formModalData))	    
		.then(function(response) {
			$scope.sowDetails = response.data;
			//$scope.readRecords();
			
 		});	
		$window.location.reload();
	   $("#update_user_modal").modal("hide");	   
	};
	//Save a record start
	
	//convert currency value start
	
	$scope.valDisabledUSD = true;
	$scope.valDisabledSGD = true;
	$scope.valDisabledMYR = true;
	$scope.valDisabledINR = true;
	
	$scope.updateCurVal = function(val){		
		 if ($('#add_new_record_modal:visible').length) {
			 	$scope.formData.sowValueUSD = '';
				$scope.formData.valueMillion = '';
				$scope.formData.sowValueSgd = '';
				$scope.formData.sowValueMyr = '';
				$scope.formData.sowValueInr = '';
				if(val == ""){
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = true;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "USD"){
					$scope.valDisabledUSD = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "SGD"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "MYR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledMYR = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledINR = true;			
				}else if(val == "INR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledINR = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledSGD = true;
				};		
		 }else if($('#update_user_modal:visible').length){
			 	$scope.formModalData.sowValueUSD = '';
				$scope.formModalData.valueMillion = '';
				$scope.formModalData.sowValueSgd = '';
				$scope.formModalData.sowValueMyr = '';
				$scope.formModalData.sowValueInr = '';
				if(val == ""){
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = true;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "USD"){
					$scope.valDisabledUSD = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "SGD"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
				}else if(val == "MYR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledMYR = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledINR = true;			
				}else if(val == "INR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledINR = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledSGD = true;
				};		
		 }
	};			
	$scope.onCurConversion = function(cuType, cuVal){
		if ($('#add_new_record_modal:visible').length) {
			$http.get("http://10.30.54.160:8082/sow/currCal?curtype="+cuType+"&"+"curvalue="+cuVal)	
			.then(function(response){
				$scope.formData.sowValueUSD = response.data;	
				if($scope.formData.sowValueUSD){				
					$scope.formData.valueMillion = $scope.formData.sowValueUSD/1000000;				
				}				
			});
		}else if($('#update_user_modal:visible').length){
			$http.get("http://10.30.54.160:8082/sow/currCal?curtype="+cuType+"&"+"curvalue="+cuVal)	
			.then(function(response){
				$scope.formModalData.sowValueUSD = response.data;	
				if($scope.formModalData.sowValueUSD){				
					$scope.formModalData.valueMillion = $scope.formModalData.sowValueUSD/1000000;				
				}				
			});
		}		
	};	
	$scope.changeCurrency = function(cuType,cuVal){
		if ($('#add_new_record_modal:visible').length) {
			if(cuType == "USD"){			
				$scope.formData.valueMillion = $scope.formData.sowValueUSD/1000000;
			}else if(cuType == "SGD"){
				$scope.onCurConversion(cuType,cuVal);			
			}else if(cuType == "MYR"){
				$scope.onCurConversion(cuType,cuVal);
			}else if(cuType == "INR"){
				$scope.onCurConversion(cuType,cuVal);
			}	
		}else if($('#update_user_modal:visible').length){
			if(cuType == "USD"){			
				$scope.formModalData.valueMillion = $scope.formModalData.sowValueUSD/1000000;
			}else if(cuType == "SGD"){
				$scope.onCurConversion(cuType,cuVal);			
			}else if(cuType == "MYR"){
				$scope.onCurConversion(cuType,cuVal);
			}else if(cuType == "INR"){
				$scope.onCurConversion(cuType,cuVal);
			}	
		}
				
	};
	//convert currency value end
	
	function isNumberKey(evt) {
		var charCode = (evt.which) ? evt.which : event.keyCode;
		if (((charCode < 48 && charCode != 8) || charCode > 57))
			return false;

		return true;
	}
	
});