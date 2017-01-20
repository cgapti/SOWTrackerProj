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
		var owner 		= 	$("#form_owner option:selected").val();
		var engmntModel = 	$("#form_engmntModel option:selected").val();
		var contractCurrency = 	$("#form_contractCurrency option:selected").val();
		var sowStatus 	= 	$("#form_sowStatus option:selected").val();
		var location 	= 	$("#form_location option:selected").val();
		var businessArea = $("#form_businessArea option:selected").val();
		
		var curSowValueUSD = $("#form_sowValueUSD").val();		
		var curSowValueSGD = $("#form_sowValueSgd").val();
		var curSowValueMYR = $("#form_sowValueMyr").val();
		var curSowValueINR = $("#form_sowValueInr").val();
		
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
			alert('Please select the contract Currency');
            $("#form_contractCurrency").focus();
            return false;
		}
		else if(contractCurrency && !$("#form_sowValueUSD").val() && $('#form_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency USD');
			$("#form_sowValueUSD").focus();
            return false;       
		}	
		else if(contractCurrency && !$("#form_sowValueSgd").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency SGD');
			$("#form_sowValueSgd").focus();
            return false;       
		}
		else if(contractCurrency && !$("#form_sowValueMyr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency MYR');
			$("#form_sowValueMyr").focus();
            return false;       
		}else if(contractCurrency && !$("#form_sowValueInr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]')){		
			alert('Please select the Currency INR');
			$("#form_sowValueInr").focus();
            return false;       
		}
		
		else if($("#form_sowStartDate").val() == "" ){
         	alert('Please select the Start Date.');   
         	$('#form_sowStartDate').focus();
         	return false; 
         }
		else if($("#form_sowEndDate").val() == "" ){
         	alert('Please select the End Date.');   
         	$('#form_sowEndDate').focus();
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
		
		if($("#formModel_engmntModel option:selected").val() == "T and M"){
			$('#resCountM').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");
		}
		
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
		
		
		var ownerM 				= $("#formModel_owner option:selected").val();
		var engmntModelM 		= $("#formModel_engmntModel option:selected").val();
		var contractCurrencyM	= $("#formModel_contractCurrency option:selected").val();
		var sowStatusM 			= $("#formModel_sowStatus option:selected").val();
		var locationM 			= $("#formModel_location option:selected").val();
		var businessAreaM 		= $("#formModel_businessArea option:selected").val();
		
		var curSowValueUSDM = $("#formModel_sowValueUSD").val();		
		var curSowValueSGDM = $("#formModel_sowValueSgd").val();
		var curSowValueMYRM = $("#formModel_sowValueMyr").val();
		var curSowValueINRM = $("#formModel_sowValueInr").val();
		
		var str = $("#formModel_sowStartDate").val();
        var end = $("#formModel_sowEndDate").val();
        var year = str.substring(0,4);
        var month = str.substring(5,7);
        var date = str.substring(8,10);
        var endYear = end.substring(0,4);
        var endMonth = end.substring(5,7);
        var endDate = end.substring(8,10);
        var startDate = new Date(year, month-1, date);
        var endDate = new Date(endYear, endMonth-1, endDate);
		
		if(!$("#formModel_sowNo").val()) {             
             alert('Please fill the SOW Reference No');
             $("#formModel_sowNo").focus();
             return false;
         }				
		else if(ownerM == ""){
			alert('Please Select Owner');    
			$('#formModel_owner').focus();
			return false;        	               
         }

		else if(engmntModelM == ""){
        	 alert('Please Select Engament Model');    
        	 $('#formModel_engmntModel').focus();        	 
             return false;
        }		
		else if($("#requiredFirstM").length > 0 && $("#formModel_resCount").val() == ""){			
				 alert('Please fill the Resource Count');
	             $("#formModel_resCount").focus();
	             return false;
         }
		
		else if(!$("#formModel_projectDtls").val()) {
             alert('Please fill the Project Details');
             $("#formModel_projectDtls").focus();
             return false;
         }       
		else if(contractCurrencyM == ""){
			alert('Please select the contract Currency');
            $("#formModel_contractCurrency").focus();
            return false;
		}
		/*else if(contractCurrency && !$("#form_sowValueUSD").val() && $('#form_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency USD');
			$("#formModel_sowValueUSD").focus();
            return false;       
		}	
		else if(contractCurrency && !$("#form_sowValueSgd").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency SGD');
			$("#formModel_sowValueSgd").focus();
            return false;       
		}
		else if(contractCurrency && !$("#form_sowValueMyr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency MYR');
			$("#formModel_sowValueMyr").focus();
            return false;       
		}else if(contractCurrency && !$("#form_sowValueInr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]')){		
			alert('Please select the Currency INR');
			$("#formModel_sowValueInr").focus();
            return false;       
		}*/
		
		else if($("#formModel_sowStartDate").val() == "" ){
         	alert('Please select the Start Date.');   
         	$('#formModel_sowStartDate').focus();
         	return false; 
         }
		else if($("#formModel_sowEndDate").val() == "" ){
         	alert('Please select the End Date.');   
         	$('#formModel_sowEndDate').focus();
         	return false; 
         }
		
		// date
		else if(!$("#formModel_sowStartDate").val() == "" && $("#formModel_sowEndDate").val() < $("#formModel_sowStartDate").val()){
         	alert('End Date must be greater than or equal to  Start Date.');   
         	$('#formModel_sowEndDate').focus();
         	return false; 
         }     
         //date end         
		else if(sowStatusM == ""){
        	 alert('Please Select Sow Status');    
        	 $('#formModel_sowStatus').focus();        	 
             return false;
         }         
		else if(locationM == ""){
        	 alert('Please Select Location');    
        	 $('#formModel_location').focus();        	 
             return false;
         }
		else if(businessAreaM == ""){
        	 alert('Please Select Business Area');    
        	 $('#formModel_businessArea').focus();        	 
             return false;
         }  
		
		$http.post("http://10.30.54.160:8082/sow/addSOW/", angular.toJson(formModalData))	    
		.then(function(response) {
			$scope.sowDetails = response.data;
			//$scope.readRecords();			
 		});	
		$window.location.reload();
	   $("#update_user_modal").modal("hide");	   
	};
	//Save a record start
	
	
	$('#formModel_engmntModel').on('change', function() {		
		if($(this).val() == 'T and M'){
			 $('#resCountM').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");			 
			 if($("#requiredFirstM").length){				
					 alert('Please fill the Resource Count');
		             $("#formModel_resCount").focus();
		             return false;
	         }    			 
		}else{
			$('#resCountM').html("Resource Count");
			$("#formModel_resCount").val("");
		}        	
     });
	
	
	
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
					//$("#curSowValueUSD").html("SOW Value USD<span style='color:red;font-size:10px' id='curSowValueUSD'> *</span>");
				}else if(val == "SGD"){					
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
					if(curSowValueSGD){
						//$("#curSowValueSGD").html("SOW Value SGD<span style='color:red;font-size:10px' id='curSowValueSGD'> *</span>");
					}
				}else if(val == "MYR"){
					//$("#curSowValueMyr").html("SOW Value MYR<span style='color:red;font-size:10px' id='curSowValueMyr'> *</span>");
					$scope.valDisabledUSD = true;
					$scope.valDisabledMYR = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledINR = true;	
					if(curSowValueMYR){
						//$("#curSowValueMYR").html("SOW Value MYR<span style='color:red;font-size:10px' id='curSowValueMYR'> *</span>");
					}
				}else if(val == "INR"){
					//$("#curSowValueInr").html("SOW Value INR<span style='color:red;font-size:10px' id='curSowValueInr'> *</span>");
					$scope.valDisabledUSD = true;
					$scope.valDisabledINR = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledSGD = true;
					if(curSowValueINR){
						//$("#curSowValueINR").html("SOW Value INR<span style='color:red;font-size:10px' id='curSowValueINR'> *</span>");
					}
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