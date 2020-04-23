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
});
