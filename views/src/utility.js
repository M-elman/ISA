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
    if(isNaN(Date.parse(document.getElementById("birthdate").value))==true) {
        document.getElementById("birthdate").setCustomValidity("Please input a date");
    }
    else{
        var birthday= new Date(document.getElementById("birthdate").value);
        if(birthday < new Date("01/01/1900") || birthday > new Date() ){
        document.getElementById("birthdate").setCustomValidity("Please select a valid date, between 01/01/1900 and today");
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
    var man;
    if(document.getElementById("gender").value==="M") man=true;
    else man=false;
    
    var personCF = new CodiceFiscale({
    name: document.getElementById("name").value,
    lastname: document.getElementById("surname").value,
    day: new Date(document.getElementById("birthdate").value).getDay(),
    month: new Date(document.getElementById("birthdate").value).getMonth() + 1,
    year: new Date(document.getElementById("birthdate").value).getFullYear(),
    isMale: man,
    communeName: document.getElementById("birthTown").value
});
   // console.log(personCF.taxCode())
    
}