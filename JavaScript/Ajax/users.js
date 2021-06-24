$(document).ready(function(){
  $("button").click(function(){
    let $users=$('#users');
    $.ajax(
    { 
      url: "https://reqres.in/api/users",
      type:'GET',
      headers:{
        'content-type': 'application/json',
      },
    success: function(users){
      console.log('success',users);
      let list=users.data;
      
      for(i=0;i<list.length;i++){
        $users.append('<tr> <td> '+ list[i].id + ' </td> '
        +'<td> '+ list[i].first_name + ' </td> '
        +'<td>  '+ list[i].last_name + ' </td>' 
        +'<td>  '+ list[i].email + ' </td>'
        +'<td>  '+ list[i].avatar + ' </td>' +' </tr>'    
         );
      }  
      
      
    }});
  });
});