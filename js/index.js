$(function () {
    var ChoosedSid;      //选中的种子id
    var uid=getUrlParam('uid');
    var userstate;        //用户的初始状态
    var curwatervolume;     //用户的水量
    var treestage;

    console.log(uid);
    //页面渲染种子
    function getseed() {
        var str="";
        axios.get(apiurl+"/ishop-user/seed/getAllForSelect")
            .then((res)=>{
                var SeedList=res.data.extend.seeds;
                SeedList.forEach((ele,index)=>{
                    str+=`<div class="chooserootboxitem" data-sid=${ele.sid}>
                               <img src=${imgurl}${ele.spic0} alt="">
                               <div class="chooserootboxitem_word">${ele.sname}</div>
                          </div>`;
                });
                $(".chooserootbox").html(str);
                //初始化要提交的数据
                ChoosedSid= $(".chooserootboxitem").eq(0).attr("data-sid");
                $(".chooserootboxitem").eq(0).children(".chooserootboxitem_word").addClass("onactive");
            })
            .catch(function (error) {
                showToast({
                    text: '请求错误', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                    bottom: '50%', //toast距离页面底部的距离
                    zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                    speed: 500, //toast的显示速度
                    time: 5000 //toast显示多久以后消失
                });
            });
    }

    //点击选取种子
    $(".chooserootbox").on("click",".chooserootboxitem",function () {
        ChoosedSid=$(this).attr("data-sid");
        console.log(ChoosedSid);
        $(this).siblings().children(".chooserootboxitem_word").removeClass('onactive');
        $(this).children(".chooserootboxitem_word").addClass('onactive');

    })


    //点击立即植树，提交结果
    $('.okchooseworld').on("click",function () {
        let data = new FormData();
        data.append('uid',uid);
        data.append('sid',ChoosedSid);
        axios.post(apiurl+"/ishop-user/orchard/selectSeed",data)
            .then((res)=>{
                console.log(res);
                if(res.data.code==100){
                    $(".bigwrap").css("display","block");
                    $('.bigbox').css("display","none");
                    initgarden();
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

    // 将动态的高度动态赋值,使他滚动
    function  initstateHeight(){
       var stateheight=$('.getstateWrap').height()-$(".getwarter_top").height();
       $('.getwarter_bottomwrap').height(stateheight);
    }

    //点击关闭对应的弹框
    $('.getwarter_topImg').on("click",function () {
            let dom=this;
            $(dom).parents(".getwarter").fadeOut("slow");
    });

    //展示动态
    $('.mystate').on('click',function () {
        // $(".mystatetan").css("display","block");
        $(".mystatetan").fadeIn("slow");
        initstateHeight();
        console.log("动态");
        axios.get(apiurl+'/ishop-user/dynamic/getAllByUid',{
            params:{
                uid:uid,
            }
        })
            .then((res)=>{
               console.log(0);
               let str2="";
               res.data.extend.dynamicStrings.forEach((ele,index)=>{
                   str2+=`<div class='state_bottom'>
                            <div class='state_bottomtitle'>${ele.date}</div>`
                   ele.threeStrings.forEach((element,index)=>{
                       str2+=`<div class='state_bottomcon'>
                                <img class='state_bottomconImg' src='http://img0.imgtn.bdimg.com/it/u=4117698333,1699709581&fm=26&gp=0.jpg' mode="aspectFit"></img>
                                <div class='state_bottomconsay'>
                                    <div class='state_bottomconsayT'>${element.thing}</div>
                                    <div class='state_bottomconsayB'>${element.time}</div>
                                </div>
                            </div>`
                   });
                   str2+=`</div>`;
               });

               $('.getwarter_bottom1').html(str2);
               console.log("动态加载完毕")

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

    // 展示领水任务
    $('.myshuidi2').on('click',function () {
        // $(".mygetwatertan").css("display","block");
        $(".mygetwatertan").fadeIn("slow");
    })

    //浇水的进度条变化
    var percentum=0;
    $(".myshuihu").on("click",function () {
        if(curwatervolume<10){
            showToast({
                text: '您当前水量不足', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                bottom: '50%', //toast距离页面底部的距离
                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                speed: 500, //toast的显示速度
                time: 5000 //toast显示多久以后消失
            });
            return;
        }


        if(treestage==6){
            showToast({
                text: '恭喜您种植成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                bottom: '50%', //toast距离页面底部的距离
                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                speed: 500, //toast的显示速度
                time: 5000 //toast显示多久以后消失
            });
            return;
        }


        let data = new FormData();
        data.append('uid',uid);
        //去浇水
        axios.post(apiurl+'/ishop-user/orchard/watering',data)
            .then((res)=>{
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
                        text: '恭喜您种植成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                        bottom: '50%', //toast距离页面底部的距离
                        zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                        speed: 500, //toast的显示速度
                        time: 5000 //toast显示多久以后消失
                    });
                }else{
                    $('.progressboxImgtext').text(res.data.extend.remainWaterCount);
                    curwatervolume=res.data.extend.orchard.curwatervolume;
                    $('.myshuihuworld').text(curwatervolume+'L');
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
    });

    //点击抽奖跳转
    $('.myshuidi3').on("click",function () {
        window.location.href="DrawPrize.html?uid="+uid;
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


    $(".daygetwater").on("click",function () {
        console.log("fenxiang");
        call('wechatFriend');

    })


    //微信的分享
    var nativeShare = new NativeShare()
    var shareData = {
        title: '快来和我一起免费领水果吧！',
        desc: '每日领水滴，免费水果送到家',
        // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
        link: 'https://github.com/fa-ge/NativeShare',
        icon: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1197142301,884753568&fm=26&gp=0.jpg',
        // 不要过于依赖以下两个回调，很多浏览器是不支持的
        success: function() {
            alert('success');
        },
        fail: function() {
            alert('fail');
        }
    }
    nativeShare.setShareData(shareData)
    console.log(nativeShare);

    function call(command) {
        console.log("分享开始");
        try {
            nativeShare.call(command)
        } catch (err) {
            // 如果不支持，你可以在这里做降级处理
            alert(err.message);
        }
    }




    //对果园的初始化
    function  initgarden(){
        let data = new FormData();
        data.append('uid',uid);
        data.append('pageSize',100);

        axios.post(apiurl+"/ishop-user/orchard/create",data)
            .then((res)=>{
                console.log(res);
                if(res.data.code==100){
                    userstate=res.data.extend.orchard.stage;
                    if(userstate==0){          //用户未选择种子
                        console.log(1);
                        $(".bigwrap").css("display","none");
                        $('.bigbox').css("display","block");
                        getseed();
                    }else{
                        $(".bigwrap").css("display","block");
                        $('.bigbox').css("display","none");
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

                        //水量
                        curwatervolume=res.data.extend.orchard.curwatervolume;
                        $('.myshuihuworld').text(curwatervolume+'L');

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
                                text: '恭喜您种植成功', //【必填】，否则不能正常显示 , 剩余的其他不是必填
                                bottom: '50%', //toast距离页面底部的距离
                                zindex: 9999, //为了防止被其他控件遮盖，z-index默认为2
                                speed: 500, //toast的显示速度
                                time: 5000 //toast显示多久以后消失
                            });
                        }
                        else{
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
    }

    initgarden();

})