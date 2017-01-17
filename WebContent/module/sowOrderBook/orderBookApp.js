//JQUERY
/*prolonged active link*/
var items = $("a");
items.on("click", function() {
	items.removeClass("active");
	$(this).toggleClass("active");
});

/* div enable */
function divEnable() {
	$("#banner").show();
}
/*div disable */
function divDisable() {
	$("#banner").hide();
}

var totalMonth;
var monthNames = [ "January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December" ];
var sowStartDate;
var sowEnddate;
var usdCurrencyvalue;

/**
 * function to calculate the cumulative Value
 * 
 * @param loopParam
 */
function calculateCumulativeValue(loopParam) {
	var total = 0;
	var sum = 0;
	var noOfDays;
	document.getElementById('cumulativeCost').value = 0;
	for (i = 0; i <= loopParam - 1; i++) {
		if (document.getElementById('Days' + i).value) {
			noOfDays = document.getElementById('Days' + i).value;
		} else {
			noOfDays = 19;
		}
		if (document.getElementById('Cost' + i).value != null
				&& document.getElementById('Resources' + i).value != null) {
			sum = (document.getElementById('Cost' + i).value
					* document.getElementById('Resources' + i).value * noOfDays * usdCurrencyvalue);
		}
		total = sum + total;
		document.getElementById('cumulativeCost').value = total;
	}
}

/**
 * function to check button disability and validations
 * 
 * @param loopParam
 */
function validateFieldsButtonToggle(loopParam) {
	var checked = false;
	for (i = 0; i <= loopParam - 1; i++) {
		if (!(document.getElementById('Resources' + i).value
				&& document.getElementById('Cost' + i).value
				&& document.getElementById('mySelect').value != 0 && document
				.getElementById('month').value != 0)) {
			checked = true;
			break;
		}
	}
	if (checked) {
		document.getElementById("submit").disabled = true;
	} else {
		document.getElementById("submit").disabled = false;
	}
}

/**
 * Function to enter alphabets only
 * 
 * @param evt
 * @returns {Boolean}
 */
function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (((charCode < 48 && charCode != 8) || charCode > 57))
		return false;

	return true;
}

//Angular
var app = angular.module('orderBookApp', []);

