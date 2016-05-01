! function(window, document, $, undefined) {
    var lazyLoadElements = $('[lazy-image-url]'),
        objOfOnLoadImgElems = {},
        objOfLazyImgElems = {},
        elem,
        timeoutId;
    lazyLoadElements.each(function() {
        var self = this,
            $self = $(this),
            $selfOffsetTop = $self.offset().top;
            
        $self.prepend('<div class="llu-smooth-img-load"></div>');
        elem = $self.find('.llu-smooth-img-load');

        if ($self.attr('on-load') === undefined) {
            if (objOfLazyImgElems[$selfOffsetTop] === undefined) {
                objOfLazyImgElems[$selfOffsetTop] = [];
            }
            objOfLazyImgElems[$selfOffsetTop].push({
                'elem': elem,
                'url': $self.attr('lazy-image-url')
            });
        } else {
            if (objOfOnLoadImgElems[$selfOffsetTop] === undefined) {
                objOfOnLoadImgElems[$selfOffsetTop] = [];
            }
            objOfOnLoadImgElems[$selfOffsetTop].push({
                'elem': elem,
                'url': $self.attr('lazy-image-url')
            });
        }
    });

    function setImageIfInViewportFn(obj, forceLoad) {
        var $window = $(window),
            $windowScrollTop = $window.scrollTop(),
            $windowHeight = $window.height();
        for (var a in obj) {
            var eachBlock = obj[a];
            if (forceLoad || parseInt(a, 10) < $windowScrollTop + $windowHeight) {
                for (var i = 0, len = eachBlock.length; i < len; i++) {
                    var img = document.createElement('img');
                    img.src = eachBlock[i].url;
                    img.onload = function(eachElem) {
                        return function() {
                            eachElem.elem.css(
                                'background-image',
                                'url(' + eachElem.url + ')'
                            ).addClass('llu-img-loaded');
                        }
                    }(eachBlock[i]);
                }
                delete obj[a];
            }
        }
    }

    if (('readyState' in document) && document.readyState == 'complete') {
        setImageIfInViewportFn();
    } else {
        window.addEventListener("load", function() {
            setImageIfInViewportFn(objOfOnLoadImgElems, true);
            setImageIfInViewportFn(objOfLazyImgElems, false);
        }, false);
    }

    window.addEventListener('scroll', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            setImageIfInViewportFn(objOfLazyImgElems, false);
        }, 300);
    }, false);
}(window, document, jQuery);
