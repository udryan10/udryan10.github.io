$(function(){
	if(screen.orientation && screen.orientation.lock) screen.orientation.lock("portrait");
	var iamimg = 0;
	var sliding = false;
	var transforms = (('WebkitTransform' in document.body.style || 'transform' in document.body.style) && window.location.href.indexOf("notransform") == -1);
	var swipestart;
	zoomed = false;

	if('backgroundSize' in document.body.style) {
		$(".slide").addClass("background-size");
	}

	if (window.location.pathname.replace("/","").length && $("#" + window.location.pathname.replace("/","") + ".slide").length) {
		changeSlide($("#" + window.location.pathname.replace("/","") + ".slide"));
	}

	window.onpopstate = function () {
		if (window.location.pathname.replace("/","").length) {
			changeSlide($(".slide#" + window.location.pathname.replace("/","")));
		} else {
			changeSlide($("#landing"));
		}
	}

	function resizeBio() {
		var windowHeight = $(window).height();
		$("#menu .inner").css({
			height: windowHeight - (windowHeight/2 + 160)
		});
	}

	resizeBio();
	$(window).on("resize", resizeBio);

	$("a").on("focus", function (e) {
		e.preventDefault();
	})

	$("img").on("load", function () {
		$(this).css("opacity",1);
	}).each(function () {
		if (this.complete) $(this).css("opacity",1);
	});

	function changeSlide (newSlide, rewriteHistory) {
		$(".slide.active").removeClass("active");
		$(newSlide).addClass("active");

		if ("pushState" in history && rewriteHistory) {
			if ($(newSlide).attr("id") == "landing") {
				$("#container").one('transitionend', function() {
					history.pushState("", document.title, "http://" + window.location.hostname);
				});
			} else {
				$("#container").one('transitionend', function() {
					history.pushState("", document.title, "http://" + window.location.hostname + "/" + $(newSlide).attr("id"));
				});
			}
		}

		$("a.home").css({right: ($(newSlide).attr("id") == "landing") ? -52.0833333 : 0});

		if (transforms) {
			var translate = "translate3d(" + (0 - ($(newSlide).prevAll(".slide").length * (zoomed ? 52.0833333 : 100))) + "%, 0, 0)" + (zoomed ? " scale(0.5208333)" : " scale(1)"); 
			$("#container").css({
				"-webkit-transform": translate,
				"transform": translate
			});
		} else {
			$("#container").css({
				left: (0 - ($(newSlide).prevAll(".slide").length * 100)) + "%"
			});
		}
	}

	zoom = function () {
		if(!zoomed) {
			zoomed = true;
			changeSlide($(".slide.active"));
			$("body").addClass("zoomed");
		} else {
			zoomed = false;
			changeSlide($(".slide.active"));
			$("body").removeClass("zoomed");
		}
	}

	$(".slide").each(function () {
		var slide = $(this);
		var zoomIn = $("<a></a>").attr("href","#").addClass("zoom-in");
		slide.append(zoomIn);
	});

	$(".slide .zoom-in").on("click", function (e) {
		e.preventDefault();
		if($(this).parents(".slide").hasClass("active")) {
			zoomed = false;
			$("body").removeClass("zoomed");
		}
		changeSlide($(this).parents(".slide"), true);
	});

	$(".slide h1").on("click", function () {
		changeSlide($(this).parents(".slide"), true);
	});

	$(".zoom").on("click", function (e) {
		e.preventDefault();
		zoom();
	});

	$(".home").on("click", function (e) {
		e.preventDefault();
		changeSlide($("#landing"), true);
	});

	$(".goleft").on("click", function (e) {
		e.preventDefault();
		changeSlide($(".slide.active").next(".slide"), true);
	});

	$(".goright").on("click", function (e) {
		e.preventDefault();
		changeSlide($(".slide.active").prev(".slide"), true);
	});

	$(".gohome").on("click", function (e) {
		e.preventDefault();
		changeSlide($("#landing"), true);
	});

	$("#container").hammer({
		drag_block_horizontal: true
	}).on("swipeleft", function (e) {
		$(".active .goleft").click();
	}).on("swiperight", function (e) {
		$(".active .goright").click();
	}).on("pinchin", function (e) {
		if($(window).width() > 500) {
			zoomed = true;
			changeSlide($(".slide.active"));
			$("body").addClass("zoomed");
		}
	}).on("pinchout", function (e) {
		if($(window).width() > 500) {
			zoomed = false;
			changeSlide($(".slide.active"));
			$("body").removeClass("zoomed");
		}
	});
	
	$(document).keydown(function (e) {
		if (e.which == 37) {
			$(window).trigger("swiperight");
		} else if (e.which == 39) {
			$(window).trigger("swipeleft");
		} else if (e.which == 38) {
			if ($(".active .gohome").length) {
				$(".active .gohome").click();
			}
		}
	});
	
	$("#iamleft, #iamright").on("click", function (e) {

		if ($(this).attr("id") == "iamright") iamimg++;
		else if ($(this).attr("id") == "iamleft") iamimg--;

		if(iamimg > 3) iamimg = 0;
		if(iamimg < 0) iamimg = 3;

		if (transforms) {
			var translate = "translate(" + (0 - (100 * iamimg)) + "%, 0)"; 
			$("#iamslider .inner").css({
				"-webkit-transform": translate,
				"transform": translate
			});
		} else {
			$("#iamslider .inner").css({left: (0 - (100 * iamimg)) + "%"});
		}

		var indicators = $("#iamindicators div")

		indicators.removeClass("active");
		$(indicators[iamimg]).addClass("active");
	});
	
});