app
.controller(
		'MainCtrl',
		function($scope, $http) {
			$http.defaults.headers.common['Accept'] = "application/json";
			$http.defaults.headers.common['Content-Type'] = "application/json";
			$scope.field = {};

			$scope.choices = [ {
				id : 'choice1'
			} ];

			$scope.addNewChoice = function() {
				var newItemNo = $scope.choices.length + 1;
				$scope.choices.push({
					'id' : 'choice' + newItemNo
				});
			};

			$scope.removeChoice = function() {
				calculateCumulativeValue($scope.choices.length - 1);
				validateFieldsButtonToggle($scope.choices.length - 1);
				var lastItem = $scope.choices.length - 1;
				$scope.choices.splice(lastItem);
			};

			$scope.myFunction = function(item) {
				calculateCumulativeValue($scope.choices.length);
				for (i = 0; i <= $scope.choices.length - 1; i++) {
					if (item == 'cost'
							&& !document.getElementById('Cost' + i).value) {
						$("#costDiv" + i).addClass(
						'has-error has-danger');
					} else if (item == 'cost') {
						$("#costDiv" + i).removeClass(
						'has-error has-danger');
					}
					if (item == 'resource'
						&& !document
						.getElementById('Resources' + i).value) {
						$("#resourceDiv" + i).addClass(
						'has-error has-danger');
					} else if (item == 'resource') {
						$("#resourceDiv" + i).removeClass(
						'has-error has-danger');
					}
				}
				validateFieldsButtonToggle($scope.choices.length);
			};

		// view all records
			$scope.readOrderBook = function() {
				$("#banner").hide();
				$http
				.get(
						"http://10.30.54.161:8086/sow/fetchOrderBook")
						.then(
								function(response) {
									$scope.orderBookResponse = response.data;
									// var input=response.data;									

									// try 1
									var result = [];
									var input = [];
									angular.forEach(
											$scope.orderBookResponse,
											function(value, key) {
												this.push(value);
											}, input);
									
									cmp = function(x, y) {
										return x > y ? 1 : x < y ? -1
												: 0;
									};

									input
									.sort(function(a, b) {
										return cmp(
												[
												 cmp(
														 a.sowNo,
														 b.sowNo),
														 cmp(
																 -a.finYr,
																 -b.finYr) ],
																 [
																  cmp(
																		  b.sowNo,
																		  a.sowNo),
																		  cmp(
																				  -b.finYr,
																				  -a.finYr) ]);
									});

									

									// sort sowNo ascending then Year
									// descending

									var output = input
									.reduce(
											function(result,
													cur) {
												var ref = result
												.find(function(
														row) {
													return row.sowNo === cur.sowNo
													&& row.location === cur.location
													&& row.finYr === cur.finYr
												});
												if (ref) {
													ref["prjTotal"
													    + cur.month] = cur.prjTotal;
												} else {
													var newRow = {
															"sowNo" : cur.sowNo,
															"location" : cur.location,
															"owner" : cur.owner,
															"pId" : cur.pId,
															"contractNo" : cur.contractNo,
															"poNo" : cur.poNo,
															"projectDtls" : cur.projectDtls,
															"techMPrjDesc" : cur.techMPrjDesc,
															"engmntModel" : cur.engmntModel,
															"contractType" : cur.contractType,
															"sowStatus" : cur.sowStatus,
															"sowStartDate" : cur.sowStartDate,
															"sowEndDate" : cur.sowEndDate,
															"sowValuetoUSD" : cur.sowValuetoUSD,
															"finYr" : cur.finYr
													};
													newRow["prjTotal"
													       + cur.month] = cur.prjTotal;
													result
													.push(newRow);
													newRow["invoiceTotalAmt"
													       + cur.month] = cur.invoiceTotalAmt;
													result
													.push(newRow);
												}
												return result;
											}, [])
											$scope.orderBookDetails = output;
									output = angular.toJson(output);
									// $scope.orderBookDetails = output;
								});
			};

			$scope.getOrderBookDetails = function(sowId, firstdate,
					secondDate, currencyValue) {
				var firstDate = new Date(firstdate);
				var secondDate = new Date(secondDate);
				sowStartDate = firstDate;
				sowEndDate = secondDate;
				usdCurrencyvalue = currencyValue;
				document.getElementById('form_sowNo').value = sowId;
				if (firstdate == null || secondDate == null) {
					document.getElementById('sowReferenceNo').innerHTML = "<font size='2' color='red'><b>Please Update Sow Start Date and Sow End Date </b>!</font>";
				} else {
					document.getElementById("mySelect").innerHTML = "";
					var x = document.getElementById("mySelect");
					var option = document.createElement("option");
					option.text = '--Select--';
					option.value = 0;
					x.add(option);
					for (i = firstDate.getFullYear(); i <= secondDate
					.getFullYear(); i++) {
						option = document.createElement("option");
						option.text = i;
						option.value = i;
						x.add(option);
					}
				}

			};

			$scope.updateOrderBookDetails = function() {
				// get values
				var sowNo = $("#form_sowNo").val();
				var cum = $("#cumulativeCost").val();
				var formData = {
						"sowNo" : sowNo,
						"finYr" : document.getElementById('mySelect').value,
						"month" : document.getElementById('month').value,
						"prjTotal" : cum
				}

				$.ajax({
					url : 'http://10.30.54.161:8086/sow/addOrderBook',
					contentType : "application/json",
					type : 'POST',
					dataType : 'text',
					data : angular.toJson(formData)
				}).done(function(response) {
					alert("Record added successfully");
				});

			};

			$scope.populateMonth = function() {
				var firstDate = sowStartDate;
				var secondDate = sowEndDate;

				var e = document.getElementById('mySelect');
				var value = e.options[e.selectedIndex].value;

				document.getElementById("month").innerHTML = "";
				if (firstDate.getFullYear() == secondDate.getFullYear()) {
					for (i = firstDate.getMonth(); i <= secondDate
					.getMonth(); i++) {
						var z = document.getElementById("month");
						var option = document.createElement("option");
						option.text = monthNames[i];
						option.value = i + 1;
						z.add(option);
					}
				} else if (firstDate.getFullYear() == value) {
					for (i = firstDate.getMonth() + 1; i <= 12; i++) {
						var y = document.getElementById("month");
						var option = document.createElement("option");
						option.text = monthNames[i - 1];
						option.value = i;
						y.add(option);
					}
				} else if (secondDate.getFullYear() == value) {
					for (i = 1; i <= secondDate.getMonth() + 1; i++) {
						var y = document.getElementById("month");
						var option = document.createElement("option");
						option.text = monthNames[i - 1];
						option.value = i;
						y.add(option);
					}
				} else if (firstDate.getFullYear() != value
						&& value != 0) {
					for (i = 1; i <= 12; i++) {
						var x = document.getElementById("month");
						var option = document.createElement("option");
						option.text = monthNames[i - 1];
						option.value = i;
						x.add(option);
					}
				}

				for (i = 0; i <= $scope.choices.length - 1; i++) {
					if (document.getElementById('mySelect').value == 0) {
						$("#yearDiv").addClass('has-error has-danger');
					} else {
						$("#yearDiv").removeClass(
						'has-error has-danger');
					}
				}

				validateFieldsButtonToggle($scope.choices.length);
			}

		});
