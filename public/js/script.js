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

function deleteActivity(id) {
	window.location.href = '/delete_activity/'+id;
}

function editActivity(id) {
	window.location.href = '/edit_activity/'+id;
}

function postActivity() {
	// console.log($("input, select, textarea").serialize());
	$.ajax({
		url: "/add_new_activity",
		type: "post",
		data: $("input, select, textarea").serialize(),
    success: function(data, status, xhr){
      window.location.reload();
      // swal("OK!", "Du har nu lagt till en ny historia", "success");
      return false;
    },
    error:function(xhr, status, error){
        
      console.log(xhr.responseText);
      var err = '';
      $.each(JSON.parse(xhr.responseText) , function(i, item) {
         
        err +='<li>'+item.msg+'</li>';
      });
      
      $(".error-list").html(err);
      return false;
    }
	});
}

function putActivity(id) {

  $.ajax({
    url: "/edit_activity/"+id,
    type: "put",
    data: $("input, select, textarea").serialize(),
    success: function(res){
      window.location.reload();
      // swal("OK!", "Du har nu uppdaterat en historia", "success");
      //alert('Du har nu uppdaterat en historia!');
      return false;
    },
    error:function(xhr, status, error){
        
      console.log(xhr.responseText);
      var err = '';
      $.each(JSON.parse(xhr.responseText) , function(i, item) {
         
        err +='<li>'+item.msg+'</li>';
      });
      
      $(".error-list").html(err);
      return false;
    }
  });
}


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