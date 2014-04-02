/**
 * Created by Administrator on 14-3-5.
 * @author buhuan
 * jquery 扩展类
 **/

(function($){

    $.fn.extend({
	
		/**
         * 全选/取消全选
         * @param rel   包裹着需要全选的checkbox的rel扩展属性名
         * 对控制节点使用该方法
         */
        checkall:function(rel){

            $(this).click(function(){
                if(this.checked){
                    $("body").find("input[rel='"+rel+"']").each(function(){
                        this.checked = true;
                    });
                }else{
                    $("body").find("input[rel='"+rel+"']").each(function(){
                        this.checked = false;
                    });
                }
            });
        },

        /**
         * 文本框强制只能输入数字(仅支持整型)
         * (支持数组)
         * @param len 数字的长度(位数) 默认10
         * @param max 数字的最大值限制
         */
        form_validate_onlyNumbers:function(len,max){
            if(len == undefined)len = 10;
            if(max == undefined)max = 2147483657;
            $(this).each(function(){
                var element = $(this);
                $(this).keydown(function(e){

                    var evt = e || window.event;
                    if( (
                        evt.keyCode < 48
                            || (evt.keyCode >57 && evt.keyCode < 96)
                            || evt.keyCode > 105
                            || element.val().length >= len
                            || parseInt(element.val()+"7") >= max
                            || element.val().substr(0,1) == '0'
                        )
                        && evt.keyCode != 8 && evt.keyCode != 9 && evt.keyCode != 46 && evt.keyCode != 37 &&  evt.keyCode != 39
                        ){
                        element.empty();
                        evt.preventDefault();
                        return false;
                    }
                });
            })
        },

        /**
         * 去除文本框字串里所有的空格 并返回处理后的字符串
         * (只支持单个文本框)
         */
        form_validate_trimVal:function(){
            if($(this).length > 1){
                alert('此方法只支持单个HTML元素');
                return;
            }

            var val = $(this).val().replace(/\s+/g,'');
            return val;
        }
    });


    $.extend({
		  browser:{
				  screen_width:function(){
					  return $(window).width();
				  },
				  screen_height:function(){
					  return $(window).height();
				  },
				  page_width:function(){
					  return $(document).width();
				  },
				  page_height:function(){
					  return $(document).height();
				  },
				  scroll_top:function(){
					  return $(document).scrollTop();
				  },
				  scroll_left:function(){
					  return $(document).scrollLeft();
				  }
         },
        /**
         * 将html字符串转换为jquery对象
         * @param str
         * @returns {*}
         */
        strToDom:function(str){
            var tempdiv = $('<div>');
            tempdiv.html(str);
            return tempdiv.children().eq(0);
        },

        in_array:function(val,array){
            var is_in_array = false;
            for(var i = 0; i < array.length; i++){
                if(array[i] == val){
                    is_in_array = true;break;
                }
            }
            return is_in_array;
        },

        /**
         * 去除数组的重复元素  只适用一维数组 1,2,1
         */
        array_unique:function(array){
              var single_array = [];//存放不重复的元素
              var repeat_array = []; //存放重复的元素
              for(var i = 0 ; i < array.length; i++){
                  var count = 0;
                  for(var k = 0 ; k < array.length ; k++){
                      if(array[i] == array[k])count++;
                  }
                  if(count > 1 && !$.in_array(array[i],repeat_array)){
                      repeat_array.push(array[i]);
                  }
                  else if(count <= 1) single_array.push(array[i]);
              }

              for(var i in repeat_array){
                  single_array.push(repeat_array[i]);
              }

              return single_array;
        }

        ,
        /**
         * 基于jquery-ui弹窗的提示框
         * @param message  要弹出的消息
         * @returns {*}
         */
        alert:function(message,width,height){
            if(width == undefined) width = 200;
            if(height == undefined) height = 100;
            var msg_div = $("#dialog_msg");
            if(msg_div[0] === undefined){//判断元素是否存在
                var msg_str = '<div id="dialog_msg"><center><p><b>xxxx</b></p></center></div>';
                msg_div = $.strToDom(msg_str);
                $("body").append(msg_div);
            }

            $("#dialog_msg").find('b').html(message);
            $("#dialog_msg").dialog({modal:true,width:width,height:height,title:"消息"});

            return this;
        }

        ,
        /**
         * 从json数组中删除key的值为value的对象
         * @param key   要查找的值的key
         * @param value 要对比的key的值
         * @param json  json数组
         * @return json 返回删除后的json数组
         */
        delete_Json_Object_By_Key_Value:function(key,value,json){
            $(json).each(function(index){
                if(this[key] == value){
                    json.splice(index,1);
                    return false;
                }
            })
            return json;
        },

        /**
         * 从json数组中取出键为key值为value的那一个对象
         * @param key
         * @param value
         * @param jsonArray
         * @return Object
         */
        fetch_Json_Object_By_Key_Value:function(key,value,jsonArray){
            var obj = null;
            $(jsonArray).each(function(index){
                if(this[key] == value){
                    obj = this;
                }
            })
            return obj;
        }

        ,
        /**
         * 克隆 JSON
         * @param para
         * @returns {*}
         */
        cloneJSON: function(para){
            var rePara = null;
            var type = Object.prototype.toString.call(para);
            if(type.indexOf("Object") > -1){
                rePara = jQuery.extend(true, {}, para);
            }else if(type.indexOf("Array") > 0){
                rePara = [];
                jQuery.each(para, function(index, obj){
                    rePara.push(jQuery.cloneJSON(obj));
                });
            }else{
                rePara = para;
            }
            return rePara;
        }
        ,

        /**
         * 对比字符串
         * @param str1 String  字符串1
         * @param str2 String  字符串2
         * @param trim Boolean 是否去掉所有空格
         * @return Boolean
         */
        strcmp:function(str1,str2,trim){
            if(this.is_empty(trim))
                trim = true;

            switch(trim){
                case true:
                    return str1.replace(/\s+/g,'') == str2.replace(/\s+/g,'');

                case false:
                    return str1 == str2;
                default:
            }
        },

        /**
         * 验证是否是数字
         * @param param
         * @returns {boolean}
         */
        is_numberic:function(param){
            if(/\d+/g.test(param))
                return true;
            return false;
        },

        /**
         * 对比最大长度
         * @param param
         * @param length
         * @returns {boolean}
         */
        max_length:function(param,length){
            if(param.length <= length)
                return true;
            return false;
        },

        /**
         * 对比最小长度
         * @param param
         * @param length
         * @returns {boolean}
         */
        min_length:function(param,length){
            if(param.length >= length)
                return true;
            return false;
        },

        /**
         * 对比最大值
         * @param param
         * @param maxvalue
         * @returns {boolean}
         */
        max_value:function(param,maxvalue){
            if(parseInt(param) <= parseInt(maxvalue))
                return true;
            return false;
        },

        /**
         * 对比最小值
         * @param param
         * @param minvalue
         * @returns {boolean}
         */
        min_value:function(param,minvalue){
            if(parseInt(param) >= parseInt(minvalue))
                return true;
            return false;
        },


        /**
         * 验证是否是邮箱格式
         * @param param
         * @returns {boolean}
         */
        is_email:function(param){
            var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if ( emailReg.test(param) )
                return true;
            return false;
        },

        /**
         * 验证是否是手机
         * @param param
         * @returns {boolean}
         */
        is_phone:function(param){
            var pattern=/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
            if(pattern.test(param))
                return true;
            return false;
        },

        /**
         * 验证是否是身份证
         * @param param
         * @returns {boolean}
         */
        is_idcard:function(param){
            if( !(/^\d{15}$/.test(param)|| /^\d{18}$/.test(param)|| /^\d{17}[xX]$/.test(param)) )
                return false;
            return true;
        },

        /**
         * 验证是否为空
         * @param param
         * @returns {boolean}
         */
        is_empty:function(param){
            if(param == null || param == '' || param == undefined || param == 'null')
                return true;
            return false;
        },

        /**
         * 验证是否是URL格式
         * @param str_url
         * @returns {boolean}
         * @constructor
         */
        IsURL : function(str_url){
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
                + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                + "|" // 允许IP和DOMAIN（域名）
                + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                + "[a-z]{2,6})" // first level domain- .com or .museum
                + "(:[0-9]{1,4})?" // 端口- :80
                + "((/?)|" // a slash isn't required if there is no file name
                + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re=new RegExp(strRegex);
            //re.test()
            if (re.test(str_url)){
                return (true);
            }else{
                return (false);
            }
        },


        /**
         * 时间戳转日期
         * @param time int 时间戳
         * @param formatString YYYY-MM-DD | YYYY-MM-DD HH:NN:SS
         */
        d_timeToDate:function(time,formatString){
            if(formatString == undefined) formatString = 'YYYY-MM-DD';

            var dateString = null;

            time = new Date(time * 1000);//php的时间戳在javascript中需要乘以1000以后再来进行转换
            var year = time.getFullYear();
            var month = time.getMonth()+1;
            var day = time.getDate();
            var hour = time.getHours();
            var minute = time.getMinutes();
            var second = time.getSeconds();

            switch(formatString){
                case 'YYYY-MM-DD' :
                    dateString = year + '-' + month + '-' + day ;
                    break;

                case 'YYYY-MM-DD HH:NN:SS':
                    dateString = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                    break;
                default:break;
            }

            return dateString;
        },


        /**
         * @param date String : 格式必须是 YYYY-MM-DD HH:NN:SS
         * @return int
         * **/
        d_dateToTime:function(date){
            var time_array = [],date_array = [];
            var _date = date.split(' ');
            var date_prefix = _date[0];
            if(_date.length > 1){
                var date_ext = _date[1];
                date_array = date_prefix.split('-');
                time_array = date_ext.split(':');
                return new Date(date_array[0],date_array[1]-1,date_array[2],time_array[0],time_array[1],time_array[2]).getTime();
            }else{
                date_array = date_prefix.split('-');
                return new Date(date_array[0],date_array[1]-1,date_array[2]).getTime();
            }
        },

        /**
         * 得到2个时间戳之间的年限差
         * @param time_small 起始时间
         * @param time_big 结束时间
         * @return int
         */
        d_timediff_year:function(time_small,time_big){
            var timediff = time_big - time_small;
            var yearTime = 60 * 60 * 24 * 365 * 1000;
            return Math.floor(timediff/yearTime);
        }

    });
})(jQuery)



