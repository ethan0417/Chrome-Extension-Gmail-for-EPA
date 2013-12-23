$(document).ready(function(){
   var currentData;
   var mailList = '',
       googleLoginURL = chrome.extension.getBackgroundPage().googleOauth,
       //logoutURL = chrome.extension.getBackgroundPage().logoutURL,
       tree,
       treeSelect;
   // 產生樹的Fn
   tree = function tree(){
      $('#tree').dynatree({
         checkbox: true,
         selectMode: 3,
         children: currentData,
         onSelect: function(select, node){
            // 目前沒有群組email，因此用nodeName表示，之後有群組email再拿掉即可。
            var rootName = 'nodeName';
            var selNodes = node.tree.getSelectedNodes();
            var selKeys = $.map(selNodes, function(node){
               if(node.data.key !== 'nodeName')
                  return node.data.key;
            });
            mailList = selKeys.join(", ");
            // send mail from popup.html to content javascript
            chrome.tabs.query({active:true, currentWindow:true}, function(tab){
               chrome.tabs.sendMessage(tab[0].id, {stuff: mailList });
            });
         },
         onClick: function(node, event){
            if(node.getEventTargetType(event) === 'title')
               node.toggleSelect();
         },
         onKeydown: function(node, event){
            if(event.which == 32){
               node.toggleSelect();
               return false;
            }
         }
      });
   };
   // 全選功能
   treeSelect = function treeSelect(key){
      $("#tree").dynatree("getRoot").visit(function(node){
         node.select(key);
      });
      return false;
   };
   $('a').on('click', function(e){
      var linkName = $(this).attr('href');
      switch (linkName){
         case '#selectAll':
            treeSelect(true);
            break;
         case '#cancelAll':
            treeSelect(false);
            break;
         case '#error':
            $('#errorMsg').slideToggle('fast');
            break;
         case '#logout':
            $.ajax({url: logoutURL,success: function(){window.close();}});
            break;
      };
   });
   var init = function init(){
      chrome.extension.getBackgroundPage().goToInbox();
      var login = chrome.extension.getBackgroundPage().userStatus || '';
      var connectError = chrome.extension.getBackgroundPage().errorMsg;
      if(connectError){
         $('#errorMsg').html(connectError).removeClass('hide');
         $('#offlineMsg').removeClass('hide');
      };

      if( login ){
         var treeData = chrome.extension.getBackgroundPage().treeData || '';
         $('.tree').removeClass('hide');
         if(treeData){
            currentData = JSON.parse(treeData);
            tree();
         };
      }else{
         $('#google-login').removeClass('hide').find('a').attr('href', googleLoginURL);
      };
   };
   init();
});
