function loginPage() {
	window.location.href = '/login';
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