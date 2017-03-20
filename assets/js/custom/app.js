(function () {

  'use strict';

  jQuery(function($) {

    var app = {
      stateCls: {
        handheld   : 'touch',
        notHandheld: 'no-touch'
      },
      isHandheld: {
        Android: function() {
          return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function() {
          return navigator.userAgent.match(/IEMobile/i)
        },
        any: function() {
          return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows()
        }
      },
      checkTouch: function() {
        var $el = $('html'),
            isTouch = this.stateCls.handheld,
            noTouch = this.stateCls.notHandheld;

        if (this.isHandheld.any() != null) {
          $el.removeClass(noTouch);
          $el.addClass(isTouch);
        }
      },
      init : function() {
        customNavSlider.initSLider();
        customNavSlider.countInfo();
        rangeSlider.initSlider();
        this.checkTouch();
      }
    }
/* Slider =================================================================== */
    var Slider = {
      config: {
        sliderId: ''
      },
      getSlider : function() {
        return $(document.getElementById(this.config.sliderId));
      },
      getOptions : function() {},
      setSlider : function() {
        var slider = this.getSlider();

        slider.slick(this.getOptions());
      },
      initSLider : function() {
        var slider = this.getSlider();

        if (slider) {
          this.setSlider();
        }
      }
    }
/* Custom nav slider with slides countInfo ================================== */
    var customNavSlider = Object.create(Slider);

    customNavSlider.config = {
      sliderId: 'slider-included'
    }

    customNavSlider.getOptions = function() {
      return {
          centerMode: true,
          variableWidth: true,
          slidesToShow: 5,
          initialSlide: 2,
          infinite: false,
          prevArrow: $('.prev-arrow'),
          nextArrow: $('.next-arrow'),
        }
    }

    customNavSlider.countInfo = function() {
      this.getSlider().on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
          var i = (currentSlide ? currentSlide : 0) + 1;
          $('.slider-countInfo').text(i + '/' + slick.slideCount);
      });
    }
/* Range slider ============================================================= */
  var rangeSlider = {
    config : {
      sliderId: 'range-slider',
      curValId: 'range-slider-amount',

      dividers: {
        cssClass: 'slider-range-divider',
        tag     : 'span'
      },

      format: {
        set : {
          decimals: 0,
          thousand: ','
        },
        unset : {
          decimals: 0,
          thousand: ''
        }
      },

      dragTip : {
        cssClass       : 'slider-range-tip',
        minValCssClass : 'slider-range-tip--min',
        maxValCssClass : 'slider-range-tip--max'
      }
    },
    getSlider : function() {
      return document.getElementById(this.config.sliderId);
    },
    getOptions : function() {
      var slider = this.getSlider();

      return {
        start: slider.getAttribute('data-range-start') || 0,
        max: slider.getAttribute('data-range-max') || 0,
        min: slider.getAttribute('data-range-min') || 0,
        step: slider.getAttribute('data-range-step') || 0
      }
    },
    createDivider : function() {
      var el = document.createElement(this.config.dividers.tag);
          el = $(el).addClass(this.config.dividers.cssClass);

        return el;
    },
    setDivivders : function() {
      var options = this.getOptions(),
          rangesAmount = options.max/options.step,
          dividersIndent = (100/rangesAmount).toFixed(4),
          i = 1;

      while (i < rangesAmount) {
        var el = this.createDivider();

        el.css('left', dividersIndent * i + '%');
        $(this.getSlider()).append(el);

        i++;
      }
    },
    getDragTip : function() {
      var $tip = $('.' + this.config.dragTip.cssClass);

      if ($tip) {
        return $tip;
      }
    },
    updateTip : function() {
      var slider  = this.getSlider(),
          options = this.getOptions(),
          format  = wNumb(this.config.format.unset),
          value   = format.from(slider.noUiSlider.get()),
          $tip    = this.getDragTip(),
          maxValueReached = this.config.dragTip.maxValCssClass,
          minValueReached = this.config.dragTip.minValCssClass;

      if (value == options.min) {
        $tip.addClass(minValueReached);
      } else if (value == options.max) {
        $tip.addClass(maxValueReached);
      } else {
        $tip.removeClass(minValueReached + ' ' + maxValueReached);
      }
    },
    addDragTip : function() {
      var _this  = this,
          slider = this.getSlider(),
          $tip   = this.getDragTip();

      slider.noUiSlider.on('update', function(){
        var handle = $(slider).find('.noUi-handle');
        handle.append($tip);

        _this.updateTip();
      });
    },
    initSlider : function() {
      var slider  = this.getSlider(),
          options = this.getOptions(),
          _this   = this;

      if (slider) {
        noUiSlider.create(slider, {
          start: +options.start,
          animate: true,
          tooltips: true,
          format: wNumb(_this.config.format.set),
          connect: [false, true],
          step: +options.step,
          range: {
            'min': [ +options.min ],
            'max': [ +options.max ]
          }
        });

        this.setDivivders();
        this.addDragTip();
      }
    }
  }

  app.init();

  });
})();
