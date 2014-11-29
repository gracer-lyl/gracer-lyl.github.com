---
layout: post
title: "Mac下Eclipse连接不上HMI A1手机的解决方法"
description: ""
category: "Android"
tags: 博客 Android
---
{% include JB/setup %}

####**环境**

Macbook Pro下的Eclipse Device，用作android开发

####**故事**
	
最开始，我使用了测试的三星S4，可以自动识别机子，但是我的黑米怎么插都不能正常识别，我还以为我这个手机太山寨了，不能识别了。网上查了很多资料，不靠谱啊！我发现：有时候你越是想找到东西就越找不到，这不，晚上洗过澡感觉有必要再试一下，要不然就入手红米Note了，我也不想额外花钱（老婆知道会生气的），幸好看到了http://blog.csdn.net/cooldragon/article/details/40212761这篇文章，很简短清晰，我试了，竟然ok了，老婆的破黑米终于焕发光彩了，嘿嘿，解决办法我就直接抄过来好了。
		

####**解决办法**

1. 把Android手机开启调试模式，然后连接在我们的Mac OS上。

2. 选择Mac的 关于本机->更多信息-> 系统报告->找到usb选项，右边会出现一系列和usb相关的设备我们找到自己的Android设备并选中。

3. 选中后找到 供应商ID或叫厂商ID，我的HMI A1手机显示的供应商ID是：0x22da

4. ![hmi ok]({{ BASE_PATH }}/assets/images/mac_eclipse_hmi.png)

5. 打开Mac终端 输入： echo 0x2a45 >> ~/.android/adb_usb.ini

6.  然后重启adb后再打开eclipse 你会发现Android手机的设备显示了。这样的办法还可以解决Mac上其他android设备不显示的问题。

7.  ![hmi]({{ BASE_PATH }}/assets/images/mac_eclipse_hmi_ok.png)

好了，睡觉～



