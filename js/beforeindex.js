$(function () {


    var ChoosedSid;      //选中的种子id
    var uid=getUrlParam('uid');

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
                 $(".chooserootboxitem").eq(0).children(".chooserootboxitem_word").addClass("onactive");
             })
             .catch(function (error) {
                console.log(error);
             });
    }
    getseed();   //执行上面的函数

    //点击选取种子
    $(".chooserootbox").on("click",".chooserootboxitem",function () {
        ChoosedSid=$(this).attr("data-sid");
        console.log(ChoosedSid);
        $(this).siblings().children(".chooserootboxitem_word").removeClass('onactive');
        $(this).children(".chooserootboxitem_word").addClass('onactive');



    })


    //点击立即植树，提交结果
    $('.okchooseworld').on("click",function () {
        console.log(1);
        axios.post(apiurl+"/ishop-user/orchard/selectSeed",{
            uid:uid,
            sid:ChoosedSid
            })
            .then((res)=>{
            console.log(res);
                if(res.data.code==100){
                    $(".bigwrap").css("display","block");
                    $('.bigbox').css("display","none");
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        //
        // $(".bigwrap").css("display","block");
        // $('.bigbox').css("display","none");

    })














})