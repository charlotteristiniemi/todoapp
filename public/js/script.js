function loginPage() {
	window.location.href = '/login';
}

function logoutPage() {
	window.location.href = '/logout';
}

function addNewActivity() {
	window.location.href = '/add_new_activity';
}

function cancelAdd() {
	window.location.href = '/';	
}

function cancelLogin() {
  window.location.href = '/';  
}

function deleteActivity(id) {
	window.location.href = '/delete_activity/'+id;
}

function editActivity(id) {
	window.location.href = '/edit_activity/'+id;
}

$( document ).ready(function() {
  $(function() {
    //----- OPEN
    $('[data-popup-open]').on('click', function(e)  {
      var targeted_popup_class = jQuery(this).attr('data-popup-open');
      $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

      e.preventDefault();
    });
 
    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
      var targeted_popup_class = jQuery(this).attr('data-popup-close');
      $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

      e.preventDefault();
    });
  });
});

// function putActivity(id) {
//   $.ajax({
//     url: "/edit_activity/"+id,
//     type: "put",
//     data: $("input, select, textarea").serialize()
//     // success: function(result,status,xhr){
//     //   // msg +='<li>You have now updated the activity!</li>';
//     //   // $(".valid-ul").html(msg);
//     //   alert("You have updated an activity");
//     //   // window.location.reload();
//     //   // swal("OK!", "Du har nu uppdaterat en historia", "success");
//     //   console.log('result: '+result);
//     //   console.log('status: '+status);
//     //   console.log('xhr: '+xhr);
//     //   return false;
//     // }
//   });
// }

// function postActivity() {
// 	$.ajax({
// 		url: "/add_new_activity",
// 		type: "post",
// 		data: $("input, select, textarea").serialize(),
//     success: function(data, status, xhr){
//       window.location.reload();
//       // swal("OK!", "Du har nu lagt till en ny historia", "success");
//       return false;
//     },
//     error:function(xhr, status, error){
        
//       console.log(xhr.responseText);
//       var err = '';
//       $.each(JSON.parse(xhr.responseText) , function(i, item) {
         
//         err +='<li>'+item.msg+'</li>';
//       });
      
//       $(".error-list").html(err);
//       return false;
//     }
// 	});
// }


// function login() {
	
// 	$.ajax({
// 		url: "/login",
// 		type: "post",
// 		data: $("input").serialize(),
//     success: function(data, status, xhr){
//     	console.log('data = ' + data);
//     	console.log('status = ' + status);
//     	console.log('xhr.responseText = ' + xhr.responseText);
//       window.location.reload();
//       // swal("OK!", "Du har nu lagt till en ny historia", "success");
//       return false;
//     },
//     error:function(xhr, status, error){
        
//       console.log(xhr.responseText);
//       var err = '';
//       $.each(JSON.parse(xhr.responseText) , function(i, item) {
         
//         err +='<li>'+item.msg+'</li>';
//       });
      
//       $(".error-list").html(err);
//       return false;
//     }
// 	});
// }
