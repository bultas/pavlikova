
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
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
        return `
            <figure
                class="gallery-box"
                style="width: ${box.width}px; height: ${box.height}px; top: ${box.top}px; left: ${box.left}px"
                itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"
            >
                <a
                    href="${sources[index].src}"
                    data-size="${sources[index].width}x${sources[index].height}"
                    itemprop="contentUrl"
                >
                    <img
                        src="${sources[index].src}"
                        width="${box.width}"
                        height="${box.height}"
                        itemprop="thumbnail"
                    />
                </a>
            </figure>
        `
    }).join('\n')
}

function getRatios(images) {
    return images.map(function(image) {
        return (image.width /2) / (image.height/2);
    })
}

function getContainerWidth(elem, maxWidth) {
    const currentWidth = elem.offsetWidth;
    if (!maxWidth) return currentWidth;
    return (currentWidth < maxWidth) ? currentWidth : maxWidth;
}

function prepareGalleryLayout(sources, ratios, elem, containerWidth) {
    var justifiedLayout = require('justified-layout');

    var galleryGeometry = justifiedLayout(
        ratios,
        {
            containerWidth: containerWidth,
            containerPadding: 0
        }
    );

    var boxes = getPhotosContainers(
        sources,
        galleryGeometry.boxes
    )

    elem.innerHTML = boxes;
    elem.style.height = galleryGeometry.containerHeight + "px";

}
