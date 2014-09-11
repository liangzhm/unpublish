/**
 * Created by liangzhimin@chinaso.com on 2014/5/20.
 */
var newArticle = {
		queryId : parent.frames[0].queryId,
		tableId : parent.frames[0].tableId || parent.frames[0].autotableid,
		tableName : parent.frames[0].tableName
};
	
$(document).ready(function(){

    //加载编辑器
    ckeditorfun();
    /**新建稿件-稿签操作***/
    newDraftLabel();
    //初始化标签
    initLabel();
    
   
    //关闭左侧树
    $(".aside",parent.document).hide()&&$(".script-main",parent.document).addClass('no-margin');
    //保存
    $("#saveDraftBtn").on('click',saveDraftHandler);
    //返回
    $("#gobackBtn").on('click',gobackHandler);
    //预览
    $("#preview").on('click',prviewHandler);
    //送审
    $("#sendBtn").on('click',sendHandler);
    //发布
    $("#publishBtn").on('click',publishHandler);
    //多路发布
    $("#morePublishBtn").on('click',morePublishHandler);
    //保存为草稿
    $("#saveAsDraftsBtn").on('click',saveAsDraftsHandler);
    //提取
    $("#tiquBtn").on('click',tiquHandler);
    
    //调用时间控件
    $('.tit-date').datetimepicker({
    	format: 'yyyy-mm-dd hh:ii',
        //language:  'fr',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1
    });
});
/**新建稿件-稿签操作***/
var newDraftLabel = function(){
    $(".article-rightCon-close").click(function(){
        $(".article-rightCon").animate({
            width:'0px'
        },500)&& $(this).hide();

        $(".article-detail-con").animate({
            marginRight:'0px'
        },500);

    });
    /******打开稿签******/
    $(".article-list-rightBtn").delegate('a','click',function(event){
    	
    	if($(this).hasClass("open-slide")){
            $(".article-rightCon").show();
            $(".article-rightCon").animate({
                width:'350px'
            },500)&& $(".article-rightCon-close").show();
        
            $(".article-detail-con").animate({
                marginRight:'350px'
            },500);

        }
    });
    /*****折叠稿签****/
    $('.article-rightCon-tit h2').click(function(){
            if($(this).hasClass("close-ico")){
                $(this).parent('.article-rightCon-tit').next(".article-rightCon-list").slideDown(200);
                $(this).removeClass('close-ico');
            }else{
                $(this).parent('.article-rightCon-tit').next(".article-rightCon-list").slideUp(200);
                $(this).addClass('close-ico');
            }
        }
    );
    /**稿签中  链接高 同步稿 原创稿等 下拉列表框交互***/
    $("#secDraftStyle").on('change',function(){
        var selVal =parseInt($(this).val());
        if(selVal==1){//链接稿件，url是必填项
            $("#sourceUrl").removeAttr("disabled")&&$(".urlstar").text("*")&&$(".urlstar").addClass("red");

        }
        else{
            $("#sourceUrl").attr("disabled","disabled")&&$(".urlstar").text("")&&$(".urlstar").removeClass("red");

        }
    });
};

/**加载ckeditor插件**/
var ckeditorfun = function(){
   // CKEDITOR.replace( 'content' );
	ue = UE.getEditor('container');
	ue.ready(function(){
 		ue.setContent($("#contentDetail").val());
		//ue.setContent('${contentDetail}');
 		
 		//让纯文本btn选中
 		 ue.execCommand( 'pasteplain' );
 		/*
 		 ue.addListener( 'contentChange', function( editor ) {
 		     console.log('内容发生改变');	
 		     var from = getFromStatus();
 		     from = from.split("=")[1];
 		     var des = getFromD();
 		     if(!des){
 		    	   setTimeout(function(){
 		 		    	 saveAsDraftsHandler();
 					 },300000);
 		     }
 		     else{
 		    	 console.log("撤改稿详情页 不做自动保存");
 		     }
 		 });*/
	});
	
};

setInterval(function(){autoSave();},300000);

function autoSave(){
	 var des = getFromD();
	     if(!des){
	    	  
	 		    	 saveAsDraftsHandler();
				
	     }
	     else{
	    	 console.log("撤改稿详情页 不做自动保存");
	     }
	
}
 /*function getContenet(){
	return CKEDITOR.instances.content.getData(); //获取textarea的值
	}*/
