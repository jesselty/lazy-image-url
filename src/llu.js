! function(window, document, $, undefined) {
    var lazyLoadElements = $('[lazy-image-url]'),
        objOfOnLoadImgElems = {},
        objOfLazyImgElems = {},
        elem,
        timeoutId;
    lazyLoadElements.each(function() {
        $(this).prepend('<div class="llu-smooth-img-load"></div>');
        elem = $(this).find('.llu-smooth-img-load');

        if ($(this).attr('on-load') === undefined) {
            if (objOfLazyImgElems[$(this).offset().top] === undefined) {
                objOfLazyImgElems[$(this).offset().top] = [];
            }
            objOfLazyImgElems[$(this).offset().top].push({
                'elem': elem,
                'url': $(this).attr('lazy-image-url')
            });
        } else {
            if (objOfOnLoadImgElems[$(this).offset().top] === undefined) {
                objOfOnLoadImgElems[$(this).offset().top] = [];
            }
            objOfOnLoadImgElems[$(this).offset().top].push({
                'elem': elem,
                'url': $(this).attr('lazy-image-url')
            });
        }
    });

    function setImageIfInViewportFn(obj, forceLoad) {
        for (var a in obj) {
            var eachBlock = obj[a];
            if (forceLoad || parseInt(a, 10) < $(window).scrollTop() + ($(window).height())) {
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
