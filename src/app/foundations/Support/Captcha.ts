/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 验证码相关
|
*/

import * as NodeCanvas from 'canvas';
import { sampleSize, random } from 'lodash';


export interface CaptchaConfig {
  // 验证码字符集合
  codeSet: string;
  // 使用中文验证码
  useZh: boolean;
  // 中文验证码字符串
  zhSet: string;

  fontSize: number;
  imageW: number;
  imageH: number;
  length: number;
  fontttf: string;
  fontFamily: string;
  // 背景颜色
  bgColor: string;
  // 是否绘制杂点
  useNoise: boolean;
  // 是否绘制干扰线
  useCurve: boolean;
  // 绘制的杂点类型
  noiseType: 'text' | 'dot';
}

export class Captcha {
  config: CaptchaConfig = {
    codeSet: '2345678abcdefhijkmnpqrstuvwxyzABCDEFGHJKLMNPQRTUVWXY',
    zhSet: '们以我到他会作时要动国产的一是工就年阶义发成部民可出能方进在了不和有大这主中人上为来分生对于学下级地个用同行面说种过命度革而多子后自社加小机也经力线本电高量长党得实家定深法表着水理化争现所二起政三好十战无农使性前等反体合斗路图把结第里正新开论之物从当两些还天资事队批点育重其思与间内去因件日利相由压员气业代全组数果期导平各基或月毛然如应形想制心样干都向变关问比展那它最及外没看治提五解系林者米群头意只明四道马认次文通但条较克又公孔领军流入接席位情运器并飞原油放立题质指建区验活众很教决特此常石强极土少已根共直团统式转别造切九你取西持总料连任志观调七么山程百报更见必真保热委手改管处己将修支识病象几先老光专什六型具示复安带每东增则完风回南广劳轮科北打积车计给节做务被整联步类集号列温装即毫知轴研单色坚据速防史拉世设达尔场织历花受求传口断况采精金界品判参层止边清至万确究书术状厂须离再目海交权且儿青才证低越际八试规斯近注办布门铁需走议县兵固除般引齿千胜细影济白格效置推空配刀叶率述今选养德话查差半敌始片施响收华觉备名红续均药标记难存测士身紧液派准斤角降维板许破述技消底床田势端感往神便贺村构照容非搞亚磨族火段算适讲按值美态黄易彪服早班麦削信排台声该击素张密害侯草何树肥继右属市严径螺检左页抗苏显苦英快称坏移约巴材省黑武培著河帝仅针怎植京助升王眼她抓含苗副杂普谈围食射源例致酸旧却充足短划剂宣环落首尺波承粉践府鱼随考刻靠够满夫失包住促枝局菌杆周护岩师举曲春元超负砂封换太模贫减阳扬江析亩木言球朝医校古呢稻宋听唯输滑站另卫字鼓刚写刘微略范供阿块某功套友限项余倒卷创律雨让骨远帮初皮播优占死毒圈伟季训控激找叫云互跟裂粮粒母练塞钢顶策双留误础吸阻故寸盾晚丝女散焊功株亲院冷彻弹错散商视艺灭版烈零室轻血倍缺厘泵察绝富城冲喷壤简否柱李望盘磁雄似困巩益洲脱投送奴侧润盖挥距触星松送获兴独官混纪依未突架宽冬章湿偏纹吃执阀矿寨责熟稳夺硬价努翻奇甲预职评读背协损棉侵灰虽矛厚罗泥辟告卵箱掌氧恩爱停曾溶营终纲孟钱待尽俄缩沙退陈讨奋械载胞幼哪剥迫旋征槽倒握担仍呀鲜吧卡粗介钻逐弱脚怕盐末阴丰雾冠丙街莱贝辐肠付吉渗瑞惊顿挤秒悬姆烂森糖圣凹陶词迟蚕亿矩康遵牧遭幅园腔订香肉弟屋敏恢忘编印蜂急拿扩伤飞露核缘游振操央伍域甚迅辉异序免纸夜乡久隶缸夹念兰映沟乙吗儒杀汽磷艰晶插埃燃欢铁补咱芽永瓦倾阵碳演威附牙芽永瓦斜灌欧献顺猪洋腐请透司危括脉宜笑若尾束壮暴企菜穗楚汉愈绿拖牛份染既秋遍锻玉夏疗尖殖井费州访吹荣铜沿替滚客召旱悟刺脑措贯藏敢令隙炉壳硫煤迎铸粘探临薄旬善福纵择礼愿伏残雷延烟句纯渐耕跑泽慢栽鲁赤繁境潮横掉锥希池败船假亮谓托伙哲怀割摆贡呈劲财仪沉炼麻罪祖息车穿货销齐鼠抽画饲龙库守筑房歌寒喜哥洗蚀废纳腹乎录镜妇恶脂庄擦险赞钟摇典柄辩竹谷卖乱虚桥奥伯赶垂途额壁网截野遗静谋弄挂课镇妄盛耐援扎虑键归符庆聚绕摩忙舞遇索顾胶羊湖钉仁音迹碎伸灯避泛亡答勇频皇柳哈揭甘诺概宪浓岛袭谁洪谢炮浇斑讯懂灵蛋闭孩释乳巨徒私银伊景坦累匀霉杜乐勒隔弯绩招绍胡呼痛峰零柴簧午跳居尚丁秦稍追梁折耗碱殊岗挖氏刃剧堆赫荷胸衡勤膜篇登驻案刊秧缓凸役剪川雪链渔啦脸户洛孢勃盟买杨宗焦赛旗滤硅炭股坐蒸凝竟陷枪黎救冒暗洞犯筒您宋弧爆谬涂味津臂障褐陆啊健尊豆拔莫抵桑坡缝警挑污冰柬嘴啥饭塑寄赵喊垫丹渡耳刨虎笔稀昆浪萨茶滴浅拥穴覆伦娘吨浸袖珠雌妈紫戏塔锤震岁貌洁剖牢锋疑霸闪埔猛诉刷狠忽灾闹乔唐漏闻沈熔氯荒茎男凡抢像浆旁玻亦忠唱蒙予纷捕锁尤乘乌智淡允叛畜俘摸锈扫毕璃宝芯爷鉴秘净蒋钙肩腾枯抛轨堂拌爸循诱祝励肯酒绳穷塘燥泡袋朗喂铝软渠颗惯贸粪综墙趋彼届墨碍启逆卸航衣孙龄岭骗休借',
    fontSize: 25,
    imageW: 0,
    imageH: 0,
    length: 4,
    fontFamily: '"Microsoft YaHei"',
    bgColor: 'rgb(243, 251, 254)',
    useCurve: true,
    useNoise: true,
    noiseType: 'text',
    fontttf: '',
    useZh: false,
  }

