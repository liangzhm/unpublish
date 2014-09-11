var cosSearch = {
    "my":{
        id:"mySearch",
        enable:false,
        action:""
    },
    "draft":{
        id:"draftSearch",
        enable:true,
        formId:"draftSearchForm",
        action:""
    },
    "draftSource":{
        id:"draftSourceSearch",
        formId:"draftSourceSearchForm",
        enable:true,
        action:""
    },
    "autoDraft":{
        id:"autoDraftSearch",
        formId:"autoDraftSearchForm",
        enable:true,
        action:""
    },
    "column":{
        id:"columnSearch",
        formId:"columnSearchForm",
        enable:true,
        action:""
    },
    "tpl":{
        id:"tplSearch",
        formId:"tplSearchForm",
        enable:true,
        action:""
    },
    selector: ".search-box",
    "limit":{
        id:"limitSearch",
        enable:true,
        action:""
    },
    hide : function(){
        $(this.selector).hide();
    },
    show : function(id){
        this.hide();
        $("#" + id).show();
        new sim_select($('.search-box:visible').find("#search-select").first().get(0));
    },
    updateType : function(searchId, type) {
        $('#' + searchId).find("[name=navType]").val(type || '');
    },
    updateNode : function($searchObj, nodeId){
        $searchObj.find("[name=nodeId]").val(nodeId || '');
    },
    updateParam : function($searchObj, name, value){
        $searchObj.find("[name=" + name + "]").val(value || '');
    },
    updateExpandedNode: function(value){
        $("#expendedNode").val(value);
    },
    getExpandedNode:function(){
        return $("#expendedNode").val();
    },
    clearKey:function($searchObj){
        $searchObj.find("[name='key']").val('');
    }
}
$(document).ready(function() {
    $("a[data-search]").click(function () {
        var channel = $(this).attr("data-search"),
            type = $(this).attr("data-type"),
            action = $(this).attr("data-action"),
            tree = $.trim($(this).attr("data-tree")),
            $tframe = $("#aside-frame");
            config = cosSearch[channel];
        if (config) {
            config.enable ? cosSearch.show.call(cosSearch, config.id) : cosSearch.hide.call(cosSearch);
            cosSearch.updateType.call(cosSearch, config.id, type);
            $("#" + config.formId).attr("action", action);
        }

        if(tree){
            if(tree === 'hide'){
                $("#asideMenu").hide();
                $("#mainWindow").addClass("no-margin");
            }else{
                $tframe.attr("src", tree);
                $("#asideMenu").show();
                $("#mainWindow").removeClass("no-margin");
            }
        }

        //$("#cosTopNav").trigger("update:node","8878");
    })

    $("#cosTopNav").bind("update:node",function(e,id){
        var $searchObj = $(cosSearch.selector + ':visible');
        cosSearch.updateNode.call(cosSearch, $searchObj, id);
    })
    $("#cosTopNav").bind("clear:key",function(e){
        var $searchObj = $(cosSearch.selector + ':visible');
        cosSearch.clearKey.call(cosSearch, $searchObj);
    })

    $("#cosTopNav").bind("update:param",function(e, name, value){
        var $searchObj = $(cosSearch.selector + ':visible');
        cosSearch.updateParam.call(cosSearch, $searchObj, name, value);
    })

    $("#cosTopNav").bind("update:expanded",function(e, value){
        cosSearch.updateExpandedNode.call(cosSearch, value);
    })
})


function searchByType(keyType){
	if(keyType==2){
		$("#tplSearchForm").attr("action", ctx+"/plugin/pluginManage.htm");
		$("#tplSearchForm").submit();
	}else if(keyType==3){
		$("#tplSearchForm").attr("action", ctx+"/tag/tagManage.htm");
		$("#tplSearchForm").submit();
	}else if(keyType==1){
		$("#tplSearchForm").attr("action", ctx+"/template/templateManage.htm");
		$("#tplSearchForm").submit();
	}
}

function searchByLimitType(keyType){
    if(keyType==2){
        $("#limitSearchForm").attr("action", ctx+"/role/list.htm");
        $("#limitSearchForm .search-int").attr("name","rn");
        $("#limitSearchForm").submit();
    }else if(keyType==1){
        $("#limitSearchForm").attr("action", ctx+"/user/list.htm");
        $("#limitSearchForm .search-int").attr("name","un");
        $("#limitSearchForm").submit();
    }
}