function getFromStatus(){
	var search = location.search.substring(1);
	var sea = search.split("&");
	var from;
	for(var i=0;i<sea.length;i++){
		if(sea[i].indexOf("status")>-1){
			from = sea[i];
			break;
		}
	}
	return from;
}
function getFromD(){
	var search = location.search.substring(1);
	var sea = search.split("&");
	var des;
	for(var i=0;i<sea.length;i++){
		if(sea[i].indexOf("lwd")>-1){
			des = sea[i];
			break;
		}
	}
	return des;
}
/**初始化调用**/
var initLabel = function(){
	
	var from = getFromStatus();
    if(from){//获取来源
  	  from = from.split("=")[1];
        $("#status").val(from);
    }
    var des = getFromD();
    if(des){//获取编辑还是新建 edit是撤改稿的编辑
  	  des = des.split("=")[1];
    }
    console.log(from + "--"+des);
    if(from=='publish'&&des=='edit'){	//如果是撤改稿的修改进来的，那么排序号不能编辑，不能保存为草稿        			 
		$("#sortNum").attr("disabled","disabled")&&$("#saveAsDraftsBtn").prop("disabled","disabled");
		
	}
   	$("#tabid").val(newArticle.tableId);
	var qid = newArticle.queryId;
	
	//console.log(qid.split(";")[1]);
	$("#qid").val(qid.split(";")[0]);
	$("#pid").val(qid.split(";")[1]);
	$("#tabname").val(newArticle.tableName)&&$("#tableName").val(newArticle.tableName);
	var aid = $("#aid").val();
    $("#content.detail").html("");
    
    //根据稿签内容，初始化下拉列表框
    $("#secDraftStyle").trigger("change");	
    if(!$("#sortNum").val()){
    	 $("#secDraftStyle option[value='0']").remove()&& $("#secDraftStyle option[value='2']").attr("selected","selected");
    }
    
    if(!$("#sortNum").val()){
    	$("#sortNum").val(1);
    }
    $(".current",parent.document).find(".list li").each(function(index,el){
    	//console.log(index+"--"+el)
    	 if(index==0){
    		 $(this).addClass("cur");
    	 }
    	 else{
    		 $(this).removeClass();
    	 }
    	
    	
    });
     
	initdynamicField(aid);
};

/**加载稿签动态html**/
var initdynamicField = function(aid){
	
	
    $.ajax({
        url : 'dynamic.htm?id='+aid+'&t='+ new Date().getTime(),
        data : {
            queryId : newArticle.queryId,
            tableId: newArticle.tableId,
            tableName : newArticle.tableName
        },
        success : function(data) {
           
          $("#DynamicField").html(data);

        },
        error : function(response) {
            alert('请求扩展标签失败~请稍后重试' + response.status);
        }
    });
};
/*-----保存------*/
var saveDraftHandler = function(){
	
	 // console.log(event.target)
	  var sortNum = $("#sortNum").val();
	  if(sortNum==""){
		  alert("排序号不能为空！");
          return false;
	  }
	  var titleCN = $.trim($("#titleCN").val());//标题
	 // var target = event.target;
	  if(titleCN==""){
          alert("稿件标题不能为空！");
          return false;
      }
	  var urlObj = $("#sourceUrl");
      var url = "";
      if(urlObj){
          url = $.trim(urlObj.val());
      }
      
      if($(".urlstar").hasClass("red")){//如果是链接稿
      	 if(url.length < 1){
      		 alert("链接稿的URL不能为空!");
               return false;
           }
      }
      //source  sourceName
     /* var source = $("#source").val();
      if(source==""){
          alert("稿件来源不能为空！");
          return false;
      }*/
      var sourceName = $("#sourceName").val();
      if(sourceName==""){
          alert("来源网站不能为空！");
          return false;
      }
      
	  // var content = getContenet();
	  var content = ue.getContent();
	  $("#contentDetail").val(content);//给content.detail赋值
      var from = getFromStatus();
      if(from){
    	  from = from.split("=")[1];
          $("#status").val(from);
      }
      var des = getFromD();
      if(des){
    	  des = des.split("=")[1];
      }
	   //alert("ppoo--"+from);
	  var url = ctx + "/content/updateContent.htm?";
	 // console.log(url)
	 $.ajax({
	        cache: true,
	        type: "POST",
	        url:url,
	        data:$('#newContentForm').serialize(),// 你的formid
	        async: false,
	        error: function(data) {
	        	
	        		 alert("保存失败");
	        	           
	        },
	        success: function(data) {
	        	if(data==0){
	        		alert("稿件标题重复，请修改标题后重新保存~");
	        		
	        	}
	        	else if(data==1){
	        		alert("保存时服务器异常，保存失败~");
	        	}
	        	else {
	        		alert("保存成功！");
	        		
	        		if(from=='publish'&&des=='edit'){	        			 
	        			window.location.href = 'listWithdraw.htm'; 
	        		}
	        		/*else if(from=='box'){
	        			 window.location.href = 'draftsBox.htm'; 
	        		 }*/
	        		else{
	        			window.location.href = 'listUnPublish.htm';
	        		}	 		    		
	        		
	        	}
	        }
	    });
	 
    
};
//校验URL
function isURL(str_url) {// 验证url
	var strRegex = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
    var re = new RegExp(strRegex);
    return re.test(str_url);
}
//返回
var gobackHandler = function(){

    window.location.href = 'listUnPublish.htm';
};
//预览
var prviewHandler = function(){
	var pageid = newArticle.queryId.split(";")[1];
	var openUrl = ctx+'/workflow/preview.htm?columnId=' + pageid+ '&content._id='+$("#aid").val()+'&content.tableName='+$('#tabname').val();
	//var content=getContenet();
	 var content = ue.getContent();
	 $("#contentDetail").val(content);
	 $('#newContentForm').attr("action",openUrl);
	 $('#newContentForm').attr("target","_blank");
	 $('#newContentForm').submit();
//	$.ajax({
//        cache: true,
//        type: "POST",
//        url:openUrl,
//        data:$('#newContentForm').serialize(),// 你的formid
//        async: false,
//        error: function(request) {
//            alert("Connection error");
//        },
//        success: function(data) {
//        	win=window.open();
//        	win.document.write(data);
//        	/*{
//        	code : 200,
//        	id : lll
//        	}*/
//        }
//    });
};

