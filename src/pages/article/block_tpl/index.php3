<!Doctype html>
<html xmlns=http://www.w3.org/1999/xhtml lang="zh-CN">
<head>
  <meta http-equiv=Content-Type content="text/html;charset=utf-8">
  <meta http-equiv=X-UA-Compatible content="IE=edge,chrome=1">
  <title><?php if (Yii::app()->controller->id == 'index') {
          echo '极果-全球好物消费推荐平台';
      } else {
          echo CHtml::encode($this->pageTitle) . '-极果';
      } ?></title>
  <meta name="description" content="<?php echo $this->description; ?>"/>
  <meta name="keywords" content="<?php echo $this->keywords; ?>"/>
  <meta name="mobile-agent" content="format=html5;url=http://m.jiguo.com/"/>
  <link rel="dns-prefetch" href="//www.jiguo.com">
  <link rel="dns-prefetch" href="//cdn.jiguo.com">
  <link rel="dns-prefetch" href="//s1.jiguo.com">
  <link rel="dns-prefetch" href="//pic.jiguo.com">
  <link rel="stylesheet" href="http://cdn.jiguo.com/static/Pc/develope/style/css/base.css">
  <link rel="stylesheet" href="<?php echo CDN_PC_ROOT; ?>/style/css/base.css">
</head>
<body>

<!--主体-->
<div id="app"></div>

<script>
	var _hmt = _hmt || [];
	(function () {
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?79716ddfe2f8942d32e445516e53e672";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})();

	(function () {
		var bp = document.createElement('script');
		var curProtocol = window.location.protocol.split(':')[0];
		if (curProtocol === 'https') {
			bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
		}
		else {
			bp.src = 'http://push.zhanzhang.baidu.com/push.js';
		}
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(bp, s);
	})();

  <?php
  $array_data = array_merge(json_decode(CJSON::encode($blog), true), array(
      'content' => $blogfild->message,
      'img' => json_decode($blogfild->img, true) ? json_decode($blogfild->img, true) : array()
  ));
  if ($array_data['addtime']) {
      $array_data['addtime'] = date('m-d H:i:s', $array_data['addtime']);
  }
  $array_data = json_encode($array_data);
  ?>
	window.__ORDER_META__ = <?php echo json_encode($order_meta);?>;
	window.__ORDER_META__ = window.__ORDER_META__ ? window.__ORDER_META__ : {};
	window.__BLOG_DATA__ = <?php echo $array_data;?>;
	window.__BLOG_DATA__ = window.__BLOG_DATA__ ? window.__BLOG_DATA__ : {};
	window.__ORDER_DATA__ = <?php echo json_encode($order);?>;
	window.__BLOG_ID__ = window.__BLOG_DATA__ && window.__BLOG_DATA__.blogid;

</script>
</body>
</html>