/* Change History

v1.8    14 March 2024   - make Last name as optional

*/

$(function(){
    $('#register').click(function(e){

      // Prevent the form from submitting
      e.preventDefault();	 

        /* For radio button
        function getGender() {
            var genderInput = document.querySelector('input[name="gender"]:checked');
            return genderInput ? genderInput.value : null;
        }
        */


        function getGender() {
            var selectedGender = document.getElementById('f_gender');
            var genderInput = selectedGender.value;

            return genderInput;
        }

        
        function isValidEmail(email) {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            //var emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailPattern.test(email);
        }


        function getArea() {
            var selectedArea = document.getElementById('f_area');
            var areaInput = selectedArea.value;

            return areaInput;
        }

        //v1.5 starts
        function getRadioValues_Consent() {
            // Get the value of the first group of radio buttons
            /*
            var radioValue1 = document.querySelector('input[name="flexRadioDefault"]:checked').value;            
            return radioValue1;
            */
            var radioValue1 = document.querySelector('input[name="flexRadioDefault"]:checked');
            return radioValue1 ? radioValue1.value : '';
        }

        function getRadioValues_ReceiveInfo() {
            // Get the value of the second group of radio buttons
            /*
            var radioValue2 = document.querySelector('input[name="flexRadioDefault1"]:checked').value;    
            return radioValue2;
            */
            var radioValue2 = document.querySelector('input[name="flexRadioDefault1"]:checked');
            return radioValue2 ? radioValue2.value : '';
        }
        //v1.5 ends

        var l_f_firstname 	    =   $('#f_firstname').val();
        var l_f_lastname	    =   $('#f_lastname').val();
        var l_f_gender          =   getGender();
        var l_f_email 		    =   $('#f_email').val();
        var l_f_affiliatedOrg   =   $('#f_affiliated_organization').val();
        var l_f_researchInt     =   $('#f_research_interest').val();
        var l_f_area            =   getArea();
        var l_radio_group       =   getRadioValues_Consent(); //v1.5
        var l_radio_group_1     =   getRadioValues_ReceiveInfo(); //v1.5


        var valid  =   this.form.checkValidity();
        
    
        if (!l_f_firstname || !l_f_gender || 
            !l_f_email || !l_f_affiliatedOrg || !l_f_researchInt || 
            !l_f_area || l_radio_group === '' || l_radio_group_1 === '') //v1.5 //v1.8
        {
              Swal.fire({
                  'title': 'Error',
                  'text': 'Please fill out the form before submitting.',
                  'type': 'error',
                  'confirmButtonColor': 'navy'
              });

              return; //v1.5 - Stop the function from continuing
        } 
        else if(valid)
        {     /* temporary disable as no need password for now
              if (/\s/.test(l_password)) {
                  Swal.fire({
                      'title': 'Error',
                      'text': 'Password should not contain spaces. Please remove them.',
                      'type': 'error',
                      'confirmButtonColor': 'green'
                  });

                  return; // Stop the function from continuing
              }
              else */
              if (!isValidEmail(l_f_email)) {
                  Swal.fire({
                      'title': 'Error',
                      'text': 'Please provide a valid email address.',
                      'type': 'error',
                      'confirmButtonColor': 'navy'
                  });

                  return; // Stop the function from continuing
              }
              else {

                  $.ajax({
                      type: 'POST',
                      url: 'c_assets/php/connect.php',
                      data: {
                                f_firstname: l_f_firstname, 
                                f_lastname: l_f_lastname, 
                                f_gender: l_f_gender, 
                                f_email: l_f_email, 
                                f_affiliated_organization: l_f_affiliatedOrg, 
                                f_research_interest: l_f_researchInt, 
                                f_area: l_f_area, 
                                flexRadioDefault: l_radio_group, 
                                flexRadioDefault1: l_radio_group_1 
                            },
                      success: function(data){
                      Swal.fire({
                                  'title': 'Thank you very much.',
                                  'text': data,
                                  'type': 'success',
                                  'confirmButtonColor': 'navy'
                                  });

                      // Resetting the form fields
                      //$('#f_firstname, #f_lastname, #f_gender, #f_email, #f_affiliated_organization, #f_research_interest, #f_area').val(''); //v1.5
                      // this is for radio button $('input[name="gender"]').prop('checked', false);

                      //v1.5 starts
                      $('#regForm')[0].reset();

                     // Unchecking all radio buttons
                      var radioButtons1 = document.querySelectorAll('input[name="flexRadioDefault"]');
                      for(var i = 0; i < radioButtons1.length; i++) {
                          radioButtons1[i].checked = false;
                      }

                      var radioButtons2 = document.querySelectorAll('input[name="flexRadioDefault1"]');
                      for(var i = 0; i < radioButtons2.length; i++) {
                          radioButtons2[i].checked = false;
                      }

                      //v1.5 ends
                        
                      },
                      error: function(data){
                          Swal.fire({
                                  'title': 'Errors',
                                  'text': 'There were errors while saving the data.',
                                  'type': 'error',
                                  'confirmButtonColor': 'red'
                                  });
                      }
                  });
              } //else

        } //else if
        else
        {
              Swal.fire({
                  'title': 'Error',
                  'text': 'Invalid.',
                  'type': 'error',
                  'confirmButtonColor': 'red'
              });
        } //else
    });		  
});