  // node-canvas 实例
  canvasInstance: any;

  canvasContext: any;

  constructor(options: Partial<CaptchaConfig> = {}) {
    const tempConfig = {
      ...this.config,
      ...options,
    }

    const {
      imageW, imageH, length, fontSize,
    } = tempConfig;

    this.config = {
      ...tempConfig,
      // 计算宽高
      ...{
        imageW: imageW || length * fontSize * 1.5 + length * fontSize / 2,
        imageH: imageH || fontSize * 2.5,
      },
    }

    // 初始化
    this.initCaptcha();
  }

  /**
   * 初始化 node-canvas
   */
  initCaptcha() {
    const { imageW, imageH } = this.config;

    this.canvasInstance = this.canvasInstance || NodeCanvas.createCanvas(imageW, imageH);
    // 绘画上下文
    this.canvasContext = this.canvasContext || this.canvasInstance.getContext('2d');

    // 注册字体
    // NodeCanvas.registerFont('comicsans.ttf', { family: 'Comic Sans' })
  }

  /**
   * 创建验证码图片
   *
   * @param {null|number|string} 验证码
   * @param {boolean} 是否输出 base64 格式，如果不是，那么就直接输出 buffer
   *
   * @returns {object}
   */
  async captchaBuilder(code: number | string = '', isBase64 = false) {
    // 绘制验证码
    const captchaText = this.drawText(code);
    const { noiseType, useCurve, useNoise } = this.config;

    if (useCurve) {
      // 绘制干扰线
      this.drawCurve();
    }

    if (useNoise) {
      // 绘制杂点
      this[noiseType === 'text' ? 'drawNoiseText' : 'drawNoise']();
    }

    // 获取绘制的图片 Buffer
    const captchaData = isBase64 ? this.toDataURL : this.toBuffer();

    return { captchaData, captcha: captchaText.toLowerCase() };
  }


