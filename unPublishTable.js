/**
 * Created by liangzhimin@chinaso.com on 2014/5/20.
 */

(function(){

         function InsertToTable(){
            this.cfg = {
                id : '',
                title : '',
                style : '',
                time : '',
                author : '',
                singer : '',
                source : ''
            };
         }
         InsertToTable.oo={
        render:function(obj){

        }
    };
         InsertToTable.prototype = {
            init : function(cfg,r){
                var CFG = $.extend(this.cfg,cfg);
                var row = $('<tr class=""><td class="t-c"><input type="checkbox" value="" name="chk_row" class="checkbox_style"></td>'+
                '<td data-id='+CFG._id+'><a target="_blank" title="预览" href='+CFG.SourceUrl+'>'+CFG.TitleCN+'<span class="ispan"></span></a></td><td>'+CFG.SourceName+'</td><td>'+CFG.SourceTypeName+'</td><td>'+CFG.CreatedAt+'</td><td>'+CFG.OperatorID+
                '</td><td style="display:none" id='+CFG._id+"_draftStyle"+'>'+CFG.DraftStyle+'</td><td style="display:none" id='+CFG._id+"_titleCN"+'>'+CFG.TitleCN+'</td><td style="display:none" id='+CFG._id+"_sourceUrl"+'>'+CFG.SourceUrl+'</td><td style="display:none" id='+CFG._id+"_sourceType"+'>'+CFG.SourceType+
                    '</td><td style="display:none" id='+CFG._id+"_titleEN"+'>'+CFG.TitleEN+'</td><td style="display:none" id='+CFG._id+"_status"+'>'+CFG.Status+'</td><td style="display:none" id='+CFG._id+"_author"+'>'+CFG.Author+'</td><td style="display:none" id='+CFG._id+"_tableName"+'>'+CFG.TableName+
                    '</td><td style="display:none" id='+CFG._id+"_source"+'>'+CFG.Source+ '</td><td style="display:none" id='+CFG._id+"_sourceName"+'>'+CFG.SourceName+'</td><td style="display:none" id='+CFG._id+"_previewImage"+'>'+CFG.PreviewImage+
                    '</td><td style="display:none" id='+CFG._id+"_summary"+'>'+CFG.Summary+'</td><td style="display:none" id='+CFG._id+"_tableId"+'>'+CFG.TableId+'</td><td style="display:none" id='+CFG._id+"_sortNum"+'>'+CFG.SortNum
                +'</td></tr>');
                
                var TableId = CFG.TableId;
                return {
                	row : row,
                	tableId : TableId
                };
            }
         };


         $.fn.publishedTable = function (str,tb){
        	 tb.html("");
            
             if(str&&tb){

                for(var r=0;r<str.length;r++){

                    var row = new InsertToTable().init(str[r],r+1);
                    var st = row.tableId;
                    //console.log(st)
                    if(st==2){//新闻稿
                    	row.row.find(".ispan").addClass('inews');
                    }
                    else if(st==1){
                    	//图片稿
                    	row.row.find(".ispan").addClass('iimage');
                    }
                    tb.append(row.row);
                }
             }
        };

}());
