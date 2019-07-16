// 请求消息基本属性(以下所有消息都有的基本属性)
export interface WeChatMessageSubject {
  ToUserName: string; // 接收方帐号（该公众号 ID）
  FromUserName: string; // 发送方帐号（OpenID, 代表用户的唯一标识）
  CreateTime: number; // 消息创建时间（时间戳）
  MsgId: number; // 消息 ID（64位整型）
  MsgType: string;
}

export interface WeChatMessageText extends WeChatMessageSubject {
  MsgType: 'text';
  Content: string; // 文本消息内容
}

export interface WeChatMessageImage extends WeChatMessageSubject {
  MsgType: 'image';
  MediaId: string; // 图片消息媒体id，可以调用多媒体文件下载接口拉取数据
  PicUrl: string; // 图片链接
}

export interface WeChatMessageVoice extends WeChatMessageSubject {
  MsgType: 'voice';
  MediaId: string; // 语音消息媒体id，可以调用多媒体文件下载接口拉取数据
  Format: string; // 语音格式，如 amr，speex 等
  Recognition: string; // 开通语音识别后才有
}

export interface WeChatMessageVideo extends WeChatMessageSubject {
  MsgType: 'video';
  MediaId: string; // 视频消息媒体id，可以调用多媒体文件下载接口拉取数据。
  ThumbMediaId: string; // 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据
}

// 小视频
export interface WeChatMessageShortVideo extends WeChatMessageSubject {
  MsgType: 'shortvideo';
  MediaId: string; // 视频消息媒体id，可以调用多媒体文件下载接口拉取数据。
  ThumbMediaId: string; // 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据
}

/**
 * @see https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html
 */
export interface WeChatMessageEvent extends WeChatMessageSubject {
  MsgType: 'event';
  Event: 'subscribe' | 'unsubscribe' | 'SCAN' | 'LOCATION' | 'CLICK' | 'VIEW';

  // 扫描带参数二维码事件
  EventKey: string; // 事件KEY值，比如：qrscene_123123，qrscene_为前缀，后面为二维码的参数值
  Ticket: string; // 二维码的 ticket，可用来换取二维码图片
}

export type MessageHandleParams = WeChatMessageText | WeChatMessageImage | WeChatMessageVoice | WeChatMessageVideo;
export type MessageHandle<T = {}> = (message: MessageHandleParams & T) => any;
