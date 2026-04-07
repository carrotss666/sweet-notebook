// 《恋恋笔记本》活动库 v2.0 — 100 activities

export interface Activity {
  id: number;
  emoji: string;
  title: string;
  tags: string[];
  mood: string[];
  time: string[];
  weather: string[];
  lines: string[];
  energy: "low" | "medium" | "high";
}

export const ACTIVITIES_V2: Activity[] = [
  // 🍜 吃饭类 (20)
  { id:1, emoji:"🍜", title:"各自给对方点一份餐（不能解释）", tags:["吃饭","互动"], mood:["轻松","无聊"], time:["晚上"], weather:["随意"], lines:["今天把选择权交给对方 💕"], energy:"low" },
  { id:2, emoji:"🍜", title:"去评分最低的一家店试试", tags:["吃饭","探索"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["反正都出来了，不如赌一把"], energy:"medium" },
  { id:3, emoji:"🍜", title:"点一道从没吃过的菜", tags:["吃饭"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["生活需要一点未知的味道"], energy:"low" },
  { id:4, emoji:"🍜", title:"互相喂第一口", tags:["吃饭","亲密"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["从第一口开始就很甜"], energy:"low" },
  { id:5, emoji:"🍜", title:"只点小吃拼一桌", tags:["吃饭"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["今天不讲究，讲开心"], energy:"low" },
  { id:6, emoji:"🎲", title:"各自选一家店，随机决定去谁的", tags:["吃饭","随机"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["把选择交给运气"], energy:"medium" },
  { id:7, emoji:"🍜", title:"点最贵的一道菜看看值不值", tags:["吃饭","轻冒险"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["偶尔也可以任性一下"], energy:"low" },
  { id:8, emoji:"🧁", title:"只吃甜品当晚饭", tags:["吃饭","轻松"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["今天允许不健康一下"], energy:"low" },
  { id:9, emoji:"🍜", title:"互相推荐一家童年最爱吃的店", tags:["吃饭","回忆"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["带你回到过去"], energy:"medium" },
  { id:10, emoji:"🍜", title:"挑战用最低预算吃一顿", tags:["吃饭","挑战"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["看看谁更会精打细算"], energy:"medium" },
  { id:11, emoji:"🍳", title:"一起做饭（哪怕很简单）", tags:["吃饭","互动"], mood:["轻松"], time:["周末"], weather:["雨天"], lines:["过程比结果更重要"], energy:"medium" },
  { id:12, emoji:"📱", title:"点完全随机的外卖", tags:["吃饭","随机"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["今天交给命运安排"], energy:"low" },
  { id:13, emoji:"🍜", title:"互换口味点餐", tags:["吃饭","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["体验对方的世界"], energy:"low" },
  { id:14, emoji:"🍜", title:"只点从没见过的菜名", tags:["吃饭","探索"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["未知才有趣"], energy:"low" },
  { id:15, emoji:"📝", title:"边吃边给每道菜打分", tags:["吃饭","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["今天当美食评委"], energy:"low" },
  { id:16, emoji:"📸", title:"去一家环境最好看的店", tags:["吃饭","拍照"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["今天吃的是氛围"], energy:"medium" },
  { id:17, emoji:"🍜", title:"吃一顿「童年套餐」", tags:["吃饭","回忆"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["回到小时候的快乐"], energy:"medium" },
  { id:18, emoji:"🍜", title:"选一家评价两极分化的店", tags:["吃饭","探索"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["看看你们属于哪一派"], energy:"medium" },
  { id:19, emoji:"🍜", title:"只点对方爱吃但自己不爱的", tags:["吃饭","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["理解从这里开始"], energy:"low" },
  { id:20, emoji:"🍜", title:"吃完后互相写一句评价", tags:["吃饭","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["简单一句也很珍贵"], energy:"low" },

  // 🚶 探索类 (20)
  { id:21, emoji:"🚇", title:"随机坐一站地铁下车乱逛", tags:["探索"], mood:["轻松","无聊"], time:["周末"], weather:["晴天"], lines:["不确定性才是浪漫"], energy:"high" },
  { id:22, emoji:"🚶", title:"不看地图走30分钟", tags:["探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["方向不重要"], energy:"high" },
  { id:23, emoji:"🏪", title:"找一家最奇怪的店进去", tags:["探索"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["越奇怪越有故事"], energy:"medium" },
  { id:24, emoji:"🗺", title:"去一个从没去过的街区", tags:["探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["换个地方换个心情"], energy:"high" },
  { id:25, emoji:"🚌", title:"随便上车坐到终点站", tags:["探索","轻冒险"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["看看会到哪里"], energy:"medium" },
  { id:26, emoji:"🏘", title:"找一家隐藏在巷子里的店", tags:["探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["好东西通常藏得很深"], energy:"medium" },
  { id:27, emoji:"🌳", title:"去公园坐一下午", tags:["放松"], mood:["疲惫"], time:["周末"], weather:["晴天"], lines:["今天不赶时间"], energy:"low" },
  { id:28, emoji:"🌊", title:"沿着一条河一直走", tags:["探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["慢慢走就很好"], energy:"medium" },
  { id:29, emoji:"🖼", title:"去最近的一个展览（随便选）", tags:["探索","文化"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["不需要准备"], energy:"medium" },
  { id:30, emoji:"🧭", title:"随机选一个方向走", tags:["探索"], mood:["无聊"], time:["周末"], weather:["晴天"], lines:["今天不做决定"], energy:"medium" },
  { id:31, emoji:"🌃", title:"去一个高处看城市", tags:["探索","浪漫"], mood:["开心"], time:["晚上"], weather:["晴天"], lines:["城市会变得很温柔"], energy:"medium" },
  { id:32, emoji:"🏪", title:"找一家路过三次但没进去的店", tags:["探索"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["今天终于进去看看"], energy:"low" },
  { id:33, emoji:"📸", title:"在街头随便拍10张照片", tags:["拍照","探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["记录一些普通瞬间"], energy:"medium" },
  { id:34, emoji:"📖", title:"去图书馆坐一会儿", tags:["安静"], mood:["疲惫"], time:["周末"], weather:["雨天"], lines:["安静一点也很好"], energy:"low" },
  { id:35, emoji:"🛒", title:"去便利店买从没买过的东西", tags:["探索"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["小小的尝试"], energy:"low" },
  { id:36, emoji:"🍜", title:"找一家评分刚好3.5的店", tags:["探索"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["中间值最有意思"], energy:"medium" },
  { id:37, emoji:"🚌", title:"坐公交不下车看风景", tags:["放松"], mood:["疲惫"], time:["周末"], weather:["随意"], lines:["不用目的地"], energy:"low" },
  { id:38, emoji:"☁️", title:"去一个人少的地方发呆", tags:["放松"], mood:["疲惫"], time:["周末"], weather:["晴天"], lines:["什么都不做"], energy:"low" },
  { id:39, emoji:"🚶", title:"找一条最安静的街走一走", tags:["探索"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["城市也有安静角落"], energy:"medium" },
  { id:40, emoji:"🌃", title:"去夜晚最热闹的地方看看", tags:["探索"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["感受一点热闹"], energy:"medium" },

  // 💬 互动类 (15)
  { id:46, emoji:"❓", title:"问对方10个奇怪的问题", tags:["互动"], mood:["轻松","无聊"], time:["晚上"], weather:["随意"], lines:["有些问题平时不会问"], energy:"low" },
  { id:47, emoji:"💕", title:"假装第一次约会", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["重新认识一次"], energy:"low" },
  { id:48, emoji:"📝", title:"给对方写一句评价", tags:["互动"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["一句话也会被记住"], energy:"low" },
  { id:49, emoji:"📱", title:"交换手机点外卖", tags:["互动"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["看看你在他眼里"], energy:"low" },
  { id:50, emoji:"🎁", title:"各自准备一个小惊喜", tags:["互动"], mood:["开心"], time:["周末"], weather:["随意"], lines:["一点用心就够"], energy:"medium" },
  { id:51, emoji:"💬", title:"说出今天最喜欢对方的一点", tags:["互动"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["简单但重要"], energy:"low" },
  { id:52, emoji:"🎭", title:"互相模仿对方说话", tags:["互动","搞笑"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["一定很好笑"], energy:"low" },
  { id:53, emoji:"💭", title:"各自讲一个童年故事", tags:["互动","回忆"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["更了解彼此"], energy:"low" },
  { id:54, emoji:"📋", title:"一起写一段未来计划", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["想象一下未来"], energy:"low" },
  { id:55, emoji:"🤫", title:"说出三件对方不知道的事", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["还有很多没说的"], energy:"low" },
  { id:56, emoji:"⭐", title:"互相评价今天的表现", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["今天怎么样"], energy:"low" },
  { id:57, emoji:"🔮", title:"玩「如果…会怎样」游戏", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["假设很有趣"], energy:"low" },
  { id:58, emoji:"🤫", title:"互相讲一个秘密", tags:["互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["更靠近一点"], energy:"low" },
  { id:59, emoji:"📸", title:"互相选一张对方最好看的照片", tags:["互动","拍照"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["你眼中的我"], energy:"low" },
  { id:60, emoji:"📝", title:"各自写一句今天的总结", tags:["互动","记录"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["留一点痕迹"], energy:"low" },

  // 🎬 娱乐类 (15)
  { id:61, emoji:"🎬", title:"看评分最低的电影一起吐槽", tags:["娱乐"], mood:["无聊"], time:["晚上"], weather:["雨天"], lines:["吐槽比电影好看"], energy:"low" },
  { id:62, emoji:"🎬", title:"看一部童年动画", tags:["娱乐","回忆"], mood:["轻松"], time:["晚上"], weather:["雨天"], lines:["回到小时候"], energy:"low" },
  { id:63, emoji:"🎬", title:"随机选一部冷门片", tags:["娱乐"], mood:["无聊"], time:["晚上"], weather:["雨天"], lines:["可能有惊喜"], energy:"low" },
  { id:64, emoji:"🎵", title:"听一张完整专辑", tags:["娱乐"], mood:["轻松","疲惫"], time:["晚上"], weather:["随意"], lines:["从头听到尾"], energy:"low" },
  { id:65, emoji:"🎭", title:"模仿电影桥段", tags:["娱乐","互动"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["演技大比拼"], energy:"low" },
  { id:66, emoji:"📺", title:"一起看纪录片", tags:["娱乐"], mood:["轻松","疲惫"], time:["晚上"], weather:["雨天"], lines:["了解这个世界"], energy:"low" },
  { id:67, emoji:"📺", title:"选最奇怪的综艺看", tags:["娱乐"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["奇怪才好笑"], energy:"low" },
  { id:68, emoji:"🎬", title:"看一部老电影", tags:["娱乐"], mood:["轻松"], time:["晚上"], weather:["雨天"], lines:["经典永远不会过时"], energy:"low" },
  { id:69, emoji:"🎧", title:"一起听播客", tags:["娱乐"], mood:["轻松","疲惫"], time:["晚上"], weather:["随意"], lines:["听听别人的故事"], energy:"low" },
  { id:70, emoji:"📱", title:"分享各自喜欢的视频", tags:["娱乐","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["看看你平时在看什么"], energy:"low" },
  { id:71, emoji:"✈️", title:"看别人旅行vlog", tags:["娱乐"], mood:["疲惫"], time:["晚上"], weather:["随意"], lines:["先过过眼瘾"], energy:"low" },
  { id:72, emoji:"🎬", title:"选一部名字最奇怪的电影", tags:["娱乐"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["名字奇怪内容可能更奇怪"], energy:"low" },
  { id:73, emoji:"🎵", title:"互相推荐一首歌", tags:["娱乐","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["一首歌代表一种心情"], energy:"low" },
  { id:74, emoji:"🎵", title:"听对方单曲循环的歌", tags:["娱乐","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["了解你的心情"], energy:"low" },
  { id:75, emoji:"📱", title:"随机点开一个视频看完", tags:["娱乐"], mood:["无聊"], time:["晚上"], weather:["随意"], lines:["算法知道你想看什么"], energy:"low" },

  // 📸 回忆制造类 (10)
  { id:76, emoji:"📸", title:"给对方拍今日最佳照片", tags:["拍照"], mood:["开心"], time:["周末"], weather:["晴天"], lines:["用你的视角看我"], energy:"medium" },
  { id:77, emoji:"📸", title:"拍一张「以后会翻到」的照片", tags:["拍照"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["未来的你会感谢现在"], energy:"medium" },
  { id:78, emoji:"📸", title:"拍一张对方不注意的瞬间", tags:["拍照"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["最自然最真实"], energy:"low" },
  { id:79, emoji:"✨", title:"记录今天最开心的瞬间", tags:["记录"], mood:["开心"], time:["晚上"], weather:["随意"], lines:["开心值得被记住"], energy:"low" },
  { id:80, emoji:"📸", title:"拍同一个姿势的照片", tags:["拍照","互动"], mood:["开心"], time:["周末"], weather:["晴天"], lines:["同款情侣照"], energy:"medium" },
  { id:81, emoji:"📝", title:"用一句话记录今天", tags:["记录"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["一句话就够了"], energy:"low" },
  { id:82, emoji:"📸", title:"拍一张「现在的我们」", tags:["拍照"], mood:["开心"], time:["周末"], weather:["随意"], lines:["记录此刻的样子"], energy:"low" },
  { id:83, emoji:"🎤", title:"留一条语音给对方", tags:["记录","互动"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["声音比文字更温暖"], energy:"low" },
  { id:84, emoji:"📸", title:"拍一张搞怪照", tags:["拍照","搞笑"], mood:["开心"], time:["周末"], weather:["随意"], lines:["丑也是一种回忆"], energy:"low" },
  { id:85, emoji:"📋", title:"做一个小合集", tags:["记录"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["把碎片拼起来"], energy:"low" },

  // 🧠 轻挑战类 (10)
  { id:86, emoji:"📵", title:"今天不看手机1小时", tags:["挑战"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["把注意力给彼此"], energy:"low" },
  { id:87, emoji:"😊", title:"不抱怨挑战（持续一天）", tags:["挑战"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["积极的一天"], energy:"low" },
  { id:88, emoji:"🧠", title:"互相猜对方在想什么", tags:["互动","挑战"], mood:["轻松","无聊"], time:["晚上"], weather:["随意"], lines:["看看默契值多少"], energy:"low" },
  { id:89, emoji:"😶", title:"只用表情聊天10分钟", tags:["互动","挑战"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["考验默契"], energy:"low" },
  { id:90, emoji:"🚫", title:"不说"随便"挑战", tags:["挑战"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["今天必须有主见"], energy:"low" },
  { id:91, emoji:"🌟", title:"做一件平时不会做的事", tags:["挑战"], mood:["无聊"], time:["周末"], weather:["随意"], lines:["试试新的自己"], energy:"medium" },
  { id:92, emoji:"😄", title:"给陌生人一个微笑", tags:["挑战"], mood:["轻松","开心"], time:["周末"], weather:["晴天"], lines:["善意会传递"], energy:"low" },
  { id:93, emoji:"💕", title:"今天夸对方3次", tags:["互动","挑战"], mood:["开心"], time:["周末"], weather:["随意"], lines:["夸人也是一种能力"], energy:"low" },
  { id:94, emoji:"🍀", title:"记录3个今天的小幸运", tags:["记录","挑战"], mood:["轻松"], time:["晚上"], weather:["随意"], lines:["幸运一直都在"], energy:"low" },
  { id:95, emoji:"👀", title:"不拍照只用眼睛体验", tags:["挑战"], mood:["轻松"], time:["周末"], weather:["晴天"], lines:["用心去感受"], energy:"low" },

  // 补齐到100
  { id:96, emoji:"🎨", title:"一起画画（画得丑也没关系）", tags:["创意","互动"], mood:["轻松"], time:["周末"], weather:["雨天"], lines:["画得丑也没关系"], energy:"low" },
  { id:97, emoji:"🎲", title:"玩桌游（输了的人请客）", tags:["互动","娱乐"], mood:["轻松","无聊"], time:["晚上"], weather:["雨天"], lines:["输了的人请客"], energy:"low" },
  { id:98, emoji:"☕", title:"找一家没去过的咖啡店", tags:["探索"], mood:["轻松"], time:["周末"], weather:["随意"], lines:["探索新角落"], energy:"medium" },
  { id:99, emoji:"🎵", title:"一起听歌散步", tags:["探索","放松"], mood:["轻松","疲惫"], time:["晚上"], weather:["晴天"], lines:["共享一副耳机"], energy:"medium" },
  { id:100, emoji:"🌸", title:"去公园野餐", tags:["探索","放松"], mood:["轻松","开心"], time:["周末"], weather:["晴天"], lines:["带上毯子和零食"], energy:"medium" },
];
