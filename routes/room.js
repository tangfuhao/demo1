var express = require('express');
var router = express.Router();
const roomlogic = require("../logic/roomlogic");
const urlib = require('url');



/* GET users listing. */
//获取状态
router.get('/get_status', function(req, res, next) {
    var myobj = urlib.parse(req.url,true);
    var data = roomlogic.get_status(myobj.query.room_id,myobj.query.player_id);
    
    res.status(200).send(JSON.stringify(data));
});

//申请扮演
router.get('/apply_act', function(req, res, next) {
    var myobj = urlib.parse(req.url,true);
    var data = roomlogic.apply_act(myobj.query.room_id,myobj.query.player_id,myobj.query.actor_id);
    res.status(200).json(data);
});

//请求是否开始加载场景 1s请求一次
router.get('/is_prepare_scene', function(req, res, next) {
    var myobj = urlib.parse(req.url,true);
    var data = roomlogic.is_prepare_scene(myobj.query.room_id);
    res.status(200).json(data);
});

//通知服务器 场景加载完毕
router.get('/prepare_scene_finish', function(req, res, next) {
    var myobj = urlib.parse(req.url,true);
    var data = roomlogic.prepare_scene_finish(myobj.query.room_id,myobj.query.player_id);
    res.status(200).json(data);
});

//从服务器获取 timeline 真正的执行时间 1s请求一次
router.get('/request_play', function(req, res, next) {
    var myobj = urlib.parse(req.url,true);
    var data = roomlogic.request_play(myobj.query.room_id);
    res.status(200).json(data);
});




module.exports = router;
