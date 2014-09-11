/**
 * Created by liangzhimin@chinaso.com on 2014/5/20.
 */
var treeNodefun = function(){};
$(function() {
        var queryId,tableId,tableName,table = $("#unPublishTable"),searchTerm,status;
        var listArticle = {//从树页面获取公共属性
                queryId : parent.frames[0].queryId,
                tableId : parent.frames[0].autotableid,
                tableName : parent.frames[0].tableName,
                status:parent.frames[0].stateId
        };
       //加载表格数据,传入URL
        var tablelist = function(url){
        	
            var tb =  $("#listUnPublish_body");//表格table body
            $.ajax({
                url: url,
                data : {
                	t : new Date().getTime()
                },
                type: "GET",
                 contentType: "charset=utf-8",
                 success: function(data){
                     if(data){
                    	 
                         var obj = $.parseJSON(data);
                         if(!obj.results.length){
                        	// $(".pageWrapper").parent.append("<span>对不起，此节点下没有数据~，请换其他节点重试~</span>");
                             $(".pageWrapper").hide();
                            
                         }
                         else{
                             $(".pageWrapper").show();
                         }

                         $("#unPublist").publishedTable(obj.results,tb);//调用生成表格类
                         
                         setPagecallback(obj.totalPage,obj.totalCount,obj.pageNo,obj.pageSize,url);
                         
                     }
                 },
                 error : function(msg){

                     alert("sorry~获取数据错误，请稍后再试!");
                 }

            });

        };
        treeNodefun = tablelist;//给树节点赋值函数；此函数为全局函数；

        function resetValue(){
            queryId = table.attr("query-id"),tableId = table.attr("table-id"),tableName = table.attr("table-name");
            searchTerm = '&nodeId='+queryId +'&tableId='+tableId+'&tableName='+tableName;
        }
        function getGlobleParams(){//获取全局变量
        	resetValue();
        	queryId = queryId?queryId : listArticle.queryId;
        	tableId = tableId?tableId : listArticle.tableId;
        	tableName = tableName?tableName : listArticle.tableName;
        	
        	return {
        		queryId : queryId,
        		tableId : tableId,
        		tableName : tableName
        	};
        }  
        //请求数据成功后，回写页码值
       var  setPagecallback = function(totalPage,totalCount,pageNo,pageSize,url){
    	   //页码回调赋值 
           $("#searchForm_page_totalPages").val(totalPage);
           $("#searchForm_page_totalCount").val(totalCount);
           $("#searchForm_page_pageNo").val(pageNo);
           $("#searchForm_page_pageSize").val(pageSize);
           $("#searchForm_page_pageUrl").val(url);
           $(".curpage").text(1);
           $(".totalpage").text(totalPage);
         
           $(".totalcount").text(totalCount);               
           $('#select_page_pageSize').val(15);
           if(totalPage==1){
        	   
          	   $(".pagination").trigger("page.only"); //此处需要改
           }
           else{
        	   $(".pagination").trigger("page.index");
           }
          //设置二级导航中 节点下的稿件总数目
           if(totalCount){
        	   $(".unPNum",parent.document).text(totalCount);
           }
           else{
        	   $(".unPNum",parent.document).text(0);
           }
         
       };
       //设置稿签值
        var setfixedfield = function(id,sid){
             var draftTabArr = ['titleCN','author','sourceUrl','source','sourceName','summary','previewImage','tableId','titleEN','tableName','sortNum'];
            //来源形式通过sourceType获取
             var tabItemIds=[];
             var newid = $.trim(id+'_source');
             $("#sortId").val(sid);//排序号
             $("#displayId").html(id)&&$("#displayIdH").val(id);//ID号
             $("#source").val($('#'+newid).text());

            $.each(draftTabArr,function(i,val){
                tabItemIds[tabItemIds.length] = id+'_'+val;

            });

            $.each(tabItemIds,function(i,val){
                var _val = $("#"+tabItemIds[i]).text();

                $("#"+draftTabArr[i]).val(_val);
            });
            $("#previewImage").attr("src",$("#"+id+"_previewImage").text());
            var sourcetype = $("#"+id+"_sourceType").text();
            //sourcetype=1;
           // console.log(sourcetype)
            $("#secDraftStyle option[value!="+sourcetype+"]").attr("selected", false);//有效
            $("#secDraftStyle option[value="+sourcetype+"]").attr("selected", true);//有效


        };

        /*加载稿签动态html*/
        var dynamicField = function(tid){

            queryId = table.attr("query-id") || listArticle.queryId;
            tableId = table.attr("table-id") || listArticle.tableId;
            tableName = table.attr("table-name") || listArticle.tableName;
            //resetValue();
           // console.log(queryId +".."+tableId+".."+tableName);
            $("#tabname").val(tableName);
            $.ajax({
                url : 'dynamic.htm?id='+tid+'&nodeId='+queryId+'&tableId='+tableId+'&tableName='+tableName+'&t='+ new Date().getTime(),
                success : function(data) {

                  $("#DynamicField").html(data);

                },
                error : function(response) {
                    alert('加载稿签超时，请稍后重试~' + response.status);
                }
            });
        };
        //单击表格每一行的交互
        var clickPubTableTr = function(){
            $("#unPublishTable").delegate('tr','click',function(e){
                
            	//checkbox 不加载稿签数据
            	 if($(e.target).hasClass('checkbox_style')){
            		return;
            	 }

            	 else{
            		
            		 
	                /******回填稿签数据******/
	                var sortNum = $(this).children().first().next(),draftId,sortid;
	                draftId = "";
	                if(sortNum.attr("data-id")){
		                    sortid = sortNum.text();
		                    draftId = sortNum.attr("data-id");
		                   // console.log(draftId);
		                    setfixedfield(draftId,sortid);//调用回填函数
		                        //根据稿签内容，初始化下拉列表框
		                   $("#secDraftStyle").trigger("change");		
		                   dynamicField(draftId);
	                   }
            	 }

            });
        };
        //稿签的操作集合
        var draftLabel = function(){
            /**点叉号，关闭稿签**/
            $(".article-rightCon-close").click(function(){
                $(".article-rightCon").animate({
                    width:'0px'
                },500,function(){$(this).hide();})&& $(this).hide();
                //$(".article-rightCon").hide();

            });
            /******打开稿签******/
            $(".article-list-rightBtn").delegate('a','click',function(event){
                    if($(this).hasClass("open-slide")){
                        $(".article-rightCon").show();
                        $(".article-rightCon").animate({
                            width:'350px'
                        },500)&& $(".article-rightCon-close").show();
                    }
                  //  $(".article-rightCon").show();

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
        /**表格中 单击稿件类型 下拉显示***/
        var tableOperate = function(){
           /**表格中 单击稿件类型 下拉显示***/
            $(".manuscript-type").hover(function() {
                $(this).find('.list').show(100);
            }, function() {
                $(this).find('.list').hide(100);
            });

       };

        /*-----稿签保存-----*/
        var saveHandler = function(){
            var id = $.trim($("#displayId").text());//稿件id
            var titleCN = $.trim($("#titleCN").val());//标题
            if(id.length<1){
                alert("ID不能为空！请选择一条稿件，再保存！");
                return false;
            }
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
            	 else if(!isURL(url)){
                     alert("链接稿的URL不合法，请重新输入~");
                     return false;
                 }
            }
          //如果是链接稿并且合法，或者是手工稿，同步稿  则继续
            var params = $("#contentForm").serialize();
            var url = ctx + "/content/updateContentLabel.htm?";
            //alert(url)
            $.ajax({
                url : url + 't='+new Date().getTime(),
                data : params,
                success : function(data){

                    if(data==200){
                       
                        savesuccess();
                    }
                },
                error : function(){
                    alert("save error");
                }
            });
            //console.log(params);
        };

        /*----保存成功后，显示当前页面 重新发请求list页面------*/
        function savesuccess(){
                alert("操作成功");
                var current = $(".curpage").text();
                var tablediv = $(".pageWrapper").siblings("table");
                var tablebody = tablediv.find("tbody");
                var tourl = $("#searchForm_page_pageUrl").val();
               // alert(tourl)
                var sel =  $("#select_page_pageSize").children('option:selected').val();

                operatePage(tourl,current,sel,function(res){
                    tablediv.publishedTable(res,tablebody);//调用生成表格类
                    $(".curpage").text(current);
                   
                    $(".article-rightCon-close").trigger("click");
                });
               

        }
        //校验URL
        function isURL(str_url) {// 验证url
        	var strRegex = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
            var re = new RegExp(strRegex);
            return re.test(str_url);
        }
        //操作页面 发出请求
        function operatePage(tourl,page,pagesize,callback){
            //再发一次请求
            var url= tourl+"&pageNo="+page+"&pageSize="+pagesize;
  
            $.ajax({
                url:url,
                data :{
                	t : new Date().getTime()
                },
                success:function(data){
                    if(data){
                        var obj = $.parseJSON(data);
                        
                        callback(obj.results);//请求表格数据，其次刷新页码
                        $(".totalpage").text(parseInt(obj.totalPage));                  
                        $(".totalcount").text(obj.totalCount);                  
                        $("#searchForm_page_totalPages").val(parseInt(obj.totalPage));
                        $("#searchForm_page_totalCount").val(obj.totalCount);
                      
                    }

                },
                error:function(){
                    alert("error！");
                }

            });
        }
        /************************************************************/



        function initList(){
        	 var params = window.location.search ,url;
        	 params = params && params.substring(1);
        	 if(params.indexOf("pageNo")){
        		// alert("pageno");
        	 }
        	 if(params){
        		 url = ctx+"/content/list.htm?"+params+'&status=wait';
        	 }
        	 else{
        		 url =  ctx+"/content/list.htm?nodeId="+listArticle.queryId+'&tableId='+listArticle.tableId+'&tableName='+listArticle.tableName+'&status=wait';
        	 }
          
             /*生成table**/
        
             if(listArticle.queryId){
                 queryId = listArticle.queryId;
               //  console.log("table"+url)
                 tablelist(url);
             }
            else{
                 $(".pageWrapper").hide();
             }
             
             $(".open-left").trigger('click');
         }
        /*-----页面入口-----*/
        initList();//页面入口
        /*-----end-----*/


        /******单击表格 更新稿签 等******/
        clickPubTableTr();

        /*-----稿签交互-----*/
        draftLabel();
        /*-----表格操作-----*/
        tableOperate();

        /*------稿签保存----------*/
        $("#unPubLabelSave").on('click',saveHandler);
        
        /*------组合查询条件，定义queryid，tableid，tablename-------------*/
        var arr = [0,1,2,3,4,5,6,7];
       
        var checkVal = arr.join(",");
        
        /*-----表格来源形式过滤，发出请求，重载页面-----*/
        $("input[name='sourceTypeBox']").click(function(){
            resetValue();
            var url =ctx+"/content/list.htm?nodeId="+getGlobleParams().queryId+'&tableId='+getGlobleParams().tableId+'&tableName='+getGlobleParams().tableName;

            var checkValArr = [];
            $("[name='sourceTypeBox']:checked").each(function() {
                if ($(this).attr("checked")) {
                    checkValArr.push($(this).attr("value"));
                }
            });

            checkVal = checkValArr.join(",");//checkVal定义为全局变量了

            var filterURL = url +"&sourceType="+checkVal+"&status=wait";
            if(!getGlobleParams().queryId){
            	alert("请选择节点！");
            	return false;
            }
            else{
            	tablelist(filterURL);
            }
            
        });

        /*-----创建时间按倒序排----------*/
        $("#createAtTime").on('click',function(){
        	resetValue();
            var  url =  ctx+"/content/list.htm?nodeId="+getGlobleParams().queryId+'&tableId='+getGlobleParams().tableId+'&tableName='+getGlobleParams().tableName;
        	var timeUrl = url + "&sourceType="+checkVal+'&createAt=desc&status=wait';
            //console.log("time"+timeUrl)
        	if(!getGlobleParams().queryId){
            	alert("请先选择树节点！");
            	return false;
            }
        	else{
        		tablelist(timeUrl);
        	}
        	

        });
        
        /*------新建稿件---------------*/
        $("#newArticleBtn").on('click',function(){
        	  resetValue();           
        	  if(!getGlobleParams().queryId){
        		  alert("请选择一个节点！");
        		  return;
        	  }
        	  else{
        		          	 
	        	  var url = ctx +"/content/editContent.htm?status=wait&";
	        	  location.href = url+'nodeId='+getGlobleParams().queryId +'&tableId='+getGlobleParams().tableId+'&tableName='+getGlobleParams().tableName;
        	  
        	  }
        	  return false;
        });
        /*------编辑稿件---------------*/
        $("#editArticleBtn").on('click',function(){
        	var checkobx ,_id ,url;
        	checkobx = $("input[name='chk_row']:checked");
        	 if(!checkobx.length){
                 alert("至少选择一条稿件!");
                 return;
             }
        	 if(checkobx.length>1){
                 alert("每次只能选择一条稿件!");
                 return;
             }
        	 _id = checkobx.parent(".t-c").next().attr("data-id");
        	 resetValue();
        	 queryId = table.attr("query-id") || listArticle.queryId;
             tableId = table.attr("table-id") || listArticle.tableId;
             tableName = table.attr("table-name") || listArticle.tableName;
        	 url = ctx +"/content/editContent.htm?status=wait&id="+_id+"&nodeId="+queryId+'&tableId='+tableId+'&tableName='+tableName;
        
        	 console.log("tttt"+url);
        	 location.href = url;  
        	 return false;
        });

         /*------删除稿件--------*/
        $("#delArticleBtn").on('click',function(){
            var ids = [],id,idstring,checkobx;
            checkobx = $("input[name='chk_row']:checked");
            if(!checkobx.length){
                alert("至少选择一条稿件!");
                return;
            }           
            if(confirm("您确定删除吗？")){
	            checkobx.each(function(){	
	                id = $(this).parent(".t-c").next().attr("data-id");
	                ids.push(id);
	            });
	            idstring = ids.join(",");
	            var url =ctx + "/content/delContent.htm";
	            $.ajax({
	                url : url,
	                data : {
	                	ids : idstring,
		            	tableId : getGlobleParams().tableId,
		            	tableName : getGlobleParams().tableName,
		            	nodeId : getGlobleParams().queryId,
		            	status : 'wait',
		            	t : new Date().getTime()
	                },
	                success : function(res){
	                    if(res ==200){
	                    	
	                        savesuccess();
	                        	                       
	                    }
	                   
	                },
	                error : function(){
	                    alert("删除失败！");
	                }
	            });
            }           
            else {
            	return false;
            }
        });
        /*------送审稿件--------*/
        $("#checkArticleBtn").on('click',function(){
            var ids = [],id,idstring,checkobx;
            var gbp = getGlobleParams();
            var tableId = gbp.tableId,tableName = gbp.tableName;
            checkobx = $("input[name='chk_row']:checked");
            if(!checkobx.length){
                alert("至少选择一条稿件!");
                return;
            }
            checkobx.each(function(){

                id = $(this).parent(".t-c").next().attr("data-id");
                var status = $("#"+id+"_status").text();
                if(status == '21'){
                	alert("请编辑后再发布!");
                	return true;
                }
                ids.push(id);
            });
            if(!ids.length)
            	return;
            idstring = ids.join(",");
            console.log(tableId+"--"+tableName);
            var url = ctx + "/content/tosignContent.htm";
            $.ajax({
                url : url,
                data : {
                	ids : idstring,
	            	tableId : tableId,
	            	tableName : tableName,
	            	t : new Date().getTime()
                },
                success : function(res){
                    if(res ==200){
                        savesuccess();
                    }
                   
                },
                error : function(){
                    alert("送审失败！请稍后重试~");
                }
            });
        });

        /*------发布稿件-----------------*/
        $("#pubArticleBtn").on('click',function(){
            var ids = [],id,idstring,checkobx;
            checkobx = $("input[name='chk_row']:checked");
            if(!checkobx.length){
                alert("至少选择一条稿件!");
                return;
            }
            checkobx.each(function(){

                id = $(this).parent(".t-c").next().attr("data-id");
                var status = $("#"+id+"_status").text();
                if(status == '21'){
                	alert("请编辑后再发布!");
                	return true;
                }
                ids.push(id);
            });
            if(!ids.length)
            	return;
            idstring = ids.join(",");
            var url = ctx + "/content/topublishContent.htm";
            $.ajax({
                url : url,
                data : {
                	ids : idstring,
                	nodeId : getGlobleParams().queryId,
	            	tableId : getGlobleParams().tableId,
	            	tableName : getGlobleParams().tableName,
	            	t : new Date().getTime()
                },
                success : function(res){
                    if(res ==200){
                        
                    	
                    	 savesuccess();
                    	
                    }
                   
                },
                error : function(data){
                	alert($.parseJSON(data.responseText)[0].result);
                }
            });
        });

        /*------多路发布----------------*/
        $("#morePubArticleBtn").on('click',function(){
            var  checkobx = $("input[name='chk_row']:checked");
            var tableId = getGlobleParams().tableId;
            var queryId = getGlobleParams().queryId;
            if(!checkobx.length){
                alert("至少选择一条稿件!");
                return false;
            }

            $('#morePubModel').modal({})&&$("#moretree-frame").attr("src",ctx + '/column/treenode.htm?type=7&tableId='+tableId+'&qid='+queryId);

        });
        /*------确定多路发布----------------*/
        $("#surePubBtn").on('click',function(){
            var nodes = $("#moretree-frame")[0].contentWindow.getcheckbox();
            var ids = [],id,idstring,checkobx;
            checkobx = $("input[name='chk_row']:checked");
            checkobx.each(function(){
                id = $(this).parent(".t-c").next().attr("data-id");
                var status = $("#"+id+"_status").text();
                if(status == '21'){
                	alert("请编辑后再发布!");
                	return true;
                }
                ids.push(id);
            });
            if(!ids.length)
            	return;
            idstring = ids.join(",");
            tablename = $("#unPublishTable").attr("table-name");
            tableid = $("#unPublishTable").attr("table-id");
            var url = ctx + "/content/topublishContent.htm";
           // console.log(url);

            $.ajax({
                url : url,
                data : {             	
                	ids : idstring,
                	queryIds : nodes,
                	nodeId : getGlobleParams().queryId,
	            	tableId : getGlobleParams().tableId,
	            	tableName : getGlobleParams().tableName,
	            	t : new Date().getTime()
                },
                success : function(res){
                    if(res ==200){
                        savesuccess();
                        $('#morePubModel').modal('hide');
                    }
                  
                },
                error : function(){
                    alert("发布失败！");
                    $('#morePubModel').modal('hide');
                }
            });

        });

});
