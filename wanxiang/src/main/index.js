import { app, BrowserWindow } from 'electron'
import { ipcMain ,} from 'electron'
const path = require('path')
const ipc = require('electron').ipcMain

var net = require('net');


 //读卡进程
var server1 = net.createServer();
//聚合所有客户端
var sockets1 = [];
let resultData = ""
//接受新的客户端连接
server1.on('connection', function(socket){
  console.log('got a new connection');
  socket.on('data', function(data){
    let receiveInfo= data.toString();
    if(receiveInfo && receiveInfo != null && receiveInfo.substr(0,1) == "{" && (receiveInfo.split('sn')).length-1 == 1){
        let res = JSON.parse(receiveInfo)
        let reback
       if(res.cmd == "loadkey"){
          reback= '{"msg":"FF72E8FF72E8","result":"200","sign":"12345678","sn":"'+res.sn+'"}'
           resultData=""
       }

       if(res.cmd == "loadcard"){
         if(res.msg == "" || res.msg == "OK"){
             reback= '{"msg":"reading...","result":"200","sign":"12345678","sn":"'+res.sn+'"}'
             resultData=""
         }else {
             reback = '{"msg":"success","result":"200","sign":"12345678","sn":"'+res.sn+'"}'
             resultData=res.msg
         }
       }

        var buf1 = new Buffer(reback);
        socket.on('error',function () {
            console.log("error");
        })
        socket.write(buf1);
    }
    //删除被关闭的连接
    socket.on('close', function(){
        let resultData = "";
      var index = sockets1.indexOf(socket);
      sockets1.splice(index, 1);
    });
  });
});
server1.on('error', function(err){
  console.log('Server1 error:', err.message);
});
server1.on('close', function(){
  console.log('Server1 closed');
});
server1.listen(2345);


 ipcMain.on('synchronous-message', (event, arg) => {
  console.log(resultData)
  event.returnValue = resultData
})


var sendCoinNum = 0;
var receiveCoinNum = 0;
//出币进程
var server = net.createServer();
//聚合所有客户端
var sockets = [];
//接受新的客户端连接
server.on('connection', function(socket){
    console.log('got a new connection');
    sockets.push(socket);
    //从连接中读取数据
    var resultMsg="";
    socket.on('data', function(data){
        console.log('socket'+data.toString('hex'))
        //广播数据
        //每当一个已连接的用户输入数据，就将这些数据广播给其他所有已连接的用户
        if(data.toString('hex').indexOf('eaea030000000003')==0){
            var buf1 = new Buffer('eaea030000010003', "hex");
          socket.write(buf1)
          if(mainWindow1!=undefined){
            mainWindow1.webContents.send('link_status', '已连接');
          }
        }

        // if(data.toString('hex').indexOf('eaea020000000002')==0){
        //     var buf1 = new Buffer('eaea000000000000', "hex");
        //     socket.write(buf1)
        //     if(mainWindow1!=undefined){
        //         mainWindow1.webContents.send('link_status', '已连接');
        //     }
        // }

        sockets.forEach(function(otherSocket){
            if (otherSocket !== socket){
                otherSocket.write(data);
            }
        });
        //删除被关闭的连接
        socket.on('close', function(){
          var index = sockets.indexOf(socket);
            sockets.splice(index, 1);
            mainWindow1.webContents.send('link_status', '未连接');
            console.log('connection closed');
        });
    });
});

server.on('error', function(err){
    console.log('Server error:', err.message);
});

server.on('close', function(){
    console.log('Server closed');
});
server.listen(2348);
var port = 2348;
var quitting = false;
var conn;
var retryTimeout = 10000;  //三秒，定义三秒后重新连接
var o = 1;
var orderId=""      // 
var setInterval1
let coinVar    //出币得币数

