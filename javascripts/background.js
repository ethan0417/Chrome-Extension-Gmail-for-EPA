/*
 * 功能：
 *    1、判斷使用者是否已經登入
 *    2、查詢Data版號
 *    3、更新tree data
 */
      // Route
var   serverURL = 'https://epadev.micloud.tw',
      googleOauth = serverURL + '/oauth',
      queryTreeDataURL = serverURL + '/gettree',
      queryTreeID = serverURL + '/gettreeid',
      logoutURL = serverURL + '/logout',
      // Parameter
      userStatus = '',
      treeVersion = '',
      treeData,
      errorMsg,
      Help = '請聯絡負責人員，並告知以下訊息。',
      // Function
      queryFunction,
      queryTreeVersion,
      updateTreeData,
      scheduleRequest,
      startRequest,
      errorFn;
      // Oauth


/**
 * Error Handle
 */
errorFn = function errorFn(e){
   errorMsg = Help + '目前無法與伺服器連線，原因如下：<hr>' + e ;
};
/**
 * Query information from coress domain
 */
queryFunction = function queryFunction(url_link, callback){
   errorMsg = '';
   var xhr = new XMLHttpRequest(),
       tmp;
   xhr.open("GET", url_link, false);
   xhr.onreadystatechange = function(e) {
      if( xhr.readyState === 4 && xhr.status === 200 ){
            tmp = xhr.responseText;
            callback(tmp);
      }else{
         errorFn(xhr.statusText);
      };
   };
   try{
      xhr.send(null);
   }catch(e){
      // if error the tree data will clear.
      treeData = '';
      errorFn(e);
   };
};
/**
 * Query tree version
 */
queryTreeVersion = function queryTreeVersion(){
   queryFunction(queryTreeID, function(data){
      data = JSON.parse(data);
      if(data.account && data.account === 'false'){
         userStatus = 'false';
      }else{
         userStatus = 'true';
      };
      if(data.fileID){
         if(treeVersion){
            if(treeVersion === data.fileID){
               if(!treeData){
                  updateTreeData();
               };
            }else{
               updateTreeData();
            };
         }else{
            treeVersion = data.fileID;
            updateTreeData();
         };
      };
   });
};

/**
 * Query tree data
 */
updateTreeData = function updateTreeData(){
   queryFunction(queryTreeDataURL, function(data){
      treeData = data;
   });
};
/**
 * Initializes everything.
 */
init = function init(){

};

//Adding listener when body is loaded to call init function.
window.addEventListener('load', init, false);