//字数
var checkLength = function(which) {

        var curr = which.value.length; //250 减去 当前输入的

        document.getElementById("sy").innerHTML = curr.toString();

        return true;
};

var checkDescLength = function(which) {
	
	var content = removeHtmlTab(which.value);
	console.log("替换后的是"+content);
	var curr = content.length; //250 减去 当前输入的
	document.getElementById("syDesc").innerHTML = curr.toString();
	
	return true;
};
function removeHtmlTab(tab) {
	 return tab.replace(/<[^<>]+?>/g,'');//删除所有HTML标签
	}
function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return str;
}
//送审
var sendHandler = function(){
      var tableId = newArticle.tableId,tableName = newArticle.tableName;
      var titleCN = $.trim($("#titleCN").val());//标题
 	 
	  if(titleCN==""){
          alert("稿件标题不能为空！");
          return false;
      }
	 var ids = $("#aid").val();
	 // var content = getContenet();
	  var content = ue.getContent();
	 $("#contentDetail").val(content);
      var url = ctx + "/content/tosignContent.htm?tableId="+tableId+"&tableName="+tableName+"&ids="+ids+"&t="+new Date().getTime();
      $.ajax({
    	    type: "POST",
	        url:url,
	        data:$('#newContentForm').serialize(),// 你的formid
            success : function(res){
              if(res ==200){
                 alert("送审成功！");
                 window.location.href = 'listSignPublish.htm';
              }
             
	          },
	          error : function(){
	              alert("送审失败！请稍后重试~");
	          }
      });
};
//发布
var publishHandler = function(){	
	  var tableId = newArticle.tableId,tableName = newArticle.tableName,queryId = newArticle.queryId;
	  var ids = $("#aid").val();
	  var content = ue.getContent();
	  $("#contentDetail").val(content);//给content.detail赋值
	  
     
     
      var titleCN = $.trim($("#titleCN").val());//标题	 
	  if(titleCN==""){
        alert("稿件标题不能为空！");
        return false;
      }
	  
	  var urlObj = $("#sourceUrl");
      var linkurl = "";
      if(urlObj){
    	  linkurl = $.trim(urlObj.val());
      }
      
      if($(".urlstar").hasClass("red")){//如果是链接稿
      	 if(linkurl.length < 1){
      		   alert("链接稿的URL不能为空!");
               return false;
           }
      }
      var sourceName = $("#sourceName").val();
      if(sourceName==""){
          alert("来源网站不能为空！");
          return false;
      }
      var url = ctx + "/content/topublishContent.htm?tableId="+tableId+"&tableName="+tableName+"&ids="+ids+"&nodeId="+queryId+"&t="+new Date().getTime();
    $.ajax({
    	type: "POST",
	    url:url,
	    data:$('#newContentForm').serialize(),// 你的formid
        success : function(res){
            if(res ==200){
            	   alert("发布成功！");                 
            	   window.location.href = 'listPublished.htm';
            }
           
        },
        error : function(){
            alert("发布失败！请先保存，稍后重试~");
        }
    });
};
//多路发布
var morePublishHandler = function(){
	  var tableId = newArticle.tableId;
	  var queryId = newArticle.queryId;
	 $('#morePubModel').modal({})&&$("#moretree-frame").attr("src",ctx + '/column/treenode.htm?type=7&tableId='+tableId+'&qid='+queryId);
};
/*------确定多路发布----------------*/
$("#surePubBtn").on('click',function(){
    var nodes =$("#moretree-frame")[0].contentWindow.getcheckbox();
    var tableId = newArticle.tableId,tableName = newArticle.tableName,queryId = newArticle.queryId;
    var ids = $("#aid").val();
    var content = ue.getContent();
	$("#contentDetail").val(content);//给content.detail赋值
	  
    var titleCN = $.trim($("#titleCN").val());//标题
	 
	  if(titleCN==""){
      alert("稿件标题不能为空！");
      return false;
      }

	  var urlObj = $("#sourceUrl");
      var linkurl = "";
      if(urlObj){
    	  linkurl = $.trim(urlObj.val());
      }
      
      if($(".urlstar").hasClass("red")){//如果是链接稿
      	 if(linkurl.length < 1){
      		   alert("链接稿的URL不能为空!");
               return false;
           }
      }
      var sourceName = $("#sourceName").val();
      if(sourceName==""){
          alert("来源网站不能为空！");
          return false;
      }
      
      var url = ctx + "/content/topublishContent.htm?tableId="+tableId+"&tableName="+tableName+"&ids="+ids+"&nodeId="+queryId+"&queryIds="+nodes+"&t="+new Date().getTime();
      
      
    $.ajax({
    	type: "POST",
	    url:url,
	    data:$('#newContentForm').serialize(),// 你的formid
        success : function(res){
            if(res ==200){
               alert("多路发布成功！");
                $('#morePubModel').modal('hide');
                window.location.href = 'listPublished.htm';
            }
          
        },
        error : function(){
            alert("发布失败！请保存稿件~");
            $('#morePubModel').modal('hide');
   
        }
    });

});
//保存为草稿
var saveAsDraftsHandler = function(event){
	 //drafts。htm
	  console.log("每三万毫秒");
	  var queryId = newArticle.queryId;
	  var tableId = newArticle.tableId;
	  var tableName = newArticle.tableName;
	  var url = ctx +"/content/drafts.htm";
	  var content = ue.getContent();
	  $("#contentDetail").val(content);
	  $.ajax({
		 type : 'POST',
		 url : url,
		 async: false,
	     data: $('#newContentForm').serialize(),// 你的formid{
	     success : function(data){
	    	
	    	 var jdata = $.parseJSON(data);
	    	 console.log(jdata[0].code+"--"+jdata[0].id);
	    	 
	    	 if(jdata[0].code==200){
	    		 
	    		    if(event){
	        			alert("保存草稿成功！");
		        		window.location.href = 'listUnPublish.htm';
	        		}
	        		else{	
	        			var aid=  $("#aid").val();
	        			if(!aid){
	        				 $("#aid").val(jdata[0].id);	
	        			}
	        			
		        		setTimeout(function(){        			
		        				$("#warnDiv").fadeIn(0);
			        			$("#warnDiv").fadeOut(3000);
		        		},2000);
	        			
	        			
	        		}
	    		
	    	 }
	     },
	     error : function(){
	    	 alert("保存草稿失败");
	     }
	  });
};
//提取
var tiquHandler = function(){
	//var content=getContenet();
	 var content = ue.getContent();
//	var url = ctx + "/nlp/extract.htm?content="+content;
	 var url = ctx + "/nlp/extract.htm";
	
	$.ajax({
		url : url,
		type : "POST",
		data : {
			content : content
		},
		success : function(data){
			// var res = JSON.parse(data); 
			if(data instanceof Object){
				 var response =  extract(data);
				 if(response){
					 alert("提取成功");
				 }
			}
			
		},
		error : function(){
			alert("提取失败");
		}
	});
};
function extract(res){
	var kw = res.keywords;
	var locas = res.locas;
	var orgs = res.orgs;
	var persons = res.persons;
	var summary = res.summary;
	if(kw instanceof Array){
		
		kw = kw.join(",");
		$("#keyword").val(kw);
	
		locas = locas.join(",");
		$("#content_relatedArea").val(locas);
	
		orgs = orgs.join(",");
		$("#content_relatedOrganization").val(orgs);
	
		persons = persons.join(",");
		$("#content_relatedPeople").val(persons);
		
		$("#summary").val(summary);
	}
	
	return true;
}

