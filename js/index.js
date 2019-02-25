$(function () {

    // 将动态的高度动态赋值,使他滚动
    function  initstateHeight(){
       var stateheight=$('.getstateWrap').height()-$(".getwarter_top").height();
       $('.getwarter_bottomwrap').height(stateheight);
    }

    //点击关闭对应的弹框
    function closestate(){
        $('.getwarter_topImg').on("click",function () {
            let dom=this;
            $(dom).parents(".getwarter").css('display',"none");
        });
    }

    //展示动态
    $('.mystate').on('click',function () {
        $(".mystatetan").css("display","block");
        initstateHeight();
    })

    // 展示领水任务
    $('.myshuidi2').on('click',function () {
        $(".mygetwatertan").css("display","block");
    })

    //浇水的进度条变化
    var percentum=0;
    $(".myshuihu").on("click",function () {
        percentum+=(10/50)*100;
        console.log( percentum);
        $('.progresstiao').css("width",percentum+'%');
    })

    closestate();
})