var users = [];
$( document ).ready(function()
{
    $(".hidden").hide().fadeIn(1500);
    function createUser(username, firstname, lastname, email, password)
    {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;

        this.getUsername = function()
        {
            return this.username;
        }
    }
/*REGISTRATION*/
    var check = false;

 $('#pw_').keyup(function(){
    passVal = $("#pw_").val();
    confVal = $("#cp_w").val();

    if(passVal.length < 8 || confVal == '' || confVal == null)
    {
        $("#pw_").css("border-color", "red");
        var stmt = "Password has to be more than 8 characters.";
        $("#error-msg-pw").val(stmt);
        $('#regMod').prop('disabled', true);

    }
    else
    {
        $("#error-msg-pw").val("");
        $("#pw_").css("border-color", "green");
        $('#regMod').prop('disabled', false);


    }

    $('#cp_w').keyup(function(){
   
        passVal = $("#pw_").val();
        confVal = $("#cp_w").val();

        if(passVal != confVal)
        {
            $("#pw_").css("border-color", "red");
            $("#cp_w").css("border-color", "red");

            var stmt = "Passwords don't match.";
            $("#error-msg-cpw").val(stmt);
            $('#regMod').prop('disabled', true);
            $('#submitBtn').prop('disabled', true);

        }
        else
        {
            $("#pw_").css("border-color", "green");
            $("#cp_w").css("border-color", "green");
            check = true;
            $('#regMod').prop('disabled', false);
            $('#submitBtn').prop('disabled', false);

        }
   });
 });

    function readURL(input)
    {
        if (input.files && input.files[0])
        {
            var reader = new FileReader();
            reader.onload = function(e)
            {
                $('.fill-row').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgUpload").change(function()
    {
        readURL(this);
    });

    $(document).on('click', '.delete-post', function(e)
    {
        $(this).parent().remove();
    });

    $(document).on('click', '.edit-post', function(e)
    {
        var titletext = $(this).parent().parent().find(".photo-header").find("label").text();
        var desc = $(this).parent().parent().find(".photo-description").find("label").text();
        var header = $(this).parent().parent().find(".photo-header");
        var photodesc = $(this).parent().parent().find(".photo-description");

        $("#editModal").find(".addposttitle").val(titletext);
        $("#editModal").find('.addpostdesc').val(desc);

        $(".editpostbtn").click(function()
        {
            $(header).children("label").text($("#editModal").find(".addposttitle").val());
            $(photodesc).children("label").text($("#editModal").find('.addpostdesc').val());
        });
    });
/*
    function imageIsLoaded(e)
    {
        $('.pic-col').append("<img class='fill' src='" + e.target.result + "'>");
    };*/

    $("#navfolio #home-red").click(function()
    {
        window.location.href = "home";
    });

    $('#userName_').keyup(function (){
        var uname = $('#userName_').val();


        $.get('/checkUsername', {username: uname}, function(result){
            if(result.username == uname){
                $('#userName_').css('border-color', 'red');
                $('#error-msg-uname').text('User already registered');
                $('#regMod').prop('disabled', true);

            } else {
                $('#userName_').css('border-color', 'green');
                $('#error-msg-uname').text('');
                $('#regMod').prop('disabled', false);
            }
        });
    });
    
    $('#email_').keyup(function (){
        var mailer = $('#email_').val();

        $.get('/checkEmail', {email: mailer}, function(result){
            if(result.email == mailer){
                $('#email_').css('border-color', 'red');
                $('#error-msg-email').text('Email already registered');
                $('#regMod').prop('disabled', true);

            } else {
                $('#email_').css('border-color', 'green');
                $('#error-msg-email').text('');
                $('#regMod').prop('disabled', false);
            }
        });
    });

    /*FORGOT PASSWORD*/
    $('#forgotMod').click(function() {
        var mailer = $('#mailForgotten').val();

        $.get('/forgotpass', {email: mailer}, (result)=>{
            $('#mail-notifier').text(result);

        });
    });

    $('#newpass_').keyup(function(){
        passVal = $("#newpass_").val();
        confVal = $("#newcp_").val();
    
        if(passVal.length < 8 || confVal == '' || confVal == null)
        {
            $("#newpass_").css("border-color", "red");
            var stmt = "Password has to be more than 8 characters.";
            $("#err-pass").val(stmt);
            $('#submitNewPassBtn').prop('disabled', true);
    
        }
        else
        {
            $("#err-pass").val("");
            $("#newpass_").css("border-color", "green");
            $('#submitNewPassBtn').prop('disabled', false);
    
    
        }
    
        $('#newcp_').keyup(function(){
            
            passVal = $("#newpass_").val();
            confVal = $("#newcp_").val();
    
            if(passVal != confVal)
            {
                $("#newpass_").css("border-color", "red");
                $("#newcp_").css("border-color", "red");
    
                var stmt = "Passwords don't match.";
                $("#err-pass").val(stmt);
                $('#regMod').prop('disabled', true);
                $('#submitNewPassBtn').prop('disabled', true);
    
            }
            else
            {
                $("#err-pass").val("");
                $("#newpass_").css("border-color", "green");
                $("#newcp_").css("border-color", "green");
                check = true;
                $('#submitNewPassBtn').prop('disabled', false);
                $('#submitNewPassBtn').prop('disabled', false);
    
            }
       });
     });





    
    
});