//连接时设置最多连接十次，并且开启定时器三秒后再连接
(function connect() {
    conn = net.createConnection(port);
    var resultMsg="";
    conn.on('data', function(datas) {
        console.log('conn'+datas.toString('hex'))
        if(datas.toString('hex') .indexOf("fffe060001aa") !=-1) {
            var buf1 = new Buffer('eaea030000000003', "hex");
            conn.write(buf1);
            if(mainWindow1!=undefined){
              mainWindow1.webContents.send('link_status', '已连接');
            }
        }else if(datas.toString('hex') .indexOf("eaea000000000000") ==-1){
            if(mainWindow1!=undefined){
                mainWindow1.webContents.send('link_status', '已连接');
            }
            if(resultMsg == ""){
                resultMsg = datas.toString('hex')
            }else {
                var resultMsg2 = datas.toString('hex')
                if(resultMsg == resultMsg2){
                    if(mainWindow1!=undefined){
                        mainWindow1.webContents.send('coin-messages', resultMsg2);
                    }
                    resultMsg = ""
                    receiveCoinNum = resultMsg2.substr(6,4)
                    if(sendCoinNum == parseInt(receiveCoinNum,16)){
                        if(mainWindow1!=undefined){
                            mainWindow1.webContents.send('out_coin_result', 0);
                        }
                    }else {
                        if(sendCoinNum >=  parseInt(receiveCoinNum,16)){
                            var lastCoin = parseInt(sendCoinNum) - parseInt(receiveCoinNum,16)
                            if(mainWindow1!=undefined){
                                mainWindow1.webContents.send('out_coin_result', lastCoin);
                            }
                        }

                    }
                    var buf1 = new Buffer('eaea000000000000', "hex");
                    conn.write(buf1);
                    setInterval1=setInterval(myfunc,retryTimeout)
                }else{
                  resultMsg = resultMsg2
                }
            }
        }else {
            if(mainWindow1!=undefined){
                mainWindow1.webContents.send('link_status', '已连接');
            }
        }
    });
    conn.on('error', function(err) {
        if(mainWindow1!=undefined){
            mainWindow1.webContents.send('link_status', '未连接');
        }
        console.log('Error in connection:', err);
    });
    conn.on('close', function() {
        // if(! quitting) {
        //     console.log('connection got closed, will try to reconnect');
        //     reconnect();
        // }
    });
})();

var tag=true
function fn3(num, length) {    // 这里是补零操作
    return (Array(length).join('0') + num).slice(-length);
}
//
ipcMain.on('getCoin', (event, arg) => {
    clearInterval(setInterval1)
    sendCoinNum = parseInt(arg)
    coinVar = fn3(parseInt(arg).toString(16),4)
    let orderId=tag ?'01':'02'
    tag = !tag
    let footerId =parseInt(coinVar.substr(0,2),16)+parseInt(coinVar.substr(2,2),16) + 2 + parseInt(orderId);
    footerId = fn3(parseInt(footerId).toString(16),2)

    if(mainWindow1!=undefined){
        mainWindow1.webContents.send('out_coin', sendCoinNum);
    }

    var buf1 = new Buffer('EAEA000000000000',"hex");
    conn.write(buf1);
    var buf2 = new Buffer('EAEA020000000002',"hex");
    conn.write(buf2);
    orderId=`EAEA02${coinVar}${orderId}00${footerId}`
    var buf3 = new Buffer(orderId,"hex");
    conn.write(buf3);

})


function  myfunc(){
    var buf1 = new Buffer('EAEA020000000002',"hex");
    conn.write(buf1);

};
setInterval1=setInterval(myfunc,retryTimeout)


//这里是双屏幕显示
let conn2
let port2 = 4601
function connection(){
    conn2 = net.createConnection(port2);
    conn2.on('error', function(err) {
    console.log('Error in connection:', err);
    });
    conn2.on('close', function(err) {
        console.log('close in connection:', err);
    });
}
ipcMain.on('doka', (event, arg) => {
// var buf1 = new Buffer(`{"card_name":${arg.user_info.realname},"card_no":${arg.card_num},"card_phone":${arg.user_info.phone},"coin":${arg.coin},"posctrl_cmd":"card_balance","score":${arg.integral},"sign":"451f5d811982d8d93c1578f1cded8997","ticket":${arg.win_ticket},"timestamp":"1548069574"}`,"ascii");
  showInformation(`{"card_name":${arg.user_info.realname},"card_no":${arg.card_num},"card_phone":${arg.user_info.phone},"coin":${arg.coin},"posctrl_cmd":"card_balance","score":${arg.integral},"sign":"451f5d811982d8d93c1578f1cded8997","ticket":${arg.win_ticket},"timestamp":"1548069574"}`)

})

ipcMain.on('orderInformation', (event, arg) => {
    let record=[]
    if(arg.order_items == undefined){
        for(let [index,value] of arg.data.entries()){
            let arr={
                goods_money:value.amount,
                goods_name:value.goods_product.name,
                goods_num:value.num
            }
            record.push(arr)
        }
        record.push({
            goods_money:arg.count.amount,
            goods_name:'小计',
            goods_num:arg.count.num
        })
    }else {
        for(let [index,value] of arg.order_items.entries()){
            let arr={
                goods_money:value.amount,
                goods_name:value.goods_product.name,
                goods_num:value.num
            }
            record.push(arr)
        }
        record.push({
            goods_money:arg.amount,
            goods_name:'小计',
            goods_num:arg.num
        })
    }
// var buf1 = new Buffer(JSON.stringify({"posctrl_cmd":"order_info","record":record,"sign":"dac9d176b3e5195e41a0c4fc2eda1c49","timestamp":"1548243576"}),"UTF-8");
console.log(JSON.stringify({"posctrl_cmd":"order_info","record":record,"sign":"254adefa6eb5cac6438c5786d9e4c2e9","timestamp":"1548258910"}))

showInformation(JSON.stringify({"posctrl_cmd":"order_info","record":record,"sign":"254adefa6eb5cac6438c5786d9e4c2e9","timestamp":"1548258910"}))

// {"posctrl_cmd":"order_info","record":[{"goods_money":"300","goods_name":"充值300送150","goods_num":"3"},{"goods_money":"200","goods_name":"充值200送100","goods_num":"2"},{"goods_money":"100","goods_name":"充值100送50","goods_num":"1"},{"goods_money":"600","goods_name":" ","goods_num":"6"}],
// "sign":"254adefa6eb5cac6438c5786d9e4c2e9","timestamp":"1548256482"}
})

