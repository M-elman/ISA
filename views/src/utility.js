function comparePwds()  {
    if(document.getElementById("password").value!==document.getElementById("confirm_password").value){
        document.getElementById("confirm_password").innerHTML="";
        document.getElementById("confirm_password").setCustomValidity("Passwords don't match");
    }
};
function checkPwdStrenght()  {
    if(document.getElementById("password").value.length < 8){
        document.getElementById("password").setCustomValidity("Password has to be at least 8 characters long");
    }
};

function checkDate()  {
    var formatRegExp=/\d{4}-\d{2}-\d{2}/; /*slash indica l'inizio e la fine della regexp, \d indica un digit, ripetuto 4 o due volte a seconda del numero indicato fra graffe. Tale espressione regolare controlla solo il formato desiderato della data, mentre la validità della stessa viene controllata dai metodi seguenti*/
    if (formatRegExp.test(document.getElementById("birthdate").value)==false){
        document.getElementById("birthdate").setCustomValidity("Please use the format yyyy-mm-dd");
        document.getElementById("birthdate").value="";
    }
    else{
    if(isNaN(Date.parse(document.getElementById("birthdate").value))==true) {
        document.getElementById("birthdate").setCustomValidity("Please input a valid date");
        document.getElementById("birthdate").value="";
    }
    else{
        var birthday= new Date(document.getElementById("birthdate").value);
        if(birthday < new Date("1900-01-01") || birthday > new Date() ){
        document.getElementById("birthdate").setCustomValidity("Please select a date between 1900-01-01 and today");
        document.getElementById("birthdate").value="";
    }
    }
    }
};

function checkUsername()  {
var xhttp = new XMLHttpRequest();
    
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 449) {
    document.getElementById("username").setCustomValidity("This username already exists");
  }
};
xhttp.open("POST", "/username", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send(JSON.stringify({username: document.getElementById("username").value}));
};

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
        document.getElementById("taxCode").setCustomValidity("This field was incorrect");
        document.getElementById("taxCode").value="";
    }
    
}

function computeTaxCode() {
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