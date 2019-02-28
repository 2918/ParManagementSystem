$(document).ready(function(){
	
	AjaxUtil.utils.sendGetRequest('/parmanagement/par/candidates', populateCandidateInfo, candidateLoadFailure);
	AjaxUtil.utils.sendGetRequest('/parmanagement/par/skills', populateSkillInfo, skillLoadFailure);
	
	
	$('#candidateStatusDiv').hide();
	var table=null;
	
    $("#addNewCandidateBtn").on("click", function(event){
     	$('#candidateModal').modal('show'); 
    });
    
	function populateCandidateInfo(response){
		table = $('#tblCandidates').DataTable(
				{
					autoWidth: false,
										
					columns: [
     						{ data: 'candidateId' },
     						{ data: 'candidateName' },
     						{ data: 'candidatePhoneNumber' },
     						{ data: 'candidateEmail' },
     						{ data: 'candidateActive' },
     						{ data: 'skill.skillName' },
						{
							data:null,
							render: function (data, type, row){
                                return '<button class="btnCandidateDelete btn btn-sm deleteCandidateRow"><img src="static/img/delete.png" alt="Delete"></button>  <button class="btnViewCandidate btn btn-sm editCandidateRow" data-toggle="modal" data-target="#candidateModal" data-candidateid="' + data.candidateId + '"data-candidatename="' + data.candidateName + '"data-candidatephonenumber="' + data.candidatePhoneNumber + '"data-candidateemail="' + data.candidateEmail + '"data-candidateactive="' + data.candidateActive + '"data-skillid="' + data.skill.skillId + '"><img src="static/img/edit.png" alt="Edit"></button>';
							}
						},
						
					],
			        columnDefs: [
			            {
			                "targets": [ 0 ],
			                "visible": false,
			                "searchable": false
			            },
			            {
			                "targets": [ 4 ],
			                "visible": false,
			                "searchable": false
			            },

			        ],
			        rowId: 'candidateId',
			        order: [[0,'desc']]
                }		
		);
		
		table.clear().rows.add(response).draw();
		$("#tblCandidates tbody").on('click', '.btnCandidateDelete', function () {
			var candidate = table.row($(this).closest('tr')).data();
			
		    $('#candidateDeleteConfirmModal').modal({ backdrop: 'static', keyboard: false })
	        .on('click', '#candidate-delete-btn', function(){
				var deleteData={};
				deleteData['candidateId']=candidate.candidateId;
				deleteData['candidateName']=candidate.candidateName;
				deleteData['candidatePhoneNumber']=candidate.candidatePhoneNumber;
				deleteData['candidateEmail']=candidate.candidateEmail;
				deleteData['candidateActive']=candidate.candidateActive;
				AjaxUtil.utils.sendDeleteRequest('/parmanagement/par/candidates/'+candidate.candidateId, candidateDeleteSuccess(deleteData,'deleted','candidateStatusMessage'), candidateDeleteFailure(candidate.candidateName));
				$('#candidateDeleteConfirmModal').modal('hide');
	        });
		    
		});
		
		$("#tblCandidates tbody").on('click', '.btnViewCandidate', function () {
			var candidate = table.row($(this).closest('tr')).data();
			var rowIndex = $(this).closest('tr').index();
		     $("#rowIndex").val(rowIndex);
		});
	}
	
	function candidateLoadFailure(xhr, error){
		if(xhr.status!=404){
			var reponseBody = JSON.parse(xhr.responseText);
			$('#candidateStatusDiv').removeClass("alert alert-success");
			$('#candidateStatusDiv').addClass("alert alert-warning");
			$('#candidateStatusMessage').html(reponseBody['message']);
			$('#candidateStatusDiv').show();
		}else{
			$('#candidateStatusDiv').hide();
		}
	}
	function skillLoadFailure(xhr, error){
		if(xhr.status!=404){
			var reponseBody = JSON.parse(xhr.responseText);
			$('#candidateStatusDiv').removeClass("alert alert-success");
			$('#candidateStatusDiv').addClass("alert alert-warning");
			$('#candidateStatusMessage').html(reponseBody['message']);
			$('#candidateStatusDiv').show();
		}else{
			$('#candidateStatusDiv').hide();
		}
	}
	
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
	
	var candidateDeleteFailure = function(candidateName) {
		return function(xhr, error){
			$('#candidateStatusDiv').removeClass("alert alert-success");
			$('#candidateStatusDiv').addClass("alert alert-danger");
			var reponseBody = JSON.parse(xhr.responseText);
			if (typeof reponseBody['message'] == undefined || reponseBody['message'] == null) {
				$('#candidateStatusMessage').html('Unable to delete '+ candidateName);				
			}
			else{
				
				$('#candidateStatusMessage').html(reponseBody['message']);
			}	
			$('#candidateStatusDiv').show();
			console.log("Error Code :"+ xhr.status);
			console.log(error);
		};
	};
	
	function populateSkillInfo (response){
		
		 $.each(response, function(i, skill) {
	            $('#candidateSkillSelect').append($('<option></option>').text(skill.skillName).attr('value', skill.skillId));
	        });
	};

	var candidateUpdateFailure = function(candidateName) {
		return function(xhr, error){
			$('#candidateModalStatusDiv').removeClass("alert alert-success");
			$('#candidateModalStatusDiv').addClass("alert alert-danger");
			var reponseBody = JSON.parse(xhr.responseText);
			if (typeof reponseBody['message'] == undefined || reponseBody['message'] == null) {
				$('#candidateModalStatusMessage').html('Unable to update '+ candidateName);				
			}
			else{
				$('#candidateModalStatusMessage').html(reponseBody['message']);
			}	
			$('#candidateModalStatusDiv').show();
			console.log("Error Code :"+ xhr.status);
			console.log(error);
		};
	};

	var candidateAddFailure = function(candidateName) {
		return function(xhr, error){
			$('#candidateModalStatusDiv').removeClass("alert alert-success");
			$('#candidateModalStatusDiv').addClass("alert alert-danger");
			var reponseBody = JSON.parse(xhr.responseText);
			if (typeof reponseBody['message'] == undefined || reponseBody['message'] == null) {
				$('#candidateModalStatusMessage').html('Unable to create ' + candidateName);				
			}
			else{
				$('#candidateModalStatusMessage').html(reponseBody['message']);
			}	
			$('#candidateModalStatusDiv').show();
			console.log("Error Code :"+ xhr.status);
			console.log(error);
		};
	};
	
	var candidateDeleteSuccess = function(deleteData,action,divElement) {
		return function(response) {
			table.row('#'+deleteData['candidateId']).remove().draw();
			$('#candidateStatusDiv').removeClass("alert alert-danger");
			$('#candidateStatusDiv').addClass("alert alert-success");
			$('#candidateStatusMessage').html(deleteData['candidateName'] + " has been deleted successfully!!");
			$('#candidateStatusDiv').show();
		};
	};
	
	var candidateUpdateSuccess = function(newData,action,divElement) {
		return function(response) {
			//var rowIndex = $("#rowIndex").val();
			table.row('#'+newData['candidateId']).data(response).draw();
			$('#candidateModalStatusDiv').removeClass("alert alert-danger");
			$('#candidateModalStatusDiv').addClass("alert alert-success");
			$('#candidateModalStatusMessage').html("Candidate has been updated successfully !!");
			$('#candidateModalStatusDiv').show();
		};
	};
	
	var candidateAddSuccess = function() {
		return function(response) {
			/*table.row.add(response).draw( false );*/
			$('#candidateModalStatusDiv').removeClass("alert alert-danger");
			$('#candidateModalStatusDiv').addClass("alert alert-success");
			$('#candidateModalStatusMessage').html("New Candidate has been created successfully!!");
			$('#candidateModalStatusDiv').show();
			
			if(!$.fn.dataTable.isDataTable("#tblCandidates")){
				populateCandidateInfo(response);
			}else{
				table.row.add(response).draw(false);
			}
			
		};
	};
	
	$('#candidateModal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget); // Button that triggered the modal
	  var candidateId = button.data('candidateid');
	  var candidateName =  button.data('candidatename');
	  var candidatePhoneNumber =  button.data('candidatephonenumber');
	  var candidateEmail =  button.data('candidateemail');
	  var candidateActive =  button.data('candidateactive');
	  var skillId =  button.data('skillid');

	  $('#candidateModalStatusDiv').hide();
	  $('#candidateName').val(candidateName);
	  $('#candidatePhoneNumber').val(candidatePhoneNumber);
	  $('#candidateEmail').val(candidateEmail);

	  $("#candidateSkillSelect").val(skillId);
	  

	  /*if ((typeof candidateId == undefined || candidateId == null)) {
		  $('#candidateName').prop('disabled',false);
	  }else{
		  $('#candidateName').prop('disabled',true);
	  }*/

	  
	  $("#candidateModal").off('click', '#saveCandidateButton');
	  
	  jQuery.validator.addMethod("lettersonlys", function(value, element) {
		  return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
		}, "Name field allows alphabets and a space only");
	  
/*	  jQuery.validator.addMethod("userName", function(value, element) {
		  return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
		}, "UserName field allows alphanumeric  only");*/
	  
	  $("#candidateModal").on('click', '#saveCandidateButton', function () {
		  $('#candidateModalStatusDiv').hide();
		  $('#candidateForm').validate({
			    rules : {
			    	candidateName : {  lettersonlys:true,required: true },
		  			candidateEmail : {  email: true,required: true},
		  			candidatePhoneNumber : { required: true }
			    },
			    messages: {
			    	candidateName:{
			    		required:"Candidate Name can not be empty"
			        },
			        candidateEmail:{
		    		required:"Email can not be empty"
		        },
		        candidatePhoneNumber:{
		    		required:"Phone number can not be empty"
		        },
			    },
			    errorElement: PARValidationUtil.utils.validationProperties.errorElement,
			    errorPlacement: PARValidationUtil.utils.validationProperties.errorPlacement,
			    success: PARValidationUtil.utils.validationProperties.success,
			    highlight: PARValidationUtil.utils.validationProperties.highlight,
			    unhighlight: PARValidationUtil.utils.validationProperties.unhighlight
		  });
		  
		  if(!$('#candidateForm').valid())
			  return;
		  if (typeof candidateId == undefined || candidateId == null) {
			  var requestBody={};
			  requestBody["candidateName"]=$('#candidateName').val();
			  requestBody["candidatePhoneNumber"]=$('#candidatePhoneNumber').val();
			  requestBody["candidateEmail"]=$('#candidateEmail').val();

			  requestBody['skill']={};
			  requestBody['skill']['skillId']=$('#candidateSkillSelect').val();

			  AjaxUtil.utils.sendPostRequest('/parmanagement/par/candidates/',candidateAddSuccess(), candidateAddFailure(candidateName),requestBody);			   
		  }
		  else{
			  var requestBody={};
			  requestBody["candidateId"]=candidateId.toString();
			  requestBody["candidateName"]=$('#candidateName').val();
			  requestBody["candidatePhoneNumber"]=$('#candidatePhoneNumber').val();
			  requestBody["candidateEmail"]=$('#candidateEmail').val();
			  requestBody['candidateActive'] = candidateActive;
			  requestBody['skill']={};
			  requestBody['skill']['skillId']=$('#candidateSkillSelect').val();
			  
			  var newData={};
			  newData['candidateId'] = candidateId.toString();
			  newData['candidateName'] = candidateName;
			  newData['candidatePhoneNumber'] = $('#candidatePhoneNumber').val();
			  newData['candidateEmail'] = $('#candidateEmail').val();
			  newData['candidateActive'] = candidateActive;
			  newData['skill']={};
			  newData['skill']['skillId']=$('#candidateSkillSelect').val();
			  
			  newData['skill']['skillName']=$('#candidateSkillSelect :selected').text();

			  newData['candidateActive'] = candidateActive;
			  AjaxUtil.utils.sendPutRequest('/parmanagement/par/candidates/',candidateUpdateSuccess(newData,'updated','candidateModalStatusMessage'), candidateUpdateFailure(candidateName),requestBody);			  
		  }
		});
	});
});