ipcMain.on('money', (event, arg) => {  //应收金额
  showInformation(`{"money":${arg},"posctrl_cmd":"order_pay","sign":"27076e84494cc0b709afd379f3fba1e0","timestamp":"1548073129"}`)
})


ipcMain.on('clear', (event, arg) => {  //应收金额
    showInformation(`{"posctrl_cmd":"order_info","record":[{goods_money:'',goods_name:"",goods_num:""}],"sign":"254adefa6eb5cac6438c5786d9e4c2e9","timestamp":"1548258910"}`)
})

ipcMain.on('change', (event, arg) => {  //实收金额
  showInformation(`{"change":${arg.change},"money":${arg.amount},"posctrl_cmd":"order_pay","real_money":${arg.getMoney},"sign":"32586e800b6bc4ada5bec946536e121a","timestamp":"1548071986"}`)
})

ipcMain.on('printTicketNew',(event,arg) => {
    let record=[]
    let qrcodeUrl  = ""
    let qrcodeText = ""

    qrcodeUrl  = arg.qrcode_url;
    qrcodeText = arg.qrcode_text;
    if(arg.infos !== undefined){
        let theTitle = {}
        theTitle["line00"]= 1
        theTitle["text"]= ""
        theTitle["title"]= arg.title
        record.push(theTitle)

        for(let [index,value] of arg.infos.entries()) {
            let arr = {}
            if(value.ticket_code !== undefined){
                arr["ticket_code"] = value.ticket_code
                arr["title"] = value.title
                arr["text"] = value.text
            }else {
                arr["line0" + (index + 1)] = 1
                arr["title"] = value.title
                arr["text"] = value.text
            }

            record.push(arr)
        }
    }

    console.log(JSON.stringify({"posctrl_cmd":"print_ticket","record":record}))
    showInformation(JSON.stringify({"posctrl_cmd":"print_ticket","record":record}))
})


function showInformation(value){
    // conn2.write('<head><meta charset="utf-8"/></head>');
    connection()
    conn2.write(value,'UTF8')

}








//读写配置文件















/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/`
    : `file://${__dirname}/index.html`

function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        webPreferences: {webSecurity: false},  //表示是否启动安全设置
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        useContentSize: true,
        width: 800,
        resizable:false,
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

let mainWindow1
ipc.on('add', (event,arg)=>{
  // console.log(content1)
    mainWindow1 = new BrowserWindow({
        webPreferences: {webSecurity: false},  //表示是否启动安全设置
        height: 1080,
        frame: false,
        titleBarStyle: 'hidden',
        useContentSize: true,
        width: 1920,
        resizable:true,
    })
    const winURL1 = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#index/basic/buyCoins`
        : `file://${__dirname}/index.html#/index/basic/buyCoins`
    mainWindow1.loadURL(winURL1)

    mainWindow1.on('closed', () => {
        mainWindow1 = null
    })
    mainWindow1.show()

    mainWindow.close()

})




const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow && mainWindow != undefined) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
    // if (mainWindow1 && mainWindow1  != undefined) {
    //     if (mainWindow1.isMinimized()) mainWindow1.restore()
    //     mainWindow1.focus()
    // }
})
if (shouldQuit) {
    app.quit()
}

const shouldQuit1 = app.makeSingleInstance((commandLine, workingDirectory) => {
    if (mainWindow1) {
        if (mainWindow1.isMinimized()) mainWindow1.restore()
        mainWindow1.focus()
    }
})
if (shouldQuit1) {
    app.quit()
}


ipcMain.on('cancellation', e=> {
    // console.log(mainWindow)
    createWindow()
    mainWindow1.close()
});

//在主线程下，通过ipcMain对象监听渲染线程传过来的getPrinterList事件
ipcMain.on('getPrinterList', (event) => {
    //主线程获取打印机列表
    //
    const list = mainWindow1.webContents.getPrinters();

    //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
    mainWindow1.webContents.send('getPrinterList', list);
});


//监听关闭按钮，最大最小按钮的操作
ipcMain.on('min', e=> mainWindow1.minimize());
ipcMain.on('max', e=> {
    
    console.log(mainWindow1.isMaximized())
    if (mainWindow1.isMaximized()) {
        mainWindow1.unmaximize()
    } else {
        mainWindow1.maximize()
    }
});
ipcMain.on('close1', e=> mainWindow.close());
ipcMain.on('close', e=> mainWindow1.close());
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
