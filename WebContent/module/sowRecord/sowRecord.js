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
		$window.location.reload();
	}	
	
	// Code to generate the Excel report on click of 'Generate Excel' Link
	$scope.generateExcel = function() {
		var str="";
		$(':checkbox:checked').each(function(i) {
			str = str + (String($(this).attr('id'))) + ';';
		});
		
		if (str=="") {
			var SearchFieldsTable = $("#sowDetailsGrid thead tr");
			var a = SearchFieldsTable.children();
			for (i=0; i<a.length-1; i++) {
				str = str + (String)(a[i].firstChild.nextSibling.id)+ ';';
			}
		}
		$.ajax({
		    url: "http://10.30.54.169:8084/sow/generateExcel",
		    contentType: "application/json",
		    type: 'POST',
		    dataType: 'text',
		    data: angular.toJson(str)
		}).done(function(response){
		    alert("Excel Report Generated Successfully. You can access the report from the path 10.30.0.101 --> Bitlocker -- > SOW Application -- > SOW Folder");
		});
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
				//$('#curSowValueUSD').html("SOW Value USD <span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");			
			alert('Please select the Currency USD');
			$("#form_sowValueUSD").focus();
            return false;       
		}	
		else if(contractCurrency && !$("#form_sowValueSgd").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){
			//$('#curSowValueSgd').html("SOW Value SGD <span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");
			alert('Please select the Currency SGD');
			$("#form_sowValueSgd").focus();
            return false;       
		}
		else if(contractCurrency && !$("#form_sowValueMyr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]')){		
			//$('#form_sowValueMyr').html("SOW Value MYR <span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");
			alert('Please select the Currency MYR');
			$("#form_sowValueMyr").focus();
            return false;       
		}else if(contractCurrency && !$("#form_sowValueInr").val() && $('#form_sowValueUSD').is('[disabled=disabled]') && $('#form_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]')){
			//$('#form_sowValueInr').html("SOW Value INR <span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");
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
        	 
        	 $.ajax({
     			url : 'http://10.30.54.160:8082/sow/addSOW',
     			contentType : "application/json",
     			type : 'POST',
     			dataType : 'text',
     			data : angular.toJson(formData)
     		}).done(function(response) {
     			alert("Record added successfully");
     			$window.location.reload();
     		});
     	   $("#update_user_modal").modal("hide");	   
     	};
        	 
        	 
         /*$http.post("http://10.30.54.160:8082/sow/addSOW", angular.toJson(formData))		
		.then(function(response) {
			$scope.sowDetails = response.data;
			alert("Record Added Successfully")
			$scope.readRecords();			
 		});
         $window.location.reload();
         $("#add_new_record_modal").modal("hide");	*/		
        }
	
		
	$('#form_engmntModel').on('change', function() {		
		if($(this).val() == 'T and M'){
			 $('#resCount').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirst'> *</span>");			 
			 if($("#requiredFirst").length){				
					 //alert('Please fill the Resource Count');
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
		else if(!$("#formModel_resCount").val()){
			$('#resCountM').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");			 
			 if($("#requiredFirstM").length){				
					 alert('Please fill the Resource Count');
		             $("#formModel_resCount").focus();
		             return false;
	         } 
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
		else if(contractCurrencyM && !$("#formModel_sowValueUSD").val() && $('#formModel_sowValueSgd').is('[disabled=disabled]') && $('#formModel_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]') && $('#formModel_sowValueUSD').is('[disabled=disabled]')){		
			alert('Please select the Currency USD');
			$("#formModel_sowValueUSD").focus();
            return false;       
		}	
		else if(contractCurrencyM && !$("#formModel_sowValueSgd").val() && $('#formModel_sowValueUSD').is('[disabled=disabled]') && $('#formModel_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]') && !$('#formModel_sowValueSgd').is('[disabled=disabled]')){		
			alert('Please select the Currency SGD');
			$("#formModel_sowValueSgd").focus();
            return false;       
		}
		else if(contractCurrencyM && !$("#formModel_sowValueMyr").val() && $('#formModel_sowValueUSD').is('[disabled=disabled]') && $('#formModel_sowValueSgd').is('[disabled=disabled]') && $('#form_sowValueInr').is('[disabled=disabled]') && !$('#formModel_sowValueMyr').is('[disabled=disabled]')){		
			alert('Please select the Currency MYR');
			$("#formModel_sowValueMyr").focus();
            return false;       
		}else if(contractCurrencyM && !$("#formModel_sowValueInr").val() && $('#formModel_sowValueUSD').is('[disabled=disabled]') && $('#formModel_sowValueMyr').is('[disabled=disabled]') && $('#form_sowValueSgd').is('[disabled=disabled]') && !$('#form_sowValueInr').is('[disabled=disabled]')){		
			alert('Please select the Currency INR');
			$("#formModel_sowValueInr").focus();
            return false;       
		}
		
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
		
	
	/*	$http.post("http://10.30.54.160:8082/sow/addSOW/",  angular.toJson(formModalData))	    
		.then(function(response) {
			$scope.sowDetails = response.data;
			alert(1);
			//$scope.readRecords();			
 		},function(err){
 			alert("error " +err);
 		});	*/
		
		
		$.ajax({
			url : 'http://10.30.54.160:8082/sow/addSOW/',
			contentType : "application/json",
			type : 'POST',
			dataType : 'text',
			data : angular.toJson(formModalData)
		}).done(function(response) {
			alert("Record Updated successfully");
			$window.location.reload();
		});
	   $("#update_user_modal").modal("hide");	   
	};
	//Save a record start
	
	
	$('#formModel_engmntModel').on('change', function() {		
		if($(this).val() == 'T and M'){
			 $('#resCountM').html("Resource Count<span style='color:red;font-size:10px' id='requiredFirstM'> *</span>");			 
			 if($("#requiredFirstM").length){				
					 //alert('Please fill the Resource Count');
		             $("#formModel_resCount").focus();
		             $("#formModel_resCount").val("");
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
					$("#curSowValueUSD").html("SOW Value USD<span style='color:red;font-size:10px' id='curSowValueUSD'> *</span>");
					$("#curSowValueSgd").html("SOW Value SGD");
					$("#curSowValueMyr").html("SOW Value MYR");
					$("#curSowValueInr").html("SOW Value INR");
				}else if(val == "SGD"){					
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;					
					$("#curSowValueSgd").html("SOW Value SGD<span style='color:red;font-size:10px' id='curSowValueSg'> *</span>");
					$("#curSowValueUSD").html("SOW Value USD");
					$("#curSowValueMyr").html("SOW Value MYR");
					$("#curSowValueInr").html("SOW Value INR");
				}else if(val == "MYR"){					
					$scope.valDisabledUSD = true;
					$scope.valDisabledMYR = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledINR = true;
					$("#curSowValueMyr").html("SOW Value MYR<span style='color:red;font-size:10px' id='curSowValueMy'> *</span>");
					$("#curSowValueUSD").html("SOW Value USD");
					$("#curSowValueSgd").html("SOW Value SGD");					
					$("#curSowValueInr").html("SOW Value INR");
				}else if(val == "INR"){					
					$scope.valDisabledUSD = true;
					$scope.valDisabledINR = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledSGD = true;
					$("#curSowValueInr").html("SOW Value INR<span style='color:red;font-size:10px' id='curSowValueIn'> *</span>");
					$("#curSowValueUSD").html("SOW Value USD");
					$("#curSowValueSgd").html("SOW Value SGD");	
					$("#curSowValueMyr").html("SOW Value MYR");
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
					$("#curSowValueMUSD").html("SOW Value USD<span style='color:red;font-size:10px' id='curSowValueUSD'> *</span>");
					$("#curSowValueMSgd").html("SOW Value SGD");
					$("#curSowValueMMyr").html("SOW Value MYR");
					$("#curSowValueMInr").html("SOW Value INR");
				}else if(val == "SGD"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledSGD = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledINR = true;
					$("#curSowValueMSgd").html("SOW Value SGD<span style='color:red;font-size:10px' id='curSowValueSg'> *</span>");
					$("#curSowValueMUSD").html("SOW Value USD");
					$("#curSowValueMMyr").html("SOW Value MYR");
					$("#curSowValueMInr").html("SOW Value INR");
				}else if(val == "MYR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledMYR = false;
					$scope.valDisabledSGD = true;
					$scope.valDisabledINR = true;	
					$("#curSowValueMMyr").html("SOW Value MYR<span style='color:red;font-size:10px' id='curSowValueMy'> *</span>");
					$("#curSowValueMUSD").html("SOW Value USD");
					$("#curSowValueMSgd").html("SOW Value SGD");					
					$("#curSowValueMInr").html("SOW Value INR");
				}else if(val == "INR"){
					$scope.valDisabledUSD = true;
					$scope.valDisabledINR = false;
					$scope.valDisabledMYR = true;
					$scope.valDisabledSGD = true;
					$("#curSowValueMInr").html("SOW Value INR<span style='color:red;font-size:10px' id='curSowValueIn'> *</span>");
					$("#curSowValueMUSD").html("SOW Value USD");
					$("#curSowValueMSgd").html("SOW Value SGD");	
					$("#curSowValueMMyr").html("SOW Value MYR");
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
	
	//No Record Background Removed
	$(".noDataWidth").parent('tr').css('background-color', '#fff');	
	
	
	
	
	
	
	//Fetch Invoice Details start
	$scope.GetInvoiceDetails = function(sowNO){		 
		$http.post("http://10.30.54.160:8082/sow/viewInvoice",
				{sowNo:sowNO}, 
				{headers: {'Content-Type': 'application/json'} 
		})	
		.then(function(response){
			$scope.invoiceFormDataHead = response.data.sowInfo;	
			$scope.invoiceFormData = response.data.sowDetailsInfoList;
			$scope.invoiceSowNo = sowNO;
		})
		$("#invoiceModal").modal("show"); 	
	};
	//Fetch Invoice Details End
	
	
	$scope.showFunction = function(){
		var $link = $(this);
	    var $content = $link.parent().prev("div.text-content");
	    var linkText = $link.text();

	    $content.toggleClass("short-text, full-text");
	    $link.text(getShowLinkText(linkText));
	    return false;
	}
	function getShowLinkText(currentText) {
	    var newText = '';
	    if (currentText.toUpperCase() === "SHOW MORE") {
	        newText = "Show less";
	    } else {
	        newText = "Show more";
	    }
	    return newText;
	}
});

	//show less more start
	/*$(".showMore").on("click", function(){
		
	    var $link = $(this);
	    var $content = $link.parent().prev("div.text-content");
	    var linkText = $link.text();

	    $content.toggleClass("short-text, full-text");
	    $link.text(getShowLinkText(linkText));
	    return false;
	});
	function getShowLinkText(currentText) {
	    var newText = '';
	    if (currentText.toUpperCase() === "SHOW MORE") {
	        newText = "Show less";
	    } else {
	        newText = "Show more";
	    }
	    return newText;
	}*/
	// show less more end
