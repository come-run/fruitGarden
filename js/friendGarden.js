$(function () {
    //对果园的初始化
    var fuid=getUrlParam('fuid');     //好友的id
    var uid=getUrlParam('uid')        //自己的id
    var userstate;                    //用户的种子
    var curwatervolume;                //朋友的水量
    var hostcurwatervolume;             //主用户的水量
    var remainrobwatercount;          //抢水次数
    var  remainwateringcount;         //浇水次数
    function  initgarden(){
        let data = new FormData();
        data.append('uid',fuid);
        data.append('pageSize',100);
        data.append('hostUid',uid);


        axios.post(apiurl+"/ishop-user/orchard/create",data)
            .then((res)=>{
                console.log(res);
                if(res.data.code==100){
                    userstate=res.data.extend.orchard.stage;
                        if(userstate==1){
                            $('.TreevieoimgNew').attr("src","zhongzi");
                        }else if(userstate==2){
                            $('.TreevieoimgNew').attr("src","幼苗");
                        }else if(userstate==3){
                            $('.TreevieoimgNew').attr("src","成树");
                        }else if(userstate==4){
                            $('.TreevieoimgNew').attr("src","开花");
                        }else if(userstate==5){
                            $('.TreevieoimgNew').attr("src","结果");
                        }else if(userstate==6){
                            $('.TreevieoimgNew').attr("src","成熟");
                        }
                        //获取好友
                       getfriend();

                        //水量
                        // curwatervolume=res.data.extend.orchard.curwatervolume;
                        // $('.myshuihuworld').text(curwatervolume+'L');

                        //浇水的提示语
                        treestage=res.data.extend.orchard.stage;
                        if(res.data.extend.orchard.stage==5){
                            console.log(0);
                            if($(".progressboxImg")){
                                $('.progressboxImgwrap').prepend("<img class='progressboxImg' src='img/guoyuan/progress.png' >")
                            }
                            let curwatercount=res.data.extend.orchard.curwatercount;
                            let percentum=0;
                            if(curwatercount<17){
                                percentum=curwatercount*1.56+percentum;
                                $('.progresstiao').css("width",percentum+'%');
                            }
                            if(curwatercount>16 && curwatercount<33){
                                percentum+=24.96;
                                percentum=curwatercount*1.25+percentum;
                                $('.progresstiao').css("width",percentum+'%');
                            }
                            if(curwatercount>32 && curwatercount<49){
                                percentum+=44.96;
                                percentum=curwatercount*0.62+percentum;
                                $('.progresstiao').css("width",percentum+'%');
                            }
                            if(curwatercount>48 && curwatercount<65){
                                percentum+=54.88;
                                percentum=curwatercount*0.62+percentum;
                                $('.progresstiao').css("width",percentum+'%');
                            }
                            if(curwatercount>64 && curwatercount<81){
                                percentum+=64.8;
                                percentum=curwatercount*0.31+percentum;
                                $('.progresstiao').css("width",percentum+'%');
                            }
                            if(curwatercount>80 && curwatercount<433){
                                percentum+=65.76;
                                percentum=curwatercount*0.076+percentum;
                                console.log(percentum);
                                $('.progresstiao').css("width",percentum+'%');
                            }
                        }else if(res.data.extend.orchard.stage==6){
                            if($(".progressboxImg")){
                                $('.progressboxImgwrap').prepend("<img class='progressboxImg' src='img/guoyuan/progress.png' >")
                            }
                            $('.progresstiao').css("width",101+'%');
                            $('.progressboxImgtext').text(res.data.extend.remainWaterCount);
                            showToast({
                                text: '他已经种植成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                                bottom: '50%', //toast距离页面底部的距离
                                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                                speed: 500, //toast的显示速度
                                time: 5000 //toast显示多久以后消失
                            });
                        }
                        else{
                            console.log(456);
                            $('.progressboxImgtext').text(res.data.extend.remainWaterCount);
                        }

                    //遍历广告
                    res.data.extend.harvestRecords.forEach((element,index)=>{
                        let str3=`<li>
                                            <img class='garedTopInfoimg' src=${imgurl}+${element.userPic}>
                                            <span class='garedTopInfoword'>${element.record}</span>
                                        </li>`
                        $(".garedTopInfo ul").append(str3);
                    })

                    //广告滚动
                    var time = setInterval(function () {
                        timer(".garedTopInfo");
                    }, 4000); //新闻列表滚动
                    $('.garedTopInfo ul').find('li').mousemove(function() {
                        clearInterval(time);
                    }).mouseout(function() {
                        time = setInterval(function () {
                            timer(".garedTopInfo")
                        }, 4000);
                    });





                    }
            })
            .catch((error)=>{
                showToast({
                    text: '请求朋友数据出错错误', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                    bottom: '50%', //toast距离页面底部的距离
                    zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                    speed: 500, //toast的显示速度
                    time: 5000 //toast显示多久以后消失
                });
            })
    }

    initgarden();

    //点击返回我的果园
    $('.mygarden').on("click",function () {
        console.log(3);
        window.location.href="index.html?uid="+uid;

    })

    //点击好友跳转
    $(".friendlistScroll").on("click",'.friendlistitem',function () {
        let fuid=$(this).attr("data-fuid");
        //friendGarden.html
        window.location.href="friendGarden.html?fuid="+fuid+"&uid="+uid;
    })


    //广告的轮播
    function timer(opj) {
        $(opj).find('ul').animate({
            top:"-0.45rem"
        }, 500, function() {
            $(this).css({
                top:"0"
            }).find("li:first").appendTo(this);
        })
    }

    //对好友列表的操作
    function getfriend() {
        let data = new FormData();
        data.append('uid',uid);
        data.append('pageSize',100);
        axios.post(apiurl+"/ishop-user/orchard/create",data)
            .then((res)=>{
                console.log(res);
                if(res.data.code==100){
                    remainrobwatercount=res.data.extend.orchard.remainrobwatercount;
                    remainwateringcount=res.data.extend.orchard.remainwateringcount;
                    hostcurwatervolume=res.data.extend.orchard.curwatervolume;
                        let str1=""
                        res.data.extend.friends.forEach((ele,index)=>{
                            console.log(1);
                            str1+=`<div class='friendlistitemwrap'>
                                        <div class='friendlistitem' data-fuid=${ele.fuid}>
                                            <img class='friendlistitemImg' src=${imgurl}+${ele.fupic} >
                                            <span class='friendlistitemword'>${ele.funame}</span>
                                        </div>
                                    </div>`;
                        })
                        str1+= `<div class='friendlistitemwrap'>
                                    <div class='friendlistitem'>
                                        <img class='friendlistitemImg' src='img/guoyuan/addfriend.png' aspectFill="aspectFill">
                                        </img>
                                        <span class='friendlistitemword'>添加好友</span>
                                    </div>
                                </div>`
                        $('.friendlistScroll').html(str1);

                    }
            })
            .catch((error)=>{

                showToast({
                    text: '请求主用户的数据错误', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                    bottom: '50%', //toast距离页面底部的距离
                    zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                    speed: 500, //toast的显示速度
                    time: 5000 //toast显示多久以后消失
                });
            })
    }

    //抢水
    $('.myshuidi3').on("click",function () {
        if(remainrobwatercount<=0){
            showToast({
                text: '您的抢水次数已用完！', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                bottom: '50%', //toast距离页面底部的距离
                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                speed: 500, //toast的显示速度
                time: 5000 //toast显示多久以后消失
            });

            return;
        }
        let data = new FormData();
        data.append('uid',fuid);
        data.append('hostUid',uid);
       axios.post(apiurl+"/ishop-user/orchard/robwater",data)
           .then((res)=>{
               console.log(res);
               if(res.data.code==100){
                   showToast({
                       text: '成功抢水10L', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                       bottom: '50%', //toast距离页面底部的距离
                       zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                       speed: 500, //toast的显示速度
                       time: 5000 //toast显示多久以后消失
                   });
                   remainrobwatercount=res.data.extend.Remainrobwatercount;

                   //水量
                   curwatervolume=res.data.extend.friendwatercount;
                   $('.myshuihuworld').text(curwatervolume+'L');

               }else{
                   showToast({
                       text: res.data.extend.msg, //【必填】，否则不能正常显示 , 剩余的其他不是必填
                       bottom: '50%', //toast距离页面底部的距离
                       zindex: 9999, //请求错误为了防止被其他控件遮盖，z-index默认为2
                       speed: 500, //toast的显示速度
                       time: 5000 //toast显示多久以后消失
                   });
               }

           })
           .catch((error)=>{
               showToast({
                   text: '请求错误', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                   bottom: '50%', //toast距离页面底部的距离
                   zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                   speed: 500, //toast的显示速度
                   time: 5000 //toast显示多久以后消失
               });
           })
    })


    //浇水
    $('.myshuihu').on("click",function () {
        if(remainwateringcount<=0){
            showToast({
                text: '您的浇水次数已用完', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                bottom: '50%', //toast距离页面底部的距离
                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                speed: 500, //toast的显示速度
                time: 5000 //toast显示多久以后消失
            });
            return;
        }

        if(hostcurwatervolume<=10){
            showToast({
                text: '您的水量不足！', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                bottom: '50%', //toast距离页面底部的距离
                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                speed: 500, //toast的显示速度
                time: 5000 //toast显示多久以后消失
            });

            return;
        }
        let data = new FormData();
        data.append('uid',fuid);
        data.append('hostUid',uid);
        axios.post(apiurl+'/ishop-user/orchard/watering',data)
            .then((res)=>{
                console.log(res);
                if(res.data.code==100){
                    showToast({
                        text: '浇水成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                        bottom: '50%', //toast距离页面底部的距离
                        zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                        speed: 500, //toast的显示速度
                        time: 5000 //toast显示多久以后消失
                    });
                    if(res.data.extend.orchard.stage==5){
                        if($(".progressboxImg")){
                            $('.progressboxImgwrap').prepend("<img class='progressboxImg' src='img/guoyuan/progress.png' >")
                        }
                        let curwatercount=res.data.extend.orchard.curwatercount;
                        let percentum=0;
                        if(curwatercount<17){
                            percentum=curwatercount*1.56+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }
                        if(curwatercount>16 && curwatercount<33){
                            percentum+=24.96;
                            percentum=curwatercount*1.25+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }
                        if(curwatercount>32 && curwatercount<49){
                            percentum+=44.96;
                            percentum=curwatercount*0.62+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }
                        if(curwatercount>48 && curwatercount<65){
                            percentum+=54.88;
                            percentum=curwatercount*0.62+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }
                        if(curwatercount>64 && curwatercount<81){
                            percentum+=64.8;
                            percentum=curwatercount*0.31+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }
                        if(curwatercount>80 && curwatercount<433){
                            percentum+=65.76;
                            percentum=curwatercount*0.076+percentum;
                            $('.progresstiao').css("width",percentum+'%');
                        }

                        curwatervolume=res.data.extend.orchard.curwatervolume;
                        $('.myshuihuworld').text(curwatervolume+'L');

                    }else if(res.data.extend.orchard.stage==6){
                        if($(".progressboxImg")) {
                            $('.progressboxImgwrap').prepend("<img class='progressboxImg' src='img/guoyuan/progress.png' >")
                        }
                        $('.progresstiao').css("width",100+'%');
                        $('.progressboxImgtext').text(res.data.extend.remainWaterCount);
                        showToast({
                            text: '他的果树种植成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                            bottom: '50%', //toast距离页面底部的距离
                            zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                            speed: 500, //toast的显示速度
                            time: 5000 //toast显示多久以后消失
                        });
                    }else{
                        $('.progressboxImgtext').text(res.data.extend.remainWaterCount);
                        // curwatervolume=res.data.extend.orchard.curwatervolume;
                        // $('.myshuihuworld').text(curwatervolume+'L');
                    }

                    remainwateringcount=res.data.extend.hostUserRemainWateringCount
                }else{
                    showToast({
                        text: res.data.extend.msg, //【必填】，否则不能正常显示 , 剩余的其他不是必填
                        bottom: '50%', //toast距离页面底部的距离
                        zindex: 9999, //请求错误为了防止被其他控件遮盖，z-index默认为2
                        speed: 500, //toast的显示速度
                        time: 5000 //toast显示多久以后消失
                    });
                }
            })
            .catch((error)=>{
                showToast({
                    text: '请求错误', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                    bottom: '50%', //toast距离页面底部的距离
                    zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                    speed: 500, //toast的显示速度
                    time: 5000 //toast显示多久以后消失
                });
            })
    })
})