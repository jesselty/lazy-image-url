! function(window, document, $, undefined) {
    var lazyLoadElements = $('[data-lazy-image]'),
        objOfOnLoadImgElems = {},
        objOfLazyImgElems = {},
        scrollTimeoutId, resizeTimeoutId;

    function calculateOffsetFn() {
        lazyLoadElements.each(function() {
            var self = this,
                $self = $(this),
                $selfOffsetTop = $self.offset().top;

            if ($self.attr('on-win-load') === undefined) {
                if (objOfLazyImgElems[$selfOffsetTop] === undefined) {
                    objOfLazyImgElems[$selfOffsetTop] = [];
                }
                objOfLazyImgElems[$selfOffsetTop].push({
                    'elem': $self,
                    'url': $self.attr('data-lazy-image')
                });
            } else {
                if (objOfOnLoadImgElems[$selfOffsetTop] === undefined) {
                    objOfOnLoadImgElems[$selfOffsetTop] = [];
                }
                objOfOnLoadImgElems[$selfOffsetTop].push({
                    'elem': $self,
                    'url': $self.attr('data-lazy-image')
                });
            }
        });
    }

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
                        return eachElem.elem[0].nodeName.toLowerCase() == "img" ?
                            function() {
                                eachElem.elem.attr(
                                    'src',
                                    eachElem.url
                                ).addClass('llu-img-loaded');
                            } :
                            function() {
                                eachElem.elem.css(
                                    'background-image',
                                    'url(' + eachElem.url + ')'
                                ).addClass('llu-img-loaded');
                            };
                    }(eachBlock[i]);
                }
                delete obj[a];
            }
        }
    }

    calculateOffsetFn();

    if (('readyState' in document) && document.readyState == 'complete') {
        setImageIfInViewportFn();
    } else {
        window.addEventListener("load", function() {
            setImageIfInViewportFn(objOfOnLoadImgElems, true);
            setImageIfInViewportFn(objOfLazyImgElems, false);
        }, false);
    }

    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeoutId);
        scrollTimeoutId = setTimeout(function() {
            setImageIfInViewportFn(objOfLazyImgElems, false);
        }, 300);
    }, false);

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(function() {
            objOfOnLoadImgElems = {};
            objOfLazyImgElems = {};
            calculateOffsetFn();
        }, 300);
    }, false);
}(window, document, jQuery);
