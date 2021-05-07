// 初始化 Vue 实例
new Vue({
    el: '#app',
    data: {
        default_url: api,
        ajaxData:{
            uid:'200080',
            token:'28c3857305da28b95f20718caa987462',
            lang:'en'
        },
        bar:1,
        rankBar:2,
        tipsText:'',
        taskCon:{},
        award_cfg:[],
        recordList:[],
        taskList:[{status:0}],
        rcostlist:[{userRank:3 ,appface:'img/1.png',nickname:'kkk',num:3333,level:6,value:1234},],
        costlist:[{userRank:4 ,appface:'img/1.png',nickname:'kkk',num:3333,level:6,value:1234},],
        myInfo:{rank:1,appface:'img/1.png',nickname:'kkk',myValue:1234,sex:1},
        award:{},
        times:1,//转盘次数
        canTrunTable:true,
    },
    created:function() {
        var uid = getQueryString('uid')
        var token = getQueryString('token')
        this.ajaxData.uid = uid
        this.ajaxData.token = token
        this.getRank()
        this.getTask()
    },
    methods: {
        girlCharm:function(level){
            return level>=0&&level<20?'0-19':level>=20&&level<40?'20-39':
                level>=40&&level<60?'40-59':level>=60&&level<80?'60-79':
                    level>=80&&level<=100?'80-100':''
        },
        boyEnergy:function(level){
            return level>=0&&level<10?'0-9':level>=10&&level<=20?'10-20':
                level>20&&level<30?'21-29':level>=30&&level<40?'30-39':
                    level>=40&&level<50?'40-49':level>=50&&level<60?'50-59':
                        level>=60&&level<70?'60-69':level>=70&&level<80?'70-79':
                            level>=80&&level<90?'80-89':level>=90&&level<=100?'90-100':''
        },
        changeRank:function(index){
            this.rankBar = index
        },
        changeBar:function(index){
            this.bar = index
        },
    //     getWork2021RankData uid 获取排行榜
    //     event/getWork2021List     uid   获取任务列表
    // event/getWorkAwardRecordList uid  获取领取记录
        getRank:function(){
            var that = this
            $.ajax({
                url: that.default_url + "/event/getWork2021RankData",
                type: "POST",
                data: that.ajaxData,
                dataType: "json",
                success: function(data) {
                    console.log(data)
                    if(data.code==1){
                        that.rcostlist = data.data.total.rcost_list
                        that.costlist = data.data.total.cost_list
                        that.myInfo = data.data.total.my_rank
                    }else{
                        alert(data.msg)
                    }
                }
            })
        },
        // POST 抽奖
        getTask:function(){
            var that = this
            $.ajax({
                url: that.default_url + "/event/getWork2021List",
                type: "POST",
                data: that.ajaxData,
                dataType: "jsonp",
                success: function(data) {
                    if(data.code==1){
                        that.taskCon = data.data
                        that.taskList = data.data.list
                        that.award_cfg = data.data.award_cfg
                        for(var i=0;i<that.award_cfg.length;i++){
                            that.award_cfg[i].award_seat = i
                        }
                        console.log(that.award_cfg)

                        console.log(data.data)
                    }else{
                        alert(data.msg)
                    }
                }
            })
        },
        // POST 领取任务
        getRecordList:function(){
            var that = this
            $.ajax({
                url: that.default_url + "/event/getWorkAwardRecordList",
                type: "GET",
                data: that.ajaxData,
                dataType: "jsonp",
                success: function(data) {
                    if(data.result==1){
                        that.recordList = data.data.list
                        $('#record_box').css('display','flex')
                        console.log(data)
                    }else{
                        alert(data.msg)
                    }
                }
            })
        },
    //     event/awardWork2021 uid taskid 领取抽奖机会
    // event/runWorkTurntable   uid  转盘
        getAwardNum:function(taskid){
            var that = this
            that.ajaxData.taskid = taskid
            $.ajax({
                url: that.default_url + "/event/awardWork2021",
                type: "GET",
                data: that.ajaxData,
                dataType: "jsonp",
                success: function(data) {
                    if(data.result==1){
                        that.tipsText = data.msg
                        $('#tips').css('display','flex')
                        setTimeout(function(){
                            $('#tips').css('display','none')
                        },2000)
                        that.getTask()
                        console.log(data)
                    }else{
                        alert(data.msg)
                    }
                }
            })
        },
        follow:function(uid){
            console.log('11')
            var that = this
            that.ajaxData.follow_uid = uid
            $.ajax({
                url: that.default_url + "/live/fans/follow",
                type: "POST",
                data: that.ajaxData,
                dataType: "json",
                success: function(data) {
                    if(data.result==1){
                        that.tipsText = '关注成功'
                        $('#tips').css('display','flex')
                        setTimeout(function(){
                            $('#tips').css('display','none')
                        },2000)
                        that.getRank()
                        console.log(data.msg)
                    }else{
                        alert(data.msg)
                    }
                }
            })
        },
        closeAward:function(){
            $('#shade_box').css('display','none')
            // $('#turnImg').css('transform','rotateZ(0deg)')
        },
        turntable:function(){
            var that = this
            var canTrunTable = that.canTrunTable
            if (canTrunTable) {
                    that.canTrunTable = false
                    setTimeout(function(){
                        that.canTrunTable = true
                    },3100)
                    $.ajax({
                    url: that.default_url + "/event/runWorkTurntable",
                    type: "GET",
                    data: that.ajaxData,
                    dataType: "jsonp",
                    success: function(data) {
                        if(data.code==1){
                            var sectorId = 1//选中的奖品地址是需要后台传给你
                            for(var i=0;i<that.award_cfg.length;i++){
                                if (that.award_cfg[i].id==data.data.id){
                                    sectorId = i
                                    console.log('sectorId',sectorId)
                                }
                            }
                            var fandou = true
                            //点击抽奖
                            // $("#get_award_btn").click(function () {
                                if (fandou) {
                                    fandou = false   //设置为false防止再次点击触发此事件
                                    // var math = Math.floor(Math.random() * 10);
                                    // var sectorId = math//选中的奖品地址是需要后台传给你
                                    var part = 9  //奖品的总个数
                                    var defaultRotate = 1800   //一圈360度，旋转5圈
                                    var setRotate = (360 / part) * sectorId - (360 / part) / 2 //计算定位到指定商品在商品的中间
                                    var allRotate = defaultRotate*that.times + setRotate //总旋转度数
                                    console.log(that.times)
                                    that.times++
                                    $('#turnImg').velocity({    //图片旋转
                                        rotateZ: allRotate + 'deg'
                                    }, {
                                        duration: 3000, //旋转的时间
                                        complete: function (ele) {
                                            $('#shade_box').css('display','flex') //中奖弹窗
                                            that.canTrunTable = true
                                            fandou = true       //设置为true时可以点击触发此事件
                                        },
                                    })
                                }

                            // })
                            that.award = data.data
                            that.getTask()
                            console.log(data.data.word)
                        }else{
                            alert(data.msg)
                        }
                    }
                })
                        
            }else{

            }
            
        },
    }
});
