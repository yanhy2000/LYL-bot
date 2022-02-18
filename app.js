
var fs = require('fs');
var path = require('path');
//配置文件检查
try{
    fs.statSync(path.join(__dirname, 'config.json'));
    console.log('检测配置文件存在，准备启动BOT...');
}catch(e){
    console.log("配置文件不存在!准备自动创建...");
    let jsonData = {
		"appID": '123456', 
        "token": '123456',
        "intents": ["AT_MESSAGES"],
        "sandbox": false
	};
    let text = JSON.stringify(jsonData,null,'\t')
	let file = path.join(__dirname, 'config.json');
	fs.writeFile(file, text, function (err) {
		if (err) {
			console.log("文件创建失败，请手动检查!");
		} else {
			console.log('文件创建成功!文件路径:' + file+"\n第一次文件创建完成请手动修改配置文件后使用!3s后准备强制退出...");
			setTimeout(function(){process.exit(0)},3000)//强制退出，延时3s
		}
	});
}

var confData = fs.readFileSync('config.json');
let conf = JSON.parse(confData);
const Config = {
    appID: conf.appID,
    token: conf.token,
    intents: conf.intents,
    sandbox: conf.sandbox,
  };


const client = bot.createOpenAPI(Config);
const ws = bot.createWebsocket(Config);


ws.on('READY', data => {
console.log('[bot启动] 版本:', data.msg.version , '\n[bot启动] 用户id:' , data.msg.user.id , '\n[bot启动] 用户名:' , data.msg.user.username , '\n[bot启动] bot状态:' , data.msg.user.bot);
});

ws.on('GUILD_MESSAGES', data => {
    let msg = data.msg.content;
    let user = data.msg.member.nick;
    let channelID = data.msg.channel_id;
    // console.log('[群消息] 信息接收 :', data,'\n');
    console.log('[群消息] 消息:',msg,'\n[群消息] 发言人:',user,'\n[群消息] 频道id:',channelID);
    if(msg == 'test'){
        client.messageApi
            .postMessage(channelID, {
                content: `messageApi接口触发:hello ${user}`,
            })
            .then(res => {
                // console.log(res.data);
                if(res.data.code == 304023){
                    console.log("[bot发言] 信息发送成功!");
                }
            })
            .catch(err => {
                console.log(err);// err信息错误码请参考API文档错误码描述
            });       
    }
});
ws.on('AT_MESSAGES', data => {
console.log('[@消息] 信息接收 :', data);
});

ws.on('ERROR', data => {
    console.warn('[bot报错] 详细信息 :', data);
    });