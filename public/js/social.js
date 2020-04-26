$(document).ready(function() {

  $('#passLog, #userLog').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      var username = $('#userLog').val();
      var password = $('#passLog').val();

      if(password == "" && username == "") {
        $('#passLog').css('border-color', '#e84118');
        $('#userLog').css('border-color', '#e84118');
        $('#error-msg-login').text('Enter username and password.');
      }
      else if(username == "") {
        $('#passLog').css('border-color', '');
        $('#userLog').css('border-color', '#e84118');
        $('#error-msg-login').text('Enter username.');
      }
      else if(password == "") {
        $('#passLog').css('border-color', '#e84118');
        $('#userLog').css('border-color', '');
        $('#error-msg-login').text('Enter password.');
      }
      else {
        $('#passLog').css('border-color', '');
        $('#userLog').css('border-color', '');
        $('#error-msg-login').text('');
      }

      if(username != "" && password != "") {
        $.post('/home', {username: username, password: password}, function(result) {
          if(result != null) {
            if("password" == result) {
              $('#passLog').css('border-color', '#e84118');
              $('#userLog').css('border-color', '');
              $('#error-msg-login').text('Incorrect password. Try again.');
            }
            else if("username" == result) {
              $('#passLog').css('border-color', '');
              $('#userLog').css('border-color', '#e84118');
              $('#error-msg-login').text('User not found. Try again.');
            }
            else {
              $('#passLog').css('border-color', '');
              $('#userLog').css('border-color', '');
              window.location.replace = "/home";
            }
          }
        });
      }
    }
  });

  //login
  $('#logBtn').click(function() {
    var username = $('#userLog').val();
    var password = $('#passLog').val();

    if(password == "" && username == "") {
      $('#passLog').css('border-color', '#e84118');
      $('#userLog').css('border-color', '#e84118');
      $('#error-msg-login').text('Enter username and password.');
    }
    else if(username == "") {
      $('#passLog').css('border-color', '');
      $('#userLog').css('border-color', '#e84118');
      $('#error-msg-login').text('Enter username.');
    }
    else if(password == "") {
      $('#passLog').css('border-color', '#e84118');
      $('#userLog').css('border-color', '');
      $('#error-msg-login').text('Enter password.');
    }
    else {
      $('#passLog').css('border-color', '');
      $('#userLog').css('border-color', '');
      $('#error-msg-login').text('');
    }

    if(username != "" && password != "") {
      $.post('/home', {username: username, password: password}, function(result) {
        if(result != null) {
          if("password" == result) {
            $('#passLog').css('border-color', '#e84118');
            $('#userLog').css('border-color', '');
            $('#error-msg-login').text('Incorrect password. Try again.');
          }
          else if("username" == result) {
            $('#passLog').css('border-color', '');
            $('#userLog').css('border-color', '#e84118');
            $('#error-msg-login').text('User not found. Try again.');
          }
          else {
            $('#passLog').css('border-color', '');
            $('#userLog').css('border-color', '');
            window.location.href = "/home";
          }
        }
      });
    }
  });

  //follow user
  $('.profile-image-container').on('click', '#follow', function() {
    var userFollowing = ($("#handle")).text().substring(1);
    $.post('/following', {follow: userFollowing}, function(result) {
      if(result) {
        $('#follow').text("Unfollow");
        $('#follow').attr("id", "unfollow");
      }
      else {
        return;
      }
    });
  });

  //unfollow user
  $('.profile-image-container').on('click', '#unfollow', function() {
    var userFollowing = ($("#handle")).text().substring(1);
    $.post('/unfollowing', {follow: userFollowing}, function(result) {
      if(result) {
        $('#unfollow').text("Follow");
        $('#unfollow').attr("id", "follow");
      }
      else {
        return;
      }
    });
  });

  //like post
  $('.photo-actions').on('click', '#unliked', function() {
    var target = $(event.target);
    var post_id = ($(this).attr("class")).substring(1);
    $.post('/likepost', {post_id: post_id}, function(result) {
      if(result) {
        target.attr("src", "img/heart2.png");
        target.attr("id", "likedpic");
        target.attr("id", "liked");
      }
      else {
        return;
      }
    });
  });

  //unlike post
  $('.photo-actions').on('click', '#liked', function() {
    var target = $(event.target);
    var post_id = ($(this).attr("class")).substring(1);
    $.post('/unlikepost', {post_id: post_id}, function(result) {
      if(result) {
        target.attr("src", "img/heart.png");
        target.attr("id", "unlikedpic");
        target.attr("id", "unliked");
      }
      else {
        return;
      }
    });
  });

  //add comment
  $('.comment-container').on('click', '.addcommentbtn', function(event) {
    var target = $(event.target);

    var $form = $(this).closest("form");

    var comment = target.parent().parent().find('.comment-input').find('.addcomment').val();

    console.log(comment);

    var post_id = $form.attr('id');
    console.log(comment);
    var img = $('.nav-avatar').attr("src");

    var modal = target.parent().parent().parent().parent().parent().find('.comments');

    $.post('/addcomment', {hidden_id: post_id, comment: comment}, function(result) {
      if(result.flag) {
        modal.append(
          '<div class="comment-cont">' +
          '<img src="' + img + '">' +
          '<div class="row-name">' +
          '<strong>' + result.username + '</strong>' +
          '<div class="row-comment text-break">' + comment + '</div></div>' +
          '<button class="removecom"> X </button>' +
          '</div>'
        );
      }
      else {
        return;
      }
    });
  });

  //delete comment
  $('.comments').on('click', '.removecom', function(event) {

    var target = $(event.target);
    var post_id = target.parents('div').last().attr('id');
    var username = target.parent().find('.row-name').find('strong').text();
    var comment = target.parent().find('.row-name').find('.row-comment').text().trim();
    /*
    var data = (target.parent().text()).trim();
    data = data.replace(/(\r\n|\n|\r)/gm, "");
    var username = data.substr(0, data.indexOf(' '));
    username = username.replace(/(\r\n|\n|\r)/gm, "");
    var comment = (data.substr(username.length)).trim();
    comment = comment.substr(0, comment.indexOf(' '));
    comment = comment.replace(/(\r\n|\n|\r)/gm, "");
    */

    target.parent().remove();
    console.log(comment);
    console.log(username);
    console.log(post_id);

    $.post('/deletecomment', {username: username, hidden_id: post_id, comment: comment}, async function(result){

    });
  });

  $('.addpostdesc, .addposttitle').keyup(function(){
    var img = $('.postfilepond').val();
    var title = $('.addposttitle').val();
    var desc = $('.addpostdesc').val();

    if(title != "" && desc != "" || img != ""){
      $('.addpostbtn').attr('disabled', false);
    }
    else {
      $('.addpostbtn').attr('disabled', true);
    }
  });

  $('#delPostForm').on('click', '.delpostbtn', function(event){
    var target = $(event.target);
    var post_id = target.parent().find('input').attr('value');
    var filter = "." + post_id;

    $.post('/deletepost', {hidden_deleteID: post_id}, function(event){});
    $(document).find(filter).remove();
  });

  $('#editPostForm').on('click', '.editpostbtn', function(event){
    var target = $(event.target);
    var post_id = target.parent().parent().find('input').attr('value');
    var title = target.parent().parent().find('.addposttitle').val();
    var desc = target.parent().parent().find('.addpostdesc').val();
    var filter = "." + post_id;

    $.post('/editprocessing', {hidden_editID: post_id, edit_title: title, edit_desc: desc}, function(result){
      if(result != null){
        $(document).find(filter).find('.desc').val(desc);
        $(document).find(filter).find('.title').val(title);
      }
    });
  });

  $('#delPostForm').on('click', '.delpostbtn', function(event){
    var target = $(event.target);
    var post_id = target.parent().find('input').attr('value');
    var filter = "." + post_id;

    $.post('/deletepost', {hidden_deleteID: post_id}, function(event){});
    $(document).find(filter).remove();
  });
});
