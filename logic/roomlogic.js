function Room(id){
    //房间id
    this.id = id;
    //房间里的用户列表
    this.player_in_room = [];
    //房间绑定的专辑
    this.loadall = "";
    //专辑的角色列表
    this.actor_list = {"role1":"","role2":""};
    //专辑运行时间
    this.running_time = 0;

    this.prepare_player = new Map();

    this.cache_real_actor_list = new Array();

    this.update_actor_list_cache = function(){
        //把对象转换为属性数组
        this.cache_real_actor_list.length = 0;
        for (let prop of Object.keys(this.actor_list)){
            this.cache_real_actor_list.push({"actor_id":prop,"player_id":this.actor_list[prop]});
        }
    }

    this.update_actor_list_cache();
};

function RoomLogic(){
    // this.room_list = {1:new Room(1),2:new Room(2)}
    this.room_list = {"1":new Room(),"2":new Room()};
    



    this.resetRoom = function(room_id){
        room_list[room_id] = new Room();
        return room_list[room_id]
    }

    

    this.get_status = function(room_id,player_id){
        if(this.room_list[room_id] != undefined){
            var room_item = this.room_list[room_id];
            //如果是已经运行的房间 同时又是房间中的玩家访问 重置房间
            if(room_item.running_time > 0 && room_item.prepare_player.has(player_id)){
                room_item = resetRoom(room_id);
            }

            
            

            var data =  {
                "result":true,
                "actor_list":room_item.cache_real_actor_list,
                "running_time":room_item.running_time,
                "server_time":new Date().getTime()
            };
            return data;
        }

        return {"result":false};
    };

    this.apply_act = function(room_id,player_id,actor_id){
        if(this.room_list[room_id] != undefined){
            var room_item = this.room_list[room_id];
            var player_for_actor = room_item.actor_list[actor_id];
            if(player_for_actor != undefined){
                if(player_for_actor == player_id){
                    return {"result":true};
                }else if(player_for_actor == ""){

                    if(!room_item.prepare_player.has(player_id)){
                        room_item.actor_list[actor_id] = player_id;
                        room_item.prepare_player.set(player_id,false);
                        room_item.update_actor_list_cache();
                        return {"result":true};
                    }
                    
                }else if(player_id == ""){
                    room_item.prepare_player.delete(room_item.actor_list[actor_id]);
                    room_item.actor_list[actor_id] = player_id;
                    room_item.update_actor_list_cache();
                    return {"result":true};
                }
            }
        }
        return {"result":false};
    };

    this.is_prepare_scene = function(room_id){
        if(this.room_list[room_id] != undefined){
            var room_item = this.room_list[room_id];
            
            var all_actor_has_player = true;
            for (let prop of Object.keys(room_item.actor_list)){
                if(room_item.actor_list[prop] == ""){
                    all_actor_has_player = false;
                    break;
                }
            }

            var data = {
                "result":all_actor_has_player,
                "actor_list":room_item.cache_real_actor_list
            };

            return data;
        }
        return {"result":false};
    }

    this.prepare_scene_finish = function(room_id,player_id){
        if(this.room_list[room_id] != undefined){
            var room_item = this.room_list[room_id];
            room_item.prepare_player[player_id] = true;
            return {"result":true};
        }
        return {"result":false};
    }

    this.request_play = function(room_id){
        if(this.room_list[room_id] != undefined){
            var room_item = this.room_list[room_id];
            var is_all_player_load_scene = true;

            for (var [key, value] of room_item.prepare_player) {
                if(!value){
                    is_all_player_load_scene = false;
                    break;
                }
            }
            
            if(is_all_player_load_scene){
                if(room_item.running_time <= 0){
                    //3秒以后
                    room_item.running_time = new Date().getTime() + 3000;
                }
                return {"result":false,"running_time":room_item.running_time};
            }
        }
        return {"result":false};
    }
};

var room_logic = new RoomLogic();
module.exports = room_logic;