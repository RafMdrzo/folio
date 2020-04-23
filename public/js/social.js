$(document).ready(function() {

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
    var post_id = ($(this).attr("class")).substring(1);
    $.post('/likepost', {post_id: post_id}, function(result) {
      if(result) {
        $('#unlikedpic').attr("src", "img/heart2.png");
        $('#unlikedpic').attr("id", "likedpic");
        $('#unliked').attr("id", "liked");
      }
      else {
        return;
      }
    });
  });

  //unlike post
  $('.photo-actions').on('click', '#liked', function() {
    var post_id = ($(this).attr("class")).substring(1);
    $.post('/unlikepost', {post_id: post_id}, function(result) {
      if(result) {
        $('#likedpic').attr("src", "img/heart.png");
        $('#likedpic').attr("id", "unlikedpic");
        $('#liked').attr("id", "unliked");
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

    $.post('/addcomment', {hidden_id: post_id, comment: comment}, function(result) {
      if(result.flag) {
        $('.comments').append(
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
      window.location.href = '/';
    });
  });
});
