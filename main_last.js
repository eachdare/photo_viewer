//////////////////////////////////////////////////////////////////ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ

var userObj ={need_covers:1,"fields":"photo_50"},// объект текущего пользователя, с указанными правами доступа
    i = 0,
    container = $(".container"),
    albumContent =$(".album-content-section"),
    imgContainer=$(".img-container"),
    imgContainerWrap =$(".img-container-wrap"),
    body=$("body"),
    albumSection = $(".album-section"),
    containersCss = {"width":"110px",
                     "height":"130px",
                     "display":"inline-block"},
    albumContainer=$(".album-container"),
    photoView = $(".photo-view-section"),
    photoInfoName = $(".photo-view-name-section"),
    photoInfoCaption =$(".photo-view-caption-section"),
    userNavSection = $(".user-nav-section");

//JQUERY UI
var tab = $("#tabs");
//СО3ДАНИЕ ВКЛАДОК
tab.tabs();//ui.js
///END JQUERY UI

////////////////////////////////////////////////////////////////////ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ И ОТЛАДОЧНЫЕ ФУНКЦИИ
VK.init({
    apiId: 4698039
});

VK.Auth.getLoginStatus(authInfo);
VK.UI.button('login_button');

/////////////////////////////////////////////////////////////////////ВЫХОД ЮЗЕРА ИЗ АККАУНТА ВК
$('#logout_button').click(function (event) {
    event.preventDefault();
    VK.Auth.logout(function(){
       location.href = 'index.html';
    });
})

var globalAlbumList = "",
    globalPhotoArray = "";//в эту переменную сохраним данные локальной переменной
/////////////////////////////////////////////////////////////////////////////ПОЛУЧЕНИЯ ДОСТУПА К АВАТАРКЕ ПОЛЬЗОВАТЕЛЯ
VK.Api.call("users.get", userObj,function(userAvatar){

    console.log(userObj)
    userNavSection.prepend('<img class="user-avatar" src="' + userAvatar.response[0].photo_50 + '">')
})
///////////////////////////////////////////////ПОЛУЧАЕТ СПИСОК АЛЬБОМОВ ПОЛЬЗОВАТЕЛЯ И СОЗДАЕТ КОНТЕЙНЕРЫ ДЛЯ АЛЬБОМОВ
    VK.Api.call('photos.getAlbums',userObj,function(albumList){
        for(i;i<albumList.response.length;++i){
            albumSection
                .append($("<div class='album-container-wrap'></div>")
                    .append($("<div class='album-img-container'>").css({"background-image":'url("' + albumList.response[i].thumb_src + '")'}))
                    .append($("<span class='captions album-name'> "+'Name: '+""+albumList.response[i].title+'</span>'))
                    .append($("<span class='captions album-name'> "+'Photos: '+""+albumList.response[i].size+'</span>'))
            );
            console.log(i);

        }
        i=0;

       globalAlbumList = albumList;//сохраняем локальную переменную в глобальную

    });
////////////////////////////////////////////////////////////////////ПОЛУЧАЕТ АЙДИ ТЕКУЩЕГО АЛЬБОМА
        container.on('click', '.album-container-wrap', function() {

            var indx = $(this).index(),
            albumId = globalAlbumList.response[indx].aid;//aid - album_id
            userObj["album_id"]=albumId;
/////////////////////////////////////////////////////////////////////СОЗДАЕТ КОНТЕЙНЕРЫ С ПИКЧАМИ
            VK.Api.call('photos.get',userObj , function(photoArray){ // в аргумент передается массив объектов фотографий пользователя
            console.log(photoArray);


         var drawElements = function () {
             if($(".album-content-section").is(':empty')){//если контейнер пустой...
                 console.log("albumContent EMPTY! Now appended!...");
                 for(i;i<photoArray.response.length;++i){//...то создаем в нем элементы
                     albumContent
                     .append($("<div class='img-container-wrap'></div>")
                             .append($("<div class='img-container'>").css({"background-image":'url("' + photoArray.response[i].src + '")'}))
                             .append($("<span class='captions img-name'> "+'Name: '+""+photoArray.response[i].pid+'.jpg'+'</span>'))
                     );
                 }
                 i=0;
             }
             else{
                 albumContent.empty();
                 drawElements();
             }
         };
                drawElements();
                globalPhotoArray=photoArray;
            });
        tab.tabs({active:1});
        });



    albumContent.on('click', '.img-container-wrap', function() {
            var indx = $(this).index();
            var src_big = globalPhotoArray.response[indx].src_big; // big image url
                console.log(globalPhotoArray);
              photoView
                    .empty().append($("<img>",{"src":globalPhotoArray.response[indx].src_big}));

              photoInfoName
                  .empty().append($("<span class='captions img-name'> "+'Name:  '+""+globalPhotoArray.response[indx].pid+'.jpg'+'</span>'));
              photoInfoCaption
                   .empty().append($("<span class='captions img-caption'> "+""+globalPhotoArray.response[indx].text+' '+'</span>'));
        tab.tabs({active:2});
});

//////////////////////////////////////////////////////////////////////НАВИГАЦИЯ ПО ТАБАМ
var tabNavigation = function (linkId,switchToTab) {
    $(linkId).click(function() {
        tab.tabs({ active: switchToTab });
        return false;
    })
};
tabNavigation('#nav-link-1',0);
tabNavigation('#nav-link-2',1);
tabNavigation('#nav-link-3',2);






