function comparePwds()  {
    if(document.getElementById("password").value!==document.getElementById("confirm_password").value){
        document.getElementById("confirm_password").innerHTML="";
        //document.getElementById("confirm_password").setCustomValidity("Passwords don't match");
        showError("confirm_password_err");
        return false;
    }
};
function checkPwdStrenght()  {
    if(document.getElementById("password").value.length < 8){
        //document.getElementById("password").setCustomValidity("Password has to be at least 8 characters long");
        showError("password_err");
        return false;
    }
};

function checkDate()  {
    var formatRegExp=/\d{4}-\d{2}-\d{2}/; /*slash indica l'inizio e la fine della regexp, \d indica un digit, ripetuto 4 o due volte a seconda del numero indicato fra graffe. Tale espressione regolare controlla solo il formato desiderato della data, mentre la validità della stessa viene controllata dai metodi seguenti*/
    if (formatRegExp.test(document.getElementById("birthdate").value)==false){
        //document.getElementById("birthdate").setCustomValidity("Please use the format yyyy-mm-dd");
        document.getElementById("birthdate_err").innerHTML="<b>Please enter a valid date - </b> You should use the format yyyy-mm-dd";
        showError("birthdate_err");
        document.getElementById("birthdate").value="";
        return false;
    }
    else{
    if(isNaN(Date.parse(document.getElementById("birthdate").value))==true) {
        //document.getElementById("birthdate").setCustomValidity("Please input a valid date");
        document.getElementById("birthdate_err").innerHTML="<b>Please enter a valid date - </b> You should use the format yyyy-mm-dd";
        showError("birthdate_err");
        document.getElementById("birthdate").value="";
        return false;
    }
    else{
        var birthday= new Date(document.getElementById("birthdate").value);
        if(birthday < new Date("1900-01-01") || birthday > new Date() ){
        //document.getElementById("birthdate").setCustomValidity("Please select a date between 1900-01-01 and today");
        document.getElementById("birthdate_err").innerHTML="<b>Please enter a valid date - </b> You should select a date between 1900-01-01 and today";
        showError("birthdate_err");
        document.getElementById("birthdate").value="";
        return false;
    }
    }
    }
};

function checkUsername()  {
var xhttp = new XMLHttpRequest();
    
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 449) {
    //document.getElementById("username").setCustomValidity("This username already exists");
    showError("username_err");
}
};
xhttp.open("POST", "/username", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send(JSON.stringify({username: document.getElementById("username").value}));
};

function checkMail() {
    if (document.getElementById("email").checkValidity()==false) {
        showError("email_err");
    }
}


function checkBirthPlace(blurredElement){
    
    if (blurredElement=="birthTown" && (document.getElementById("birthProvince").value=="" || document.getElementById("birthProvince").value==undefined)){
        return;
    }
  
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 404) {
        var json_res=JSON.parse(this.response)

        if (json_res.bprov_err!=null) {
            //document.getElementById("birthProvince").setCustomValidity(json_res.bprov_err)
            document.getElementById("birthProvince_err").innerHTML="<b>Please enter a valid province - </b> " + json_res.bprov_err;
            showError("birthProvince_err");
        }
        if (json_res.btow_err!=null) {
            //document.getElementById("birthTown").setCustomValidity(json_res.btow_err)
            document.getElementById("birthTown_err").innerHTML="<b>Please enter a valid town - </b> " + json_res.btow_err;
            showError("birthTown_err");
        }
        
    }
    };
    xhttp.open("POST", "/birthplace", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({birthplace_provincia: document.getElementById("birthProvince").value, birthplace: document.getElementById("birthTown").value}));
    

}


function checkTaxCode() {
    
    var generality = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    gender: document.getElementById("gender").value,
    day: new Date(document.getElementById("birthdate").value).getDate(),
    month: new Date(document.getElementById("birthdate").value).getMonth() + 1,
    year: new Date(document.getElementById("birthdate").value).getFullYear(),
    birthplace: document.getElementById("birthTown").value,
    birthplace_provincia: document.getElementById("birthProvince").value.toUpperCase()
};
   if(CodiceFiscale.compute(generality) !== document.getElementById("taxCode").value.toUpperCase()){
        showError("taxCode_err");
        return false;
    }
    
}

function computeTaxCode() {
    resetFieldError("taxCode");
    if (document.getElementById("name").value != null && document.getElementById("name").value !="" &&
       document.getElementById("surname").value != null && document.getElementById("surname").value !="" &&
       document.getElementById("gender").value != null && document.getElementById("gender").value !="" &&
       document.getElementById("birthdate").value != null && document.getElementById("birthdate").value !="" &&
       document.getElementById("birthTown").value != null && document.getElementById("birthTown").value !="" &&
       document.getElementById("birthProvince").value != null && document.getElementById("birthProvince").value !=""){
        
        var generality = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        gender: document.getElementById("gender").value,
        day: new Date(document.getElementById("birthdate").value).getDate(),
        month: new Date(document.getElementById("birthdate").value).getMonth() + 1,
        year: new Date(document.getElementById("birthdate").value).getFullYear(),
        birthplace: document.getElementById("birthTown").value,
        birthplace_provincia: document.getElementById("birthProvince").value.toUpperCase()
        };
        
        document.getElementById("taxCode").value=CodiceFiscale.compute(generality);

    }
    
    
}



function checkRegistration(){
    


    var isUsernameGood = new Promise(
        function(resolve, reject) {
            $.ajax({
                       type: "POST",
                       url: '/username',
                       contentType:'application/json',
                       data: JSON.stringify({username: document.getElementById("username").value})
            })
            .done(function(data, textStatus, xhr){
                //console.log(data); /*prints the message provided by the server*/
                //console.log(textStatus); /*prints "success"*/
                //console.log (xhr); /*prints xhr object*/
                //console.log(xhr.status); /*prints success code (e.g. 200)*/
                resolve(xhr.status);
            })
            .fail(function(textStatus){
                //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
                //console.log(textStatus);  /*prints the Object*/
                reject(textStatus.responseText);
            });
        }
    );

    var isBirthPlaceGood = new Promise(
        function(resolve, reject) {
            $.ajax({
                type: "POST",
                url: '/birthplace',
                contentType:'application/json',
                data: JSON.stringify({birthplace_provincia: document.getElementById("birthProvince").value, birthplace: document.getElementById("birthTown").value}),
            })
            .done(function(data, textStatus, xhr){
                //console.log(data); /*prints the message provided by the server*/
                //console.log(textStatus); /*prints "success"*/
                //console.log (xhr); /*prints xhr object*/
                //console.log(xhr.status); /*prints success code (e.g. 200)*/
                resolve(xhr.status);
            })
            .fail(function(textStatus){
                //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
                //console.log(textStatus);  /*prints the Object*/
                reject("Incorrect birthplace");
            });
        }
    );

        Promise.all([isUsernameGood, isBirthPlaceGood])
        .then(function(fulfill_msg) {

            if(checkPwdStrenght()==false || comparePwds()==false || checkDate()==false || checkTaxCode()==false){
                console.log("There is an error in the form")
            }
            else {
                console.log("Registering user...")
                document.getElementById("reg_form").submit(); 
            }
        })
        .catch(function(error_msg) {
            console.log(error_msg)  
            }
        );

}

//to call whenever a field is focused
function resetFieldError(id){
    //document.getElementById(id).setCustomValidity("");
    var errorLabel=id+"_err";
    document.getElementById(errorLabel).style.visibility="hidden";   
}

//to call in case of error
function showError(id){
    document.getElementById(id).style.visibility="";   
}