(function(){

   chrome.extension.onMessage.addListener(function(message, sender, sendResponse){
      var mailList = message.stuff + ',';
      var iframeDOM = document.getElementsByTagName('iframe');
      // For Gmail
      document.addEventListener('click', function(e){
         if(e.target.nodeName == 'TEXTAREA' && mailList !== ''){
            e.target.value = mailList;
            mailList = '';
         };
      });
      // For GDOC
      if(iframeDOM){
         var iframeLength = iframeDOM.length,
             shareName = 'share-client-content-iframe',
             targetIframe;
         for( key in iframeDOM ){
            var currentIframe = iframeDOM[key];
            if( currentIframe.className === shareName ){
               targetIframe = currentIframe;
            };
         };
         if( targetIframe ){
            targetIframe.contentWindow.addEventListener('click', function(e){
               if(e.target.nodeName == 'TEXTAREA' && mailList !== ''){
                  e.target.value = mailList;
                  mailList = '';
               };
            });
         };
      };
   })

})();

