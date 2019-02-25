$(function () {

    //声明一个对象lottery
    var lottery={
        index:-1,    //当前转动到哪个位置，起点位置
        count:0,    //总共有多少个位置
        timer:0,    //setTimeout的ID，用clearTimeout清除
        speed:20,    //初始转动速度
        times:0,    //转动次数
        cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize:-1,    //中奖位置

        init:function(id){
            if ($("#"+id).find(".myactprizeitem").length>0) {
                console.log($("#" + id));
                $lottery = $("#"+id);
                $units = $lottery.find(".myactprizeitem");
                this.obj = $lottery;
                this.count = $units.length;
                console.log(this.count);
                $lottery.find(".prizeitem-"+this.index).addClass("active");
            };
        },
        roll:function(){
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find(".prizeitem-"+index).removeClass("active");
            index += 1;
            if (index>count-1) {
                index = 0;
            };
            $(lottery).find(".prizeitem-"+index).addClass("active");
            this.index=index;
            return false;
        },
        stop:function(index){
            this.prize=index;
            return false;
        }
    };

    function roll(){
        lottery.times += 1;
        console.log(lottery.index);
        lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
        if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
            console.log("9")
            clearTimeout(lottery.timer);
            lottery.prize=-1;
            lottery.times=0;
            click=false;
        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {
                console.log(lottery.count);
                var index = Math.random()*(lottery.count)|0;
                lottery.prize = index;
                console.log("使他",lottery.prize);
            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 110;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
            lottery.timer = setTimeout(roll,lottery.speed);//循环调用
        }
        return false;
    }

    var click=false;
    // 函数正式运行
    lottery.init("myactprize");

   // 点击抽奖时
   $(".myclickRun").on("click",function () {
       if (click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
           return false;
       }else{
           lottery.speed=100;
           roll();    //转圈过程不响应click事件，会将click置为false
           click=true; //一次抽奖完成后，设置click为true，可继续抽奖
           return false;
       }
   })


})