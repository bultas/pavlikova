'use strict';

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function getPhotosContainers(sources, geometryBoxes) {
    return geometryBoxes.map(function (box, index) {
        return '\n            <figure\n                class="gallery-box"\n                style="width: ' + box.width + 'px; height: ' + box.height + 'px; top: ' + box.top + 'px; left: ' + box.left + 'px"\n                itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"\n            >\n                <a\n                    href="' + sources[index].src + '"\n                    data-size="' + sources[index].width + 'x' + sources[index].height + '"\n                    itemprop="contentUrl"\n                >\n                    <img\n                        src="' + sources[index].src + '"\n                        width="' + box.width + '"\n                        height="' + box.height + '"\n                        itemprop="thumbnail"\n                    />\n                </a>\n            </figure>\n        ';
    }).join('\n');
}

function getRatios(images) {
    return images.map(function (image) {
        return image.width / 2 / (image.height / 2);
    });
}

function getContainerWidth(elem, maxWidth) {
    var currentWidth = elem.offsetWidth;
    if (!maxWidth) return currentWidth;
    return currentWidth < maxWidth ? currentWidth : maxWidth;
}

function prepareGalleryLayout(sources, ratios, elem, containerWidth) {
    var justifiedLayout = require('justified-layout');

    var galleryGeometry = justifiedLayout(ratios, {
        containerWidth: containerWidth,
        containerPadding: 0
    });

    var boxes = getPhotosContainers(sources, galleryGeometry.boxes);

    elem.innerHTML = boxes;
    elem.style.height = galleryGeometry.containerHeight + "px";
}
