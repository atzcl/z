'use strict';

const log = console.log;

/* eslint-disable no-undef */
window.onload = function() {
  // init
  const socket = io(window.location.href, {
    transports: [ 'websocket' ],
    // 传递参数
    query: {},
  });

  socket.on('connect', () => {
    const id = socket.id;
    // 链接成功后,往服务端的 getLoginQrCode 事件发送获取微信登录二维码的需求
    socket.emit('getLoginQrCode', 'success');

    /* ***********************   监听自定义事件  *************************** */

    // 监听自身 id 以实现 p2p 通讯
    socket.on(id, msg => {
      if ('type' in msg) {
        console.log(111);
      }
    });

    /* **************************   监听系统事件  *************************** */

    // 监听断开连接事件 [ 断开连接时触发 ]
    socket.on('disconnect', msg => {
      log('断开连接~', msg);
    });

    // 监听客户端往服务端发送 ping 数据包
    socket.on('ping', () => {
      log('ping~');
    });

    /*
    * 监听服务端响应 ping 数据后，返回的 pong 事件
    *
    * @param {number} latency 自发送 ping 数据包后，到接收到 pong 事件的毫秒数（即：等待时间）
    */
    socket.on('pong', latency => {
      log('收到服务器的回应了~', latency);
    });

    // 监听重连失败事件 [ 重连失败时触发 ]
    socket.on('reconnect_failed', () => {
      log('重连失败~');
    });

    // 监听重连成功事件 [ 重连成功时触发 ]
    socket.on('reconnect', attemptNumber => {
      log('重连成功~', attemptNumber);
    });

    // 监听连接超 [ 连接超时后触发 ]
    socket.on('connect_timeout', timeout => {
      log('连接超时了~', timeout);
    });

    // 监听错误事件 [ 发生错误时触发 ]
    socket.on('error', error => {
      log('发生了错误事件~', error);
    });

  });

  window.socket = socket;
};
