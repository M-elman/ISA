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

function checkMedRegPrv(prvInputID){
  
    var error_label=prvInputID+"_err"
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 404) {
        var json_res=JSON.parse(this.response)

        if (json_res.medRegPrv_err!=null) {
            document.getElementById(error_label).innerHTML="<b>Please enter a valid province</b> ";
            showError(error_label);
        }
        
    }
    };
    xhttp.open("POST", "/birthprovince", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({medRegPrv: document.getElementById(prvInputID).value}));
    

}

function checkTaxCode() {

        if (checkTaxCodeCorrectness()==true){
            //if tax code is correct we check for the uniqueness of the user within the database
            checkTaxCodeUniqueness();
        }
        
    }

function checkTaxCodeUniqueness() {

    //if tax code is correct we check for the uniqueness of the user within the database
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 449) {
        document.getElementById("taxCode_err").innerHTML="<b>Are you a new user? - </b> It looks like you are already registered on FAHM";
        showError("taxCode_err");
    }
    };
    xhttp.open("POST", "/taxcode", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({taxCode: document.getElementById("taxCode").value.toUpperCase()}));
    
}

function checkTaxCodeCorrectness() {
    
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
        document.getElementById("taxCode_err").innerHTML="<b>Please check your tax code - </b> It doesn't seem to match with the other data you provided"
        showError("taxCode_err");
        return false;
    }
    else {
        return true;
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

function checkMAID() {
    
            if (checkMAIDCorrectness()==true){
                //if id is correct we check for the uniqueness of the user within the database
                checkMAIDUniqueness();
            }
            
        }


function checkMAIDUniqueness() {
    
        //if tax code is correct we check for the uniqueness of the user within the database
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 449) {
            document.getElementById("medRegNum_err").innerHTML="<b>Please check the ID - </b> This one identifies an already registered doctor"
            showError("medRegNum_err");
        }
        };
        xhttp.open("POST", "/maid", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({medRegNum: document.getElementById("medRegNum").value}));
        
    }

    function checkMAIDCorrectness() {
        
        var formatRegExp=/^\d{10}$/; /*slash indica l'inizio e la fine della regexp, \d indica un digit, ripetuto 10 volte*/
        if (formatRegExp.test(document.getElementById("medRegNum").value)==false){
            document.getElementById("medRegNum_err").innerHTML="<b>Please check the ID - </b> It should be a 10 digits number"
            showError("medRegNum_err");
            return false;
        }else {
            return true;
        }
        
    }


function checkRegistration(formID){


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



    var isValid = true;
    var searchString="#" + formID +" input:invalid";
    $(searchString).each(function() {
            isValid = false;
    });
    if (isValid==false) {
        console.log("All fields are required");
        return;
    }


    if (formID==="doc_form"){
        var isMAIdUnique = new Promise(
            function(resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: '/maid',
                    contentType:'application/json',
                    data: JSON.stringify({medRegNum: document.getElementById("medRegNum").value}),
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
                    reject("Existing doctor");
                });
            }
        );

        var isMedRegPrvGood = new Promise(
            function(resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: '/birthprovince',
                    contentType:'application/json',
                    data: JSON.stringify({medRegPrv: document.getElementById("medRegPrv").value}),
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
                    reject("Incorrect membership province");
                });
            }
        );


        var promisesArray=[isUsernameGood, isBirthPlaceGood, isMAIdUnique, isMedRegPrvGood];
        if(checkMAIDCorrectness()==false) {
            console.log("The Medical Association ID is not correct");
            return;
        }

    }else{
        var isTaxCodeUnique = new Promise(
            function(resolve, reject) {
                $.ajax({
                    type: "POST",
                    url: '/taxcode',
                    contentType:'application/json',
                    data: JSON.stringify({taxCode: document.getElementById("taxCode").value.toUpperCase()}),
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
                    reject("Existing user");
                });
            }
        );
        var promisesArray=[isUsernameGood, isBirthPlaceGood, isTaxCodeUnique];
        if(checkTaxCodeCorrectness()==false) {
            console.log("The tax code is not correct");
            return;
        }

    }

        Promise.all(promisesArray)
        .then(function(fulfill_msg) {

            if(checkPwdStrenght()==false || comparePwds()==false || checkDate()==false){
                console.log("There is an error in the form")
            }
            else {
                console.log("Registering user...")
                document.getElementById(formID).submit(); 
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

//create doctor's table
function createTableFromJSON(doctorSurname) {

    $.ajax({
        type: "GET",
        url: '/searchdoctor',
        data: {
            doctorSurname: doctorSurname
        },
    })
    .done(function(data, textStatus, xhr){
        //data contains the doctor array provided by the server*/
       
        // EXTRACT VALUE FOR HTML HEADER. 
        // (id name surname birthdate birthTown birthProvince gender medicalRegisterProvince medicalRegisterNumber medicalSpecialties)
        var col = [];
        col.push('name');
        col.push('surname');
        col.push('birthdate');
        col.push('medicalRegisterProvince');
        
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
    
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    
        var tr = table.insertRow(-1);                   // TABLE ROW.
    
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
    
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.length; i++) {
    
            tr = table.insertRow(-1);
    
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1); //inserisce la cella alla fine della riga
                tabCell.innerHTML = data[i][col[j]];
            }

            var tabCell = tr.insertCell(-1);
            var btn = document.createElement('input');
            btn.type = "button";
            btn.className = "btn";
            btn.value = "Show";
            btn.style="cursor: pointer"
            btn.id = data[tr.rowIndex-1].medicalRegisterNumber;
            //btn.onclick = populateDoctorOutline();
            tabCell.appendChild(btn);
            btn.addEventListener("click", populateDoctorOutline);  
        }
    
        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("search_results");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);



    })
    .fail(function(textStatus){
        //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
        //console.log(textStatus);  /*prints the Object*/
        var divContainer = document.getElementById("search_results");        
        divContainer.innerHTML = textStatus.responseText;
    });



}


