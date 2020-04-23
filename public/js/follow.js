$(document).ready(function() {
  $('#follow').click(function() {
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

  $('#unfollow').click(function() {
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
});
