/* ==========================================================================
	ちょっとスクロールしたら「ページの先頭へ」を表示
   ========================================================================== */

$(function() {
	var topBtn = $('.back-to-top');
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
	//スクロールしてトップ
	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});
});

/* ==========================================================================
	ちょっとスクロールしたら「申し込みボタン」を表示
   ========================================================================== */

$(function() {
	var topBtn = $('.sticky-footer-btn');
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
});

/* ==========================================================================
	カウントダウンタイマー
   ========================================================================== */

function CountdownTimer(elm,tl,mes){
	this.initialize.apply(this,arguments);
}
CountdownTimer.prototype={
	initialize:function(elm,tl,mes) {
		this.elem = document.getElementById(elm);
		this.tl = tl;
		this.mes = mes;
	},countDown:function(){
		var timer='';
		var today=new Date();
		var day=Math.floor((this.tl-today)/(24*60*60*1000));
		var hour=Math.floor(((this.tl-today)%(24*60*60*1000))/(60*60*1000));
		var min=Math.floor(((this.tl-today)%(24*60*60*1000))/(60*1000))%60;
		var sec=Math.floor(((this.tl-today)%(24*60*60*1000))/1000)%60%60;
		var milli=Math.floor(((this.tl-today)%(24*60*60*1000))/10)%100;
		var me=this;

		if( ( this.tl - today ) > 0 ){
		
				timer += '<span class="num day">'+day+'</span>日';
				timer += '<span class="num hour">'+hour+'</span>時間';
				timer += '<span class="num min">'+this.addZero(min)+'</span>分<span class="num sec">'+this.addZero(sec)+'</span>秒<span class="num milli">'+this.addZero(milli)+'</span>';
				this.elem.innerHTML = timer;
				tid = setTimeout( function(){me.countDown();},10 );
		}else{
				this.elem.innerHTML = this.mes;
				return;
		}
	},addZero:function(num){ return ('0'+num).slice(-2); }
}