function populateDoctorOutline(){

    var doctorID=this.id;
    $.ajax({
        type: "GET",
        url: '/searchdoctor',
        data: {
            doctorID: doctorID
        },
    })
    .done(function(data, textStatus, xhr){
        //data contains the doctor profile provided by the server*/
        if(data["gender"]=="M"){
            document.getElementById("nameSurnameVal").innerHTML="Dott. " + data["name"] + " " + data["surname"];
            
        }else{
            document.getElementById("nameSurnameVal").innerHTML="Dott.ssa " + data["name"] + " " + data["surname"];
        }
        document.getElementById("codeVal").innerHTML="Provincial Medical Association of " + data["medicalRegisterProvince"] + " n." + data["medicalRegisterNumber"];
        document.getElementById("birthdateVal").innerHTML=data["birthdate"];
        document.getElementById("placeVal").innerHTML=data["birthTown"] + " (" + data["birthProvince"] + ")";
        var ul=document.getElementById("specialtiesList");
        while (ul.firstChild) { //empties old elements of the list
            ul.removeChild(ul.firstChild);
        }
        for (var i = 0; i < data["medicalSpecialties"].length; i++){
            var li = document.createElement('li');
            li.setAttribute('class','item');
            li.innerHTML=data["medicalSpecialties"][i];
            ul.appendChild(li);
        }
    
        document.getElementById("docInfo").style.display="";   

    })
    .fail(function(textStatus){
        //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
        //console.log(textStatus);  /*prints the Object*/
    });

    
}

function getUsername(){

    $.ajax({
        type: "GET",
        url: '/getusername',
    })
    .done(function(data, textStatus, xhr){
        //data contains the username*/

            document.getElementById("welcome_label").innerHTML="Welcome " + data + "!";
        

    })
    .fail(function(textStatus){
        //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
        //console.log(textStatus);  /*prints the Object*/
    });


}

function getUserData(){
    
        $.ajax({
            type: "GET",
            url: '/getuserdata',
        })
        .done(function(data, textStatus, xhr){
            //data contains the user data provided by the server*/
                document.getElementById("profileNS").innerHTML=data["name"] + " " + data["surname"];
                document.getElementById("profileTC").innerHTML=data["taxCode"];
                document.getElementById("profileBD").innerHTML=data["birthdate"];
                document.getElementById("profileBP").innerHTML=data["birthTown"] + " (" + data["birthProvince"] + ")";
                document.getElementById("profileMail").innerHTML=data["email"];
        })
        .fail(function(textStatus){
            //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
            //console.log(textStatus);  /*prints the Object*/
        });
    
    
    }

    function loadSpecialties(isUpdating, selectID){
        var myString=document.getElementById("codeVal").innerHTML;
        document.getElementById("doc_id").value=myString.substring(myString.indexOf(".")+1);
        if(isUpdating==true){
            var currentSpecialties = [];
            $('#specialtiesList li').each(function(){
                currentSpecialties.push($(this).text());
            });
        }

        $.ajax({
            type: "GET",
            url: '/specialties',
        })
        .done(function(data, textStatus, xhr){
            //console.log(data); /*prints the message provided by the server*/
            //console.log(textStatus); /*prints "success"*/
            //console.log (xhr); /*prints xhr object*/
            //console.log(xhr.status); /*prints success code (e.g. 200)*/

/*             var $select = $('#specialties');
            $(data).each(function (index, spec) {  
                console.log(index, spec);  
                var $option = $("<option/>").attr("value", spec.specialty).text(spec.specialty);
                console.log($option)
                $select.append($option);
            }); */

            var parentSelect = document.getElementById(selectID);
            while (parentSelect.firstChild) { //empties old elements of the list
                parentSelect.removeChild(parentSelect.firstChild);
            }
            for (var i = 0; i < data.length; i++) {
                var opt = document.createElement("option");      // TABLE HEADER.
                opt.innerHTML = data[i].specialty;
                opt.value = data[i].specialty;
                if (isUpdating==true && $.inArray(data[i].specialty, currentSpecialties) != -1){
                    //we are updating specialties and the current retrieved specialty is already got by the doctor
                    opt.selected = true;
                }
                parentSelect.appendChild(opt);
            }
            $('#'+selectID).multiselect('rebuild');
            
        })
        .fail(function(textStatus){
            //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
            //console.log(textStatus);  /*prints the Object*/
            
        });

        

    }

    function checkUpdate(){
        if(document.getElementById("updMedRegPrv").value=="" || document.getElementById("updMedRegPrv").value==undefined){
            //we don't check the value and assume that if the admin doesn't enter a value, the province has not changed
            document.getElementById("upd_form").submit();
        }else{
                    $.ajax({
                        type: "POST",
                        url: '/birthprovince',
                        contentType:'application/json',
                        data: JSON.stringify({medRegPrv: document.getElementById("updMedRegPrv").value}),
                    })
                    .done(function(data, textStatus, xhr){
                        //console.log(data); /*prints the message provided by the server*/
                        //console.log(textStatus); /*prints "success"*/
                        //console.log (xhr); /*prints xhr object*/
                        //console.log(xhr.status); /*prints success code (e.g. 200)*/
                        document.getElementById("upd_form").submit();                        
                    })
                    .fail(function(textStatus){
                        //console.log(textStatus.status);  /*prints error code (e.g. 404)*/
                        //console.log(textStatus);  /*prints the Object*/
                        console.log("Check the province")
                    });
                }
    

                   
        }
