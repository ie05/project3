//////////////////////
// START AJAX CALLS //
//////////////////////
function deleteStatus(id) {
  $.ajax({
        method: "DELETE",
        url: "/delete",
        data: { 'id': id }
      }).done(function (data) {
        console.log('DELETE complete');
       
      }).fail(function (error) {
        console.log('DELETE error');
        console.log(error);
      });
} // end deleteStatus

function addStatus(tweet) {
          $.ajax({
            method: "POST",
            url: "/add",
            data: { 'tweet': tweet }
          }).done(function (data) {
            console.log('ADD complete');
            getAllStatuses();
           
          }).fail(function (error) {
            console.log('ADD error');
            console.log(error);
          });
} // end addStatus

function getAllStatuses(){
  $.ajax({
            method: "GET",
            url: "/all"
          }).done(function (data) {
            console.log('All complete');
            renderAllStatuses(data);
           
          }).fail(function (error) {
            console.log('All error');
            console.log(error);
          });
} // end getAllStatuses

//////////////////////
/// END AJAX CALLS ///
//////////////////////


function renderAllStatuses(obj){
  // remove all statuses from the view
  // then re-write the statuses element
  // with updated data from twitter
  $('.statuses').empty();

  // use each function to append
  // an li for every tweet returned
  // from AJAX call
  $(obj).each(function(){
    var $li = $('<li>', {id: this.id});
    var $label = $('<label>', {'text': this.text});
    var $form = $('<form>',{'css': {'display':'inline'}}).append($('<button>',{class: 'delete', name: 'id', type: 'submit', value: this.id, text:'Delete'}));

    $li.append($label,$form);
    $('.statuses').append($li);
  });
}

$(document).ready(function(){
  // delete handler
  // triggers AJAX call 
  // to delete method
  $('.statuses').on('click','.delete',function(e){
    if (e.preventDefault) {
      e.preventDefault();
    }else{e.returnValue = false}
    var id = $(this).val();
    if (confirm("Are you sure you want to delete this post?") == true){
      deleteStatus(id);
    }else{
      return false;
    }
     // create a confirmation message
     // letting the user know they successfully
     // deleted a a tweet
     $('li[id="' + id + '"]').css({color: '#228B22'}).text('This post has been deleted...').delay(600).fadeOut('slow');

  });

  // add handler
  // triggers AJAX call 
  // to add method
  $('#add').on('click', function(e){
      if (e.preventDefault) {
        e.preventDefault();
      }else{e.returnValue = false}
      // client side validation
      var tweet = $(this).siblings('input').val();
      if (tweet == '') {
        if ($('.val-error').length < 1) {
          $(this).after($('<div>',{class: 'val-error',text:'This is a required field'}));
        }
      e.preventDefault();
      }else{
          $('.val-error').remove();
          addStatus(tweet);
          $(this).siblings('input').val('Nice tweet!').animate({color: "#F5F5F5"},1000);
          
          // remove input val from field
          // after user submits, or leaves field
          // without hitting submit
          $('input').on('focus',function(){
            $(this).val('').css({color: "#000000"});
        
          });
      }
     
  });

 }); // end document.ready

