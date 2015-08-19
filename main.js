var userObj ={uids:18756852};
VK.Api.call('photos.getProfile',userObj ,function(photoArray){
        console.log(photoArray);
        $("<div class='dinamic'></div>");



});