  /**
   * 绘制杂点
   */
  drawNoise() {
    const { imageW, imageH } = this.config;
    const ctx = this.canvasContext;
    const pixelCount = imageW * imageH * 0.05;

    for (let i = 0; i < pixelCount; i++) {
      ctx.fillStyle = this.randomColor();
      ctx.beginPath();
      ctx.arc(random(0, imageW), random(0, imageH), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * 绘制杂点 [ 文字版 ]
   */
  drawNoiseText() {
    const ctx = this.canvasContext;
    const {
      fontFamily, imageW, imageH, codeSet,
    } = this.config;
    for (let i = 0; i < 10; i++) {
      // 杂点颜色
      const noiseColor = this.randomColor(.8);
      for (let j = 0; j < 5; j++) {
        // 绘杂点
        ctx.font = `10px ${fontFamily}`;
        ctx.fillStyle = noiseColor;
        // 绘制文字
        ctx.fillText(codeSet[random(0, codeSet.length)], random(-10, imageW), random(-10, imageH));
      }
    }
  }

  /**
   * 绘制干扰线
   *
   * todo: 后面应该要绘制干扰曲线，而不是单纯的线条
   */
  drawCurve() {
    const { length, imageW, imageH } = this.config;
    const ctx = this.canvasContext;

    for (let i = 0; i < length; i++) {
      ctx.strokeStyle = this.randomColor();
      ctx.beginPath();
      ctx.moveTo(0, random(0, imageH));
      ctx.lineTo(imageW, random(0, imageH));
      ctx.stroke();
    }
  }

  /**
   * 绘制文字
   *
   * @param {string | number | null}
   *
   * @returns {string}
   */
  drawText(code: string | number) {
    const {
      bgColor, imageW, imageH, fontSize, fontFamily, length,
    } = this.config;
    const ctx = this.canvasContext;

    // 获取需要绘制的验证码
    const captchaCode = String(code || this.randomChars());

    // 设置背景色
    ctx.fillStyle = bgColor;
    // 创建绘制矩形
    ctx.fillRect(0, 0, imageW, imageH);

    const textColor = this.randomColor(); // 验证码文字颜色
    const codeNXMin = fontSize * 1.2;
    const codeNXMax = fontSize * 1.6;
    let codeNX = codeNXMin / 3; // 验证码第 N 个字符的左边距
    for (let i = 0; i < length; i++) {
      ctx.save();

      ctx.rotate(Math.random() / 8);
      ctx.font = `${fontSize + 18}px ${fontFamily} bold`;
      ctx.fillStyle = textColor;

      codeNX += random(codeNXMin, codeNXMax);
      // 绘制文字
      ctx.fillText(captchaCode[i], codeNX, codeNXMax + 3);

      ctx.restore();
    }

    return captchaCode;
  }

  /**
   * 转化为 buffer
   */
  toBuffer(opts = {}, type = 'image/jpeg') {
    return this.canvasInstance.toBuffer(type, opts)
  }

  /**
   * 转化为 base64
   */
  toDataURL() {
    return Buffer.from(this.toBuffer({ quality: 0.5 })).toString('base64');
  }

  /**
   * 获取随机的验证码
   *
   * @returns {string}
   */
  randomChars(): string {
    const {
      useZh, codeSet, zhSet, length,
    } = this.config;

    const chars = useZh ? zhSet : codeSet;

    // 从集合中获得指定个数的随机元素
    return sampleSize(chars, length).join('');
  }

  /**
   * 获取随机的颜色值
   *
   * @returns {string}
   */
  randomColor(alpha = 1): string {
    // return '#' + sampleSize('23456789', 3).join('');
    return `rgba(${random(1, 150)}, ${random(1, 150)}, ${random(1, 150)}, ${alpha})`
  }
}
