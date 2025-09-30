//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/andruschka_bootstrap-image-gallery/packages/andruschka_bootstrap-image-gallery.js       //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/blueimp-gallery.js                       //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * blueimp Gallery JS 2.11.7                                                                // 2
 * https://github.com/blueimp/Gallery                                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Swipe implementation based on                                                            // 8
 * https://github.com/bradbirdsall/Swipe                                                    // 9
 *                                                                                          // 10
 * Licensed under the MIT license:                                                          // 11
 * http://www.opensource.org/licenses/MIT                                                   // 12
 */                                                                                         // 13
                                                                                            // 14
/* global define, window, document, DocumentTouch */                                        // 15
                                                                                            // 16
(function (factory) {                                                                       // 17
    'use strict';                                                                           // 18
    if (typeof define === 'function' && define.amd) {                                       // 19
        // Register as an anonymous AMD module:                                             // 20
        define(['./blueimp-helper'], factory);                                              // 21
    } else {                                                                                // 22
        // Browser globals:                                                                 // 23
        window.blueimp = window.blueimp || {};                                              // 24
        window.blueimp.Gallery = factory(                                                   // 25
            window.blueimp.helper || window.jQuery                                          // 26
        );                                                                                  // 27
    }                                                                                       // 28
}(function ($) {                                                                            // 29
    'use strict';                                                                           // 30
                                                                                            // 31
    function Gallery(list, options) {                                                       // 32
        if (!list || !list.length || document.body.style.maxHeight === undefined) {         // 33
            // document.body.style.maxHeight is undefined on IE6 and lower                  // 34
            return null;                                                                    // 35
        }                                                                                   // 36
        if (!this || this.options !== Gallery.prototype.options) {                          // 37
            // Called as function instead of as constructor,                                // 38
            // so we simply return a new instance:                                          // 39
            return new Gallery(list, options);                                              // 40
        }                                                                                   // 41
        this.list = list;                                                                   // 42
        this.num = list.length;                                                             // 43
        this.initOptions(options);                                                          // 44
        this.initialize();                                                                  // 45
    }                                                                                       // 46
                                                                                            // 47
    $.extend(Gallery.prototype, {                                                           // 48
                                                                                            // 49
        options: {                                                                          // 50
            // The Id, element or querySelector of the gallery widget:                      // 51
            container: '#blueimp-gallery',                                                  // 52
            // The tag name, Id, element or querySelector of the slides container:          // 53
            slidesContainer: 'div',                                                         // 54
            // The tag name, Id, element or querySelector of the title element:             // 55
            titleElement: 'h3',                                                             // 56
            // The class to add when the gallery is visible:                                // 57
            displayClass: 'blueimp-gallery-display',                                        // 58
            // The class to add when the gallery controls are visible:                      // 59
            controlsClass: 'blueimp-gallery-controls',                                      // 60
            // The class to add when the gallery only displays one element:                 // 61
            singleClass: 'blueimp-gallery-single',                                          // 62
            // The class to add when the left edge has been reached:                        // 63
            leftEdgeClass: 'blueimp-gallery-left',                                          // 64
            // The class to add when the right edge has been reached:                       // 65
            rightEdgeClass: 'blueimp-gallery-right',                                        // 66
            // The class to add when the automatic slideshow is active:                     // 67
            playingClass: 'blueimp-gallery-playing',                                        // 68
            // The class for all slides:                                                    // 69
            slideClass: 'slide',                                                            // 70
            // The slide class for loading elements:                                        // 71
            slideLoadingClass: 'slide-loading',                                             // 72
            // The slide class for elements that failed to load:                            // 73
            slideErrorClass: 'slide-error',                                                 // 74
            // The class for the content element loaded into each slide:                    // 75
            slideContentClass: 'slide-content',                                             // 76
            // The class for the "toggle" control:                                          // 77
            toggleClass: 'toggle',                                                          // 78
            // The class for the "prev" control:                                            // 79
            prevClass: 'prev',                                                              // 80
            // The class for the "next" control:                                            // 81
            nextClass: 'next',                                                              // 82
            // The class for the "close" control:                                           // 83
            closeClass: 'close',                                                            // 84
            // The class for the "play-pause" toggle control:                               // 85
            playPauseClass: 'play-pause',                                                   // 86
            // The list object property (or data attribute) with the object type:           // 87
            typeProperty: 'type',                                                           // 88
            // The list object property (or data attribute) with the object title:          // 89
            titleProperty: 'title',                                                         // 90
            // The list object property (or data attribute) with the object URL:            // 91
            urlProperty: 'href',                                                            // 92
            // The gallery listens for transitionend events before triggering the           // 93
            // opened and closed events, unless the following option is set to false:       // 94
            displayTransition: true,                                                        // 95
            // Defines if the gallery slides are cleared from the gallery modal,            // 96
            // or reused for the next gallery initialization:                               // 97
            clearSlides: true,                                                              // 98
            // Defines if images should be stretched to fill the available space,           // 99
            // while maintaining their aspect ratio (will only be enabled for browsers      // 100
            // supporting background-size="contain", which excludes IE < 9).                // 101
            // Set to "cover", to make images cover all available space (requires           // 102
            // support for background-size="cover", which excludes IE < 9):                 // 103
            stretchImages: false,                                                           // 104
            // Toggle the controls on pressing the Return key:                              // 105
            toggleControlsOnReturn: true,                                                   // 106
            // Toggle the automatic slideshow interval on pressing the Space key:           // 107
            toggleSlideshowOnSpace: true,                                                   // 108
            // Navigate the gallery by pressing left and right on the keyboard:             // 109
            enableKeyboardNavigation: true,                                                 // 110
            // Close the gallery on pressing the Esc key:                                   // 111
            closeOnEscape: true,                                                            // 112
            // Close the gallery when clicking on an empty slide area:                      // 113
            closeOnSlideClick: true,                                                        // 114
            // Close the gallery by swiping up or down:                                     // 115
            closeOnSwipeUpOrDown: true,                                                     // 116
            // Emulate touch events on mouse-pointer devices such as desktop browsers:      // 117
            emulateTouchEvents: true,                                                       // 118
            // Hide the page scrollbars:                                                    // 119
            hidePageScrollbars: true,                                                       // 120
            // Stops any touches on the container from scrolling the page:                  // 121
            disableScroll: true,                                                            // 122
            // Carousel mode (shortcut for carousel specific options):                      // 123
            carousel: false,                                                                // 124
            // Allow continuous navigation, moving from last to first                       // 125
            // and from first to last slide:                                                // 126
            continuous: true,                                                               // 127
            // Remove elements outside of the preload range from the DOM:                   // 128
            unloadElements: true,                                                           // 129
            // Start with the automatic slideshow:                                          // 130
            startSlideshow: false,                                                          // 131
            // Delay in milliseconds between slides for the automatic slideshow:            // 132
            slideshowInterval: 5000,                                                        // 133
            // The starting index as integer.                                               // 134
            // Can also be an object of the given list,                                     // 135
            // or an equal object with the same url property:                               // 136
            index: 0,                                                                       // 137
            // The number of elements to load around the current index:                     // 138
            preloadRange: 2,                                                                // 139
            // The transition speed between slide changes in milliseconds:                  // 140
            transitionSpeed: 400,                                                           // 141
            // The transition speed for automatic slide changes, set to an integer          // 142
            // greater 0 to override the default transition speed:                          // 143
            slideshowTransitionSpeed: undefined,                                            // 144
            // The event object for which the default action will be canceled               // 145
            // on Gallery initialization (e.g. the click event to open the Gallery):        // 146
            event: undefined,                                                               // 147
            // Callback function executed when the Gallery is initialized.                  // 148
            // Is called with the gallery instance as "this" object:                        // 149
            onopen: undefined,                                                              // 150
            // Callback function executed when the Gallery has been initialized             // 151
            // and the initialization transition has been completed.                        // 152
            // Is called with the gallery instance as "this" object:                        // 153
            onopened: undefined,                                                            // 154
            // Callback function executed on slide change.                                  // 155
            // Is called with the gallery instance as "this" object and the                 // 156
            // current index and slide as arguments:                                        // 157
            onslide: undefined,                                                             // 158
            // Callback function executed after the slide change transition.                // 159
            // Is called with the gallery instance as "this" object and the                 // 160
            // current index and slide as arguments:                                        // 161
            onslideend: undefined,                                                          // 162
            // Callback function executed on slide content load.                            // 163
            // Is called with the gallery instance as "this" object and the                 // 164
            // slide index and slide element as arguments:                                  // 165
            onslidecomplete: undefined,                                                     // 166
            // Callback function executed when the Gallery is about to be closed.           // 167
            // Is called with the gallery instance as "this" object:                        // 168
            onclose: undefined,                                                             // 169
            // Callback function executed when the Gallery has been closed                  // 170
            // and the closing transition has been completed.                               // 171
            // Is called with the gallery instance as "this" object:                        // 172
            onclosed: undefined                                                             // 173
        },                                                                                  // 174
                                                                                            // 175
        carouselOptions: {                                                                  // 176
            hidePageScrollbars: false,                                                      // 177
            toggleControlsOnReturn: false,                                                  // 178
            toggleSlideshowOnSpace: false,                                                  // 179
            enableKeyboardNavigation: false,                                                // 180
            closeOnEscape: false,                                                           // 181
            closeOnSlideClick: false,                                                       // 182
            closeOnSwipeUpOrDown: false,                                                    // 183
            disableScroll: false,                                                           // 184
            startSlideshow: true                                                            // 185
        },                                                                                  // 186
                                                                                            // 187
        // Detect touch, transition, transform and background-size support:                 // 188
        support: (function (element) {                                                      // 189
            var support = {                                                                 // 190
                    touch: window.ontouchstart !== undefined ||                             // 191
                        (window.DocumentTouch && document instanceof DocumentTouch)         // 192
                },                                                                          // 193
                transitions = {                                                             // 194
                    webkitTransition: {                                                     // 195
                        end: 'webkitTransitionEnd',                                         // 196
                        prefix: '-webkit-'                                                  // 197
                    },                                                                      // 198
                    MozTransition: {                                                        // 199
                        end: 'transitionend',                                               // 200
                        prefix: '-moz-'                                                     // 201
                    },                                                                      // 202
                    OTransition: {                                                          // 203
                        end: 'otransitionend',                                              // 204
                        prefix: '-o-'                                                       // 205
                    },                                                                      // 206
                    transition: {                                                           // 207
                        end: 'transitionend',                                               // 208
                        prefix: ''                                                          // 209
                    }                                                                       // 210
                },                                                                          // 211
                elementTests = function () {                                                // 212
                    var transition = support.transition,                                    // 213
                        prop,                                                               // 214
                        translateZ;                                                         // 215
                    document.body.appendChild(element);                                     // 216
                    if (transition) {                                                       // 217
                        prop = transition.name.slice(0, -9) + 'ransform';                   // 218
                        if (element.style[prop] !== undefined) {                            // 219
                            element.style[prop] = 'translateZ(0)';                          // 220
                            translateZ = window.getComputedStyle(element)                   // 221
                                .getPropertyValue(transition.prefix + 'transform');         // 222
                            support.transform = {                                           // 223
                                prefix: transition.prefix,                                  // 224
                                name: prop,                                                 // 225
                                translate: true,                                            // 226
                                translateZ: !!translateZ && translateZ !== 'none'           // 227
                            };                                                              // 228
                        }                                                                   // 229
                    }                                                                       // 230
                    if (element.style.backgroundSize !== undefined) {                       // 231
                        support.backgroundSize = {};                                        // 232
                        element.style.backgroundSize = 'contain';                           // 233
                        support.backgroundSize.contain = window                             // 234
                                .getComputedStyle(element)                                  // 235
                                .getPropertyValue('background-size') === 'contain';         // 236
                        element.style.backgroundSize = 'cover';                             // 237
                        support.backgroundSize.cover = window                               // 238
                                .getComputedStyle(element)                                  // 239
                                .getPropertyValue('background-size') === 'cover';           // 240
                    }                                                                       // 241
                    document.body.removeChild(element);                                     // 242
                };                                                                          // 243
            (function (support, transitions) {                                              // 244
                var prop;                                                                   // 245
                for (prop in transitions) {                                                 // 246
                    if (transitions.hasOwnProperty(prop) &&                                 // 247
                            element.style[prop] !== undefined) {                            // 248
                        support.transition = transitions[prop];                             // 249
                        support.transition.name = prop;                                     // 250
                        break;                                                              // 251
                    }                                                                       // 252
                }                                                                           // 253
            }(support, transitions));                                                       // 254
            if (document.body) {                                                            // 255
                elementTests();                                                             // 256
            } else {                                                                        // 257
                $(document).on('DOMContentLoaded', elementTests);                           // 258
            }                                                                               // 259
            return support;                                                                 // 260
            // Test element, has to be standard HTML and must not be hidden                 // 261
            // for the CSS3 tests using window.getComputedStyle to be applicable:           // 262
        }(document.createElement('div'))),                                                  // 263
                                                                                            // 264
        requestAnimationFrame: window.requestAnimationFrame ||                              // 265
            window.webkitRequestAnimationFrame ||                                           // 266
            window.mozRequestAnimationFrame,                                                // 267
                                                                                            // 268
        initialize: function () {                                                           // 269
            this.initStartIndex();                                                          // 270
            if (this.initWidget() === false) {                                              // 271
                return false;                                                               // 272
            }                                                                               // 273
            this.initEventListeners();                                                      // 274
            // Load the slide at the given index:                                           // 275
            this.onslide(this.index);                                                       // 276
            // Manually trigger the slideend event for the initial slide:                   // 277
            this.ontransitionend();                                                         // 278
            // Start the automatic slideshow if applicable:                                 // 279
            if (this.options.startSlideshow) {                                              // 280
                this.play();                                                                // 281
            }                                                                               // 282
        },                                                                                  // 283
                                                                                            // 284
        slide: function (to, speed) {                                                       // 285
            window.clearTimeout(this.timeout);                                              // 286
            var index = this.index,                                                         // 287
                direction,                                                                  // 288
                naturalDirection,                                                           // 289
                diff;                                                                       // 290
            if (index === to || this.num === 1) {                                           // 291
                return;                                                                     // 292
            }                                                                               // 293
            if (!speed) {                                                                   // 294
                speed = this.options.transitionSpeed;                                       // 295
            }                                                                               // 296
            if (this.support.transition) {                                                  // 297
                if (!this.options.continuous) {                                             // 298
                    to = this.circle(to);                                                   // 299
                }                                                                           // 300
                // 1: backward, -1: forward:                                                // 301
                direction = Math.abs(index - to) / (index - to);                            // 302
                // Get the actual position of the slide:                                    // 303
                if (this.options.continuous) {                                              // 304
                    naturalDirection = direction;                                           // 305
                    direction = -this.positions[this.circle(to)] / this.slideWidth;         // 306
                    // If going forward but to < index, use to = slides.length + to         // 307
                    // If going backward but to > index, use to = -slides.length + to       // 308
                    if (direction !== naturalDirection) {                                   // 309
                        to = -direction * this.num + to;                                    // 310
                    }                                                                       // 311
                }                                                                           // 312
                diff = Math.abs(index - to) - 1;                                            // 313
                // Move all the slides between index and to in the right direction:         // 314
                while (diff) {                                                              // 315
                    diff -= 1;                                                              // 316
                    this.move(                                                              // 317
                        this.circle((to > index ? to : index) - diff - 1),                  // 318
                        this.slideWidth * direction,                                        // 319
                        0                                                                   // 320
                    );                                                                      // 321
                }                                                                           // 322
                to = this.circle(to);                                                       // 323
                this.move(index, this.slideWidth * direction, speed);                       // 324
                this.move(to, 0, speed);                                                    // 325
                if (this.options.continuous) {                                              // 326
                    this.move(                                                              // 327
                        this.circle(to - direction),                                        // 328
                        -(this.slideWidth * direction),                                     // 329
                        0                                                                   // 330
                    );                                                                      // 331
                }                                                                           // 332
            } else {                                                                        // 333
                to = this.circle(to);                                                       // 334
                this.animate(index * -this.slideWidth, to * -this.slideWidth, speed);       // 335
            }                                                                               // 336
            this.onslide(to);                                                               // 337
        },                                                                                  // 338
                                                                                            // 339
        getIndex: function () {                                                             // 340
            return this.index;                                                              // 341
        },                                                                                  // 342
                                                                                            // 343
        getNumber: function () {                                                            // 344
            return this.num;                                                                // 345
        },                                                                                  // 346
                                                                                            // 347
        prev: function () {                                                                 // 348
            if (this.options.continuous || this.index) {                                    // 349
                this.slide(this.index - 1);                                                 // 350
            }                                                                               // 351
        },                                                                                  // 352
                                                                                            // 353
        next: function () {                                                                 // 354
            if (this.options.continuous || this.index < this.num - 1) {                     // 355
                this.slide(this.index + 1);                                                 // 356
            }                                                                               // 357
        },                                                                                  // 358
                                                                                            // 359
        play: function (time) {                                                             // 360
            var that = this;                                                                // 361
            window.clearTimeout(this.timeout);                                              // 362
            this.interval = time || this.options.slideshowInterval;                         // 363
            if (this.elements[this.index] > 1) {                                            // 364
                this.timeout = this.setTimeout(                                             // 365
                    (!this.requestAnimationFrame && this.slide) || function (to, speed) {   // 366
                        that.animationFrameId = that.requestAnimationFrame.call(            // 367
                            window,                                                         // 368
                            function () {                                                   // 369
                                that.slide(to, speed);                                      // 370
                            }                                                               // 371
                        );                                                                  // 372
                    },                                                                      // 373
                    [this.index + 1, this.options.slideshowTransitionSpeed],                // 374
                    this.interval                                                           // 375
                );                                                                          // 376
            }                                                                               // 377
            this.container.addClass(this.options.playingClass);                             // 378
        },                                                                                  // 379
                                                                                            // 380
        pause: function () {                                                                // 381
            window.clearTimeout(this.timeout);                                              // 382
            this.interval = null;                                                           // 383
            this.container.removeClass(this.options.playingClass);                          // 384
        },                                                                                  // 385
                                                                                            // 386
        add: function (list) {                                                              // 387
            var i;                                                                          // 388
            if (!list.concat) {                                                             // 389
                // Make a real array out of the list to add:                                // 390
                list = Array.prototype.slice.call(list);                                    // 391
            }                                                                               // 392
            if (!this.list.concat) {                                                        // 393
                // Make a real array out of the Gallery list:                               // 394
                this.list = Array.prototype.slice.call(this.list);                          // 395
            }                                                                               // 396
            this.list = this.list.concat(list);                                             // 397
            this.num = this.list.length;                                                    // 398
            if (this.num > 2 && this.options.continuous === null) {                         // 399
                this.options.continuous = true;                                             // 400
                this.container.removeClass(this.options.leftEdgeClass);                     // 401
            }                                                                               // 402
            this.container                                                                  // 403
                .removeClass(this.options.rightEdgeClass)                                   // 404
                .removeClass(this.options.singleClass);                                     // 405
            for (i = this.num - list.length; i < this.num; i += 1) {                        // 406
                this.addSlide(i);                                                           // 407
                this.positionSlide(i);                                                      // 408
            }                                                                               // 409
            this.positions.length = this.num;                                               // 410
            this.initSlides(true);                                                          // 411
        },                                                                                  // 412
                                                                                            // 413
        resetSlides: function () {                                                          // 414
            this.slidesContainer.empty();                                                   // 415
            this.slides = [];                                                               // 416
        },                                                                                  // 417
                                                                                            // 418
        handleClose: function () {                                                          // 419
            var options = this.options;                                                     // 420
            this.destroyEventListeners();                                                   // 421
            // Cancel the slideshow:                                                        // 422
            this.pause();                                                                   // 423
            this.container[0].style.display = 'none';                                       // 424
            this.container                                                                  // 425
                .removeClass(options.displayClass)                                          // 426
                .removeClass(options.singleClass)                                           // 427
                .removeClass(options.leftEdgeClass)                                         // 428
                .removeClass(options.rightEdgeClass);                                       // 429
            if (options.hidePageScrollbars) {                                               // 430
                document.body.style.overflow = this.bodyOverflowStyle;                      // 431
            }                                                                               // 432
            if (this.options.clearSlides) {                                                 // 433
                this.resetSlides();                                                         // 434
            }                                                                               // 435
            if (this.options.onclosed) {                                                    // 436
                this.options.onclosed.call(this);                                           // 437
            }                                                                               // 438
        },                                                                                  // 439
                                                                                            // 440
        close: function () {                                                                // 441
            var that = this,                                                                // 442
                closeHandler = function (event) {                                           // 443
                    if (event.target === that.container[0]) {                               // 444
                        that.container.off(                                                 // 445
                            that.support.transition.end,                                    // 446
                            closeHandler                                                    // 447
                        );                                                                  // 448
                        that.handleClose();                                                 // 449
                    }                                                                       // 450
                };                                                                          // 451
            if (this.options.onclose) {                                                     // 452
                this.options.onclose.call(this);                                            // 453
            }                                                                               // 454
            if (this.support.transition && this.options.displayTransition) {                // 455
                this.container.on(                                                          // 456
                    this.support.transition.end,                                            // 457
                    closeHandler                                                            // 458
                );                                                                          // 459
                this.container.removeClass(this.options.displayClass);                      // 460
            } else {                                                                        // 461
                this.handleClose();                                                         // 462
            }                                                                               // 463
        },                                                                                  // 464
                                                                                            // 465
        circle: function (index) {                                                          // 466
            // Always return a number inside of the slides index range:                     // 467
            return (this.num + (index % this.num)) % this.num;                              // 468
        },                                                                                  // 469
                                                                                            // 470
        move: function (index, dist, speed) {                                               // 471
            this.translateX(index, dist, speed);                                            // 472
            this.positions[index] = dist;                                                   // 473
        },                                                                                  // 474
                                                                                            // 475
        translate: function (index, x, y, speed) {                                          // 476
            var style = this.slides[index].style,                                           // 477
                transition = this.support.transition,                                       // 478
                transform = this.support.transform;                                         // 479
            style[transition.name + 'Duration'] = speed + 'ms';                             // 480
            style[transform.name] = 'translate(' + x + 'px, ' + y + 'px)' +                 // 481
                (transform.translateZ ? ' translateZ(0)' : '');                             // 482
        },                                                                                  // 483
                                                                                            // 484
        translateX: function (index, x, speed) {                                            // 485
            this.translate(index, x, 0, speed);                                             // 486
        },                                                                                  // 487
                                                                                            // 488
        translateY: function (index, y, speed) {                                            // 489
            this.translate(index, 0, y, speed);                                             // 490
        },                                                                                  // 491
                                                                                            // 492
        animate: function (from, to, speed) {                                               // 493
            if (!speed) {                                                                   // 494
                this.slidesContainer[0].style.left = to + 'px';                             // 495
                return;                                                                     // 496
            }                                                                               // 497
            var that = this,                                                                // 498
                start = new Date().getTime(),                                               // 499
                timer = window.setInterval(function () {                                    // 500
                    var timeElap = new Date().getTime() - start;                            // 501
                    if (timeElap > speed) {                                                 // 502
                        that.slidesContainer[0].style.left = to + 'px';                     // 503
                        that.ontransitionend();                                             // 504
                        window.clearInterval(timer);                                        // 505
                        return;                                                             // 506
                    }                                                                       // 507
                    that.slidesContainer[0].style.left = (((to - from) *                    // 508
                        (Math.floor((timeElap / speed) * 100) / 100)) +                     // 509
                            from) + 'px';                                                   // 510
                }, 4);                                                                      // 511
        },                                                                                  // 512
                                                                                            // 513
        preventDefault: function (event) {                                                  // 514
            if (event.preventDefault) {                                                     // 515
                event.preventDefault();                                                     // 516
            } else {                                                                        // 517
                event.returnValue = false;                                                  // 518
            }                                                                               // 519
        },                                                                                  // 520
                                                                                            // 521
        onresize: function () {                                                             // 522
            this.initSlides(true);                                                          // 523
        },                                                                                  // 524
                                                                                            // 525
        onmousedown: function (event) {                                                     // 526
            // Trigger on clicks of the left mouse button only                              // 527
            // and exclude video elements:                                                  // 528
            if (event.which && event.which === 1 &&                                         // 529
                    event.target.nodeName !== 'VIDEO' &&                                    // 530
                    event.target.nodeName !== 'AUDIO') {                                    // 531
                // Preventing the default mousedown action is required                      // 532
                // to make touch emulation work with Firefox:                               // 533
                (event.originalEvent || event).touches = [{                                 // 534
                    pageX: event.pageX,                                                     // 535
                    pageY: event.pageY                                                      // 536
                }];                                                                         // 537
                this.ontouchstart(event);                                                   // 538
            }                                                                               // 539
        },                                                                                  // 540
                                                                                            // 541
        onmousemove: function (event) {                                                     // 542
            if (this.touchStart) {                                                          // 543
                (event.originalEvent || event).touches = [{                                 // 544
                    pageX: event.pageX,                                                     // 545
                    pageY: event.pageY                                                      // 546
                }];                                                                         // 547
                this.ontouchmove(event);                                                    // 548
            }                                                                               // 549
        },                                                                                  // 550
                                                                                            // 551
        onmouseup: function (event) {                                                       // 552
            if (this.touchStart) {                                                          // 553
                this.ontouchend(event);                                                     // 554
                delete this.touchStart;                                                     // 555
            }                                                                               // 556
        },                                                                                  // 557
                                                                                            // 558
        onmouseout: function (event) {                                                      // 559
            if (this.touchStart) {                                                          // 560
                var target = event.target,                                                  // 561
                    related = event.relatedTarget;                                          // 562
                if (!related || (related !== target &&                                      // 563
                        !$.contains(target, related))) {                                    // 564
                    this.onmouseup(event);                                                  // 565
                }                                                                           // 566
            }                                                                               // 567
        },                                                                                  // 568
                                                                                            // 569
        ontouchstart: function (event) {                                                    // 570
            // jQuery doesn't copy touch event properties by default,                       // 571
            // so we have to access the originalEvent object:                               // 572
            var touches = (event.originalEvent || event).touches[0];                        // 573
            this.touchStart = {                                                             // 574
                // Remember the initial touch coordinates:                                  // 575
                x: touches.pageX,                                                           // 576
                y: touches.pageY,                                                           // 577
                // Store the time to determine touch duration:                              // 578
                time: Date.now()                                                            // 579
            };                                                                              // 580
            // Helper variable to detect scroll movement:                                   // 581
            this.isScrolling = undefined;                                                   // 582
            // Reset delta values:                                                          // 583
            this.touchDelta = {};                                                           // 584
        },                                                                                  // 585
                                                                                            // 586
        ontouchmove: function (event) {                                                     // 587
            // jQuery doesn't copy touch event properties by default,                       // 588
            // so we have to access the originalEvent object:                               // 589
            var touches = (event.originalEvent || event).touches[0],                        // 590
                scale = (event.originalEvent || event).scale,                               // 591
                index = this.index,                                                         // 592
                touchDeltaX,                                                                // 593
                indices;                                                                    // 594
            // Ensure this is a one touch swipe and not, e.g. a pinch:                      // 595
            if (touches.length > 1 || (scale && scale !== 1)) {                             // 596
                return;                                                                     // 597
            }                                                                               // 598
            if (this.options.disableScroll) {                                               // 599
                event.preventDefault();                                                     // 600
            }                                                                               // 601
            // Measure change in x and y coordinates:                                       // 602
            this.touchDelta = {                                                             // 603
                x: touches.pageX - this.touchStart.x,                                       // 604
                y: touches.pageY - this.touchStart.y                                        // 605
            };                                                                              // 606
            touchDeltaX = this.touchDelta.x;                                                // 607
            // Detect if this is a vertical scroll movement (run only once per touch):      // 608
            if (this.isScrolling === undefined) {                                           // 609
                this.isScrolling = this.isScrolling ||                                      // 610
                    Math.abs(touchDeltaX) < Math.abs(this.touchDelta.y);                    // 611
            }                                                                               // 612
            if (!this.isScrolling) {                                                        // 613
                // Always prevent horizontal scroll:                                        // 614
                event.preventDefault();                                                     // 615
                // Stop the slideshow:                                                      // 616
                window.clearTimeout(this.timeout);                                          // 617
                if (this.options.continuous) {                                              // 618
                    indices = [                                                             // 619
                        this.circle(index + 1),                                             // 620
                        index,                                                              // 621
                        this.circle(index - 1)                                              // 622
                    ];                                                                      // 623
                } else {                                                                    // 624
                    // Increase resistance if first slide and sliding left                  // 625
                    // or last slide and sliding right:                                     // 626
                    this.touchDelta.x = touchDeltaX =                                       // 627
                        touchDeltaX /                                                       // 628
                        (((!index && touchDeltaX > 0) ||                                    // 629
                            (index === this.num - 1 && touchDeltaX < 0)) ?                  // 630
                                (Math.abs(touchDeltaX) / this.slideWidth + 1) : 1);         // 631
                    indices = [index];                                                      // 632
                    if (index) {                                                            // 633
                        indices.push(index - 1);                                            // 634
                    }                                                                       // 635
                    if (index < this.num - 1) {                                             // 636
                        indices.unshift(index + 1);                                         // 637
                    }                                                                       // 638
                }                                                                           // 639
                while (indices.length) {                                                    // 640
                    index = indices.pop();                                                  // 641
                    this.translateX(index, touchDeltaX + this.positions[index], 0);         // 642
                }                                                                           // 643
            } else if (this.options.closeOnSwipeUpOrDown) {                                 // 644
                this.translateY(index, this.touchDelta.y + this.positions[index], 0);       // 645
            }                                                                               // 646
        },                                                                                  // 647
                                                                                            // 648
        ontouchend: function () {                                                           // 649
            var index = this.index,                                                         // 650
                speed = this.options.transitionSpeed,                                       // 651
                slideWidth = this.slideWidth,                                               // 652
                isShortDuration = Number(Date.now() - this.touchStart.time) < 250,          // 653
                // Determine if slide attempt triggers next/prev slide:                     // 654
                isValidSlide = (isShortDuration && Math.abs(this.touchDelta.x) > 20) ||     // 655
                    Math.abs(this.touchDelta.x) > slideWidth / 2,                           // 656
                // Determine if slide attempt is past start or end:                         // 657
                isPastBounds = (!index && this.touchDelta.x > 0) ||                         // 658
                        (index === this.num - 1 && this.touchDelta.x < 0),                  // 659
                isValidClose = !isValidSlide && this.options.closeOnSwipeUpOrDown &&        // 660
                    ((isShortDuration && Math.abs(this.touchDelta.y) > 20) ||               // 661
                        Math.abs(this.touchDelta.y) > this.slideHeight / 2),                // 662
                direction,                                                                  // 663
                indexForward,                                                               // 664
                indexBackward,                                                              // 665
                distanceForward,                                                            // 666
                distanceBackward;                                                           // 667
            if (this.options.continuous) {                                                  // 668
                isPastBounds = false;                                                       // 669
            }                                                                               // 670
            // Determine direction of swipe (true: right, false: left):                     // 671
            direction = this.touchDelta.x < 0 ? -1 : 1;                                     // 672
            if (!this.isScrolling) {                                                        // 673
                if (isValidSlide && !isPastBounds) {                                        // 674
                    indexForward = index + direction;                                       // 675
                    indexBackward = index - direction;                                      // 676
                    distanceForward = slideWidth * direction;                               // 677
                    distanceBackward = -slideWidth * direction;                             // 678
                    if (this.options.continuous) {                                          // 679
                        this.move(this.circle(indexForward), distanceForward, 0);           // 680
                        this.move(this.circle(index - 2 * direction), distanceBackward, 0); // 681
                    } else if (indexForward >= 0 &&                                         // 682
                            indexForward < this.num) {                                      // 683
                        this.move(indexForward, distanceForward, 0);                        // 684
                    }                                                                       // 685
                    this.move(index, this.positions[index] + distanceForward, speed);       // 686
                    this.move(                                                              // 687
                        this.circle(indexBackward),                                         // 688
                        this.positions[this.circle(indexBackward)] + distanceForward,       // 689
                        speed                                                               // 690
                    );                                                                      // 691
                    index = this.circle(indexBackward);                                     // 692
                    this.onslide(index);                                                    // 693
                } else {                                                                    // 694
                    // Move back into position                                              // 695
                    if (this.options.continuous) {                                          // 696
                        this.move(this.circle(index - 1), -slideWidth, speed);              // 697
                        this.move(index, 0, speed);                                         // 698
                        this.move(this.circle(index + 1), slideWidth, speed);               // 699
                    } else {                                                                // 700
                        if (index) {                                                        // 701
                            this.move(index - 1, -slideWidth, speed);                       // 702
                        }                                                                   // 703
                        this.move(index, 0, speed);                                         // 704
                        if (index < this.num - 1) {                                         // 705
                            this.move(index + 1, slideWidth, speed);                        // 706
                        }                                                                   // 707
                    }                                                                       // 708
                }                                                                           // 709
            } else {                                                                        // 710
                if (isValidClose) {                                                         // 711
                    this.close();                                                           // 712
                } else {                                                                    // 713
                    // Move back into position                                              // 714
                    this.translateY(index, 0, speed);                                       // 715
                }                                                                           // 716
            }                                                                               // 717
        },                                                                                  // 718
                                                                                            // 719
        ontransitionend: function (event) {                                                 // 720
            var slide = this.slides[this.index];                                            // 721
            if (!event || slide === event.target) {                                         // 722
                if (this.interval) {                                                        // 723
                    this.play();                                                            // 724
                }                                                                           // 725
                this.setTimeout(                                                            // 726
                    this.options.onslideend,                                                // 727
                    [this.index, slide]                                                     // 728
                );                                                                          // 729
            }                                                                               // 730
        },                                                                                  // 731
                                                                                            // 732
        oncomplete: function (event) {                                                      // 733
            var target = event.target || event.srcElement,                                  // 734
                parent = target && target.parentNode,                                       // 735
                index;                                                                      // 736
            if (!target || !parent) {                                                       // 737
                return;                                                                     // 738
            }                                                                               // 739
            index = this.getNodeIndex(parent);                                              // 740
            $(parent).removeClass(this.options.slideLoadingClass);                          // 741
            if (event.type === 'error') {                                                   // 742
                $(parent).addClass(this.options.slideErrorClass);                           // 743
                this.elements[index] = 3; // Fail                                           // 744
            } else {                                                                        // 745
                this.elements[index] = 2; // Done                                           // 746
            }                                                                               // 747
            // Fix for IE7's lack of support for percentage max-height:                     // 748
            if (target.clientHeight > this.container[0].clientHeight) {                     // 749
                target.style.maxHeight = this.container[0].clientHeight;                    // 750
            }                                                                               // 751
            if (this.interval && this.slides[this.index] === parent) {                      // 752
                this.play();                                                                // 753
            }                                                                               // 754
            this.setTimeout(                                                                // 755
                this.options.onslidecomplete,                                               // 756
                [index, parent]                                                             // 757
            );                                                                              // 758
        },                                                                                  // 759
                                                                                            // 760
        onload: function (event) {                                                          // 761
            this.oncomplete(event);                                                         // 762
        },                                                                                  // 763
                                                                                            // 764
        onerror: function (event) {                                                         // 765
            this.oncomplete(event);                                                         // 766
        },                                                                                  // 767
                                                                                            // 768
        onkeydown: function (event) {                                                       // 769
            switch (event.which || event.keyCode) {                                         // 770
            case 13: // Return                                                              // 771
                if (this.options.toggleControlsOnReturn) {                                  // 772
                    this.preventDefault(event);                                             // 773
                    this.toggleControls();                                                  // 774
                }                                                                           // 775
                break;                                                                      // 776
            case 27: // Esc                                                                 // 777
                if (this.options.closeOnEscape) {                                           // 778
                    this.close();                                                           // 779
                }                                                                           // 780
                break;                                                                      // 781
            case 32: // Space                                                               // 782
                if (this.options.toggleSlideshowOnSpace) {                                  // 783
                    this.preventDefault(event);                                             // 784
                    this.toggleSlideshow();                                                 // 785
                }                                                                           // 786
                break;                                                                      // 787
            case 37: // Left                                                                // 788
                if (this.options.enableKeyboardNavigation) {                                // 789
                    this.preventDefault(event);                                             // 790
                    this.prev();                                                            // 791
                }                                                                           // 792
                break;                                                                      // 793
            case 39: // Right                                                               // 794
                if (this.options.enableKeyboardNavigation) {                                // 795
                    this.preventDefault(event);                                             // 796
                    this.next();                                                            // 797
                }                                                                           // 798
                break;                                                                      // 799
            }                                                                               // 800
        },                                                                                  // 801
                                                                                            // 802
        handleClick: function (event) {                                                     // 803
            var options = this.options,                                                     // 804
                target = event.target || event.srcElement,                                  // 805
                parent = target.parentNode,                                                 // 806
                isTarget = function (className) {                                           // 807
                    return $(target).hasClass(className) ||                                 // 808
                        $(parent).hasClass(className);                                      // 809
                };                                                                          // 810
            if (isTarget(options.toggleClass)) {                                            // 811
                // Click on "toggle" control                                                // 812
                this.preventDefault(event);                                                 // 813
                this.toggleControls();                                                      // 814
            } else if (isTarget(options.prevClass)) {                                       // 815
                // Click on "prev" control                                                  // 816
                this.preventDefault(event);                                                 // 817
                this.prev();                                                                // 818
            } else if (isTarget(options.nextClass)) {                                       // 819
                // Click on "next" control                                                  // 820
                this.preventDefault(event);                                                 // 821
                this.next();                                                                // 822
            } else if (isTarget(options.closeClass)) {                                      // 823
                // Click on "close" control                                                 // 824
                this.preventDefault(event);                                                 // 825
                this.close();                                                               // 826
            } else if (isTarget(options.playPauseClass)) {                                  // 827
                // Click on "play-pause" control                                            // 828
                this.preventDefault(event);                                                 // 829
                this.toggleSlideshow();                                                     // 830
            } else if (parent === this.slidesContainer[0]) {                                // 831
                // Click on slide background                                                // 832
                this.preventDefault(event);                                                 // 833
                if (options.closeOnSlideClick) {                                            // 834
                    this.close();                                                           // 835
                } else {                                                                    // 836
                    this.toggleControls();                                                  // 837
                }                                                                           // 838
            } else if (parent.parentNode &&                                                 // 839
                    parent.parentNode === this.slidesContainer[0]) {                        // 840
                // Click on displayed element                                               // 841
                this.preventDefault(event);                                                 // 842
                this.toggleControls();                                                      // 843
            }                                                                               // 844
        },                                                                                  // 845
                                                                                            // 846
        onclick: function (event) {                                                         // 847
            if (this.options.emulateTouchEvents &&                                          // 848
                    this.touchDelta && (Math.abs(this.touchDelta.x) > 20 ||                 // 849
                        Math.abs(this.touchDelta.y) > 20)) {                                // 850
                delete this.touchDelta;                                                     // 851
                return;                                                                     // 852
            }                                                                               // 853
            return this.handleClick(event);                                                 // 854
        },                                                                                  // 855
                                                                                            // 856
        updateEdgeClasses: function (index) {                                               // 857
            if (!index) {                                                                   // 858
                this.container.addClass(this.options.leftEdgeClass);                        // 859
            } else {                                                                        // 860
                this.container.removeClass(this.options.leftEdgeClass);                     // 861
            }                                                                               // 862
            if (index === this.num - 1) {                                                   // 863
                this.container.addClass(this.options.rightEdgeClass);                       // 864
            } else {                                                                        // 865
                this.container.removeClass(this.options.rightEdgeClass);                    // 866
            }                                                                               // 867
        },                                                                                  // 868
                                                                                            // 869
        handleSlide: function (index) {                                                     // 870
            if (!this.options.continuous) {                                                 // 871
                this.updateEdgeClasses(index);                                              // 872
            }                                                                               // 873
            this.loadElements(index);                                                       // 874
            if (this.options.unloadElements) {                                              // 875
                this.unloadElements(index);                                                 // 876
            }                                                                               // 877
            this.setTitle(index);                                                           // 878
        },                                                                                  // 879
                                                                                            // 880
        onslide: function (index) {                                                         // 881
            this.index = index;                                                             // 882
            this.handleSlide(index);                                                        // 883
            this.setTimeout(this.options.onslide, [index, this.slides[index]]);             // 884
        },                                                                                  // 885
                                                                                            // 886
        setTitle: function (index) {                                                        // 887
            var text = this.slides[index].firstChild.title,                                 // 888
                titleElement = this.titleElement;                                           // 889
            if (titleElement.length) {                                                      // 890
                this.titleElement.empty();                                                  // 891
                if (text) {                                                                 // 892
                    titleElement[0].appendChild(document.createTextNode(text));             // 893
                }                                                                           // 894
            }                                                                               // 895
        },                                                                                  // 896
                                                                                            // 897
        setTimeout: function (func, args, wait) {                                           // 898
            var that = this;                                                                // 899
            return func && window.setTimeout(function () {                                  // 900
                func.apply(that, args || []);                                               // 901
            }, wait || 0);                                                                  // 902
        },                                                                                  // 903
                                                                                            // 904
        imageFactory: function (obj, callback) {                                            // 905
            var that = this,                                                                // 906
                img = this.imagePrototype.cloneNode(false),                                 // 907
                url = obj,                                                                  // 908
                backgroundSize = this.options.stretchImages,                                // 909
                called,                                                                     // 910
                element,                                                                    // 911
                callbackWrapper = function (event) {                                        // 912
                    if (!called) {                                                          // 913
                        event = {                                                           // 914
                            type: event.type,                                               // 915
                            target: element                                                 // 916
                        };                                                                  // 917
                        if (!element.parentNode) {                                          // 918
                            // Fix for IE7 firing the load event for                        // 919
                            // cached images before the element could                       // 920
                            // be added to the DOM:                                         // 921
                            return that.setTimeout(callbackWrapper, [event]);               // 922
                        }                                                                   // 923
                        called = true;                                                      // 924
                        $(img).off('load error', callbackWrapper);                          // 925
                        if (backgroundSize) {                                               // 926
                            if (event.type === 'load') {                                    // 927
                                element.style.background = 'url("' + url +                  // 928
                                    '") center no-repeat';                                  // 929
                                element.style.backgroundSize = backgroundSize;              // 930
                            }                                                               // 931
                        }                                                                   // 932
                        callback(event);                                                    // 933
                    }                                                                       // 934
                },                                                                          // 935
                title;                                                                      // 936
            if (typeof url !== 'string') {                                                  // 937
                url = this.getItemProperty(obj, this.options.urlProperty);                  // 938
                title = this.getItemProperty(obj, this.options.titleProperty);              // 939
            }                                                                               // 940
            if (backgroundSize === true) {                                                  // 941
                backgroundSize = 'contain';                                                 // 942
            }                                                                               // 943
            backgroundSize = this.support.backgroundSize &&                                 // 944
                this.support.backgroundSize[backgroundSize] && backgroundSize;              // 945
            if (backgroundSize) {                                                           // 946
                element = this.elementPrototype.cloneNode(false);                           // 947
            } else {                                                                        // 948
                element = img;                                                              // 949
                img.draggable = false;                                                      // 950
            }                                                                               // 951
            if (title) {                                                                    // 952
                element.title = title;                                                      // 953
            }                                                                               // 954
            $(img).on('load error', callbackWrapper);                                       // 955
            img.src = url;                                                                  // 956
            return element;                                                                 // 957
        },                                                                                  // 958
                                                                                            // 959
        createElement: function (obj, callback) {                                           // 960
            var type = obj && this.getItemProperty(obj, this.options.typeProperty),         // 961
                factory = (type && this[type.split('/')[0] + 'Factory']) ||                 // 962
                    this.imageFactory,                                                      // 963
                element = obj && factory.call(this, obj, callback);                         // 964
            if (!element) {                                                                 // 965
                element = this.elementPrototype.cloneNode(false);                           // 966
                this.setTimeout(callback, [{                                                // 967
                    type: 'error',                                                          // 968
                    target: element                                                         // 969
                }]);                                                                        // 970
            }                                                                               // 971
            $(element).addClass(this.options.slideContentClass);                            // 972
            return element;                                                                 // 973
        },                                                                                  // 974
                                                                                            // 975
        loadElement: function (index) {                                                     // 976
            if (!this.elements[index]) {                                                    // 977
                if (this.slides[index].firstChild) {                                        // 978
                    this.elements[index] = $(this.slides[index])                            // 979
                        .hasClass(this.options.slideErrorClass) ? 3 : 2;                    // 980
                } else {                                                                    // 981
                    this.elements[index] = 1; // Loading                                    // 982
                    $(this.slides[index]).addClass(this.options.slideLoadingClass);         // 983
                    this.slides[index].appendChild(this.createElement(                      // 984
                        this.list[index],                                                   // 985
                        this.proxyListener                                                  // 986
                    ));                                                                     // 987
                }                                                                           // 988
            }                                                                               // 989
        },                                                                                  // 990
                                                                                            // 991
        loadElements: function (index) {                                                    // 992
            var limit = Math.min(this.num, this.options.preloadRange * 2 + 1),              // 993
                j = index,                                                                  // 994
                i;                                                                          // 995
            for (i = 0; i < limit; i += 1) {                                                // 996
                // First load the current slide element (0),                                // 997
                // then the next one (+1),                                                  // 998
                // then the previous one (-2),                                              // 999
                // then the next after next (+2), etc.:                                     // 1000
                j += i * (i % 2 === 0 ? -1 : 1);                                            // 1001
                // Connect the ends of the list to load slide elements for                  // 1002
                // continuous navigation:                                                   // 1003
                j = this.circle(j);                                                         // 1004
                this.loadElement(j);                                                        // 1005
            }                                                                               // 1006
        },                                                                                  // 1007
                                                                                            // 1008
        unloadElements: function (index) {                                                  // 1009
            var i,                                                                          // 1010
                slide,                                                                      // 1011
                diff;                                                                       // 1012
            for (i in this.elements) {                                                      // 1013
                if (this.elements.hasOwnProperty(i)) {                                      // 1014
                    diff = Math.abs(index - i);                                             // 1015
                    if (diff > this.options.preloadRange &&                                 // 1016
                            diff + this.options.preloadRange < this.num) {                  // 1017
                        slide = this.slides[i];                                             // 1018
                        slide.removeChild(slide.firstChild);                                // 1019
                        delete this.elements[i];                                            // 1020
                    }                                                                       // 1021
                }                                                                           // 1022
            }                                                                               // 1023
        },                                                                                  // 1024
                                                                                            // 1025
        addSlide: function (index) {                                                        // 1026
            var slide = this.slidePrototype.cloneNode(false);                               // 1027
            slide.setAttribute('data-index', index);                                        // 1028
            this.slidesContainer[0].appendChild(slide);                                     // 1029
            this.slides.push(slide);                                                        // 1030
        },                                                                                  // 1031
                                                                                            // 1032
        positionSlide: function (index) {                                                   // 1033
            var slide = this.slides[index];                                                 // 1034
            slide.style.width = this.slideWidth + 'px';                                     // 1035
            if (this.support.transition) {                                                  // 1036
                slide.style.left = (index * -this.slideWidth) + 'px';                       // 1037
                this.move(index, this.index > index ? -this.slideWidth :                    // 1038
                        (this.index < index ? this.slideWidth : 0), 0);                     // 1039
            }                                                                               // 1040
        },                                                                                  // 1041
                                                                                            // 1042
        initSlides: function (reload) {                                                     // 1043
            var clearSlides,                                                                // 1044
                i;                                                                          // 1045
            if (!reload) {                                                                  // 1046
                this.positions = [];                                                        // 1047
                this.positions.length = this.num;                                           // 1048
                this.elements = {};                                                         // 1049
                this.imagePrototype = document.createElement('img');                        // 1050
                this.elementPrototype = document.createElement('div');                      // 1051
                this.slidePrototype = document.createElement('div');                        // 1052
                $(this.slidePrototype).addClass(this.options.slideClass);                   // 1053
                this.slides = this.slidesContainer[0].children;                             // 1054
                clearSlides = this.options.clearSlides ||                                   // 1055
                    this.slides.length !== this.num;                                        // 1056
            }                                                                               // 1057
            this.slideWidth = this.container[0].offsetWidth;                                // 1058
            this.slideHeight = this.container[0].offsetHeight;                              // 1059
            this.slidesContainer[0].style.width =                                           // 1060
                (this.num * this.slideWidth) + 'px';                                        // 1061
            if (clearSlides) {                                                              // 1062
                this.resetSlides();                                                         // 1063
            }                                                                               // 1064
            for (i = 0; i < this.num; i += 1) {                                             // 1065
                if (clearSlides) {                                                          // 1066
                    this.addSlide(i);                                                       // 1067
                }                                                                           // 1068
                this.positionSlide(i);                                                      // 1069
            }                                                                               // 1070
            // Reposition the slides before and after the given index:                      // 1071
            if (this.options.continuous && this.support.transition) {                       // 1072
                this.move(this.circle(this.index - 1), -this.slideWidth, 0);                // 1073
                this.move(this.circle(this.index + 1), this.slideWidth, 0);                 // 1074
            }                                                                               // 1075
            if (!this.support.transition) {                                                 // 1076
                this.slidesContainer[0].style.left =                                        // 1077
                    (this.index * -this.slideWidth) + 'px';                                 // 1078
            }                                                                               // 1079
        },                                                                                  // 1080
                                                                                            // 1081
        toggleControls: function () {                                                       // 1082
            var controlsClass = this.options.controlsClass;                                 // 1083
            if (this.container.hasClass(controlsClass)) {                                   // 1084
                this.container.removeClass(controlsClass);                                  // 1085
            } else {                                                                        // 1086
                this.container.addClass(controlsClass);                                     // 1087
            }                                                                               // 1088
        },                                                                                  // 1089
                                                                                            // 1090
        toggleSlideshow: function () {                                                      // 1091
            if (!this.interval) {                                                           // 1092
                this.play();                                                                // 1093
            } else {                                                                        // 1094
                this.pause();                                                               // 1095
            }                                                                               // 1096
        },                                                                                  // 1097
                                                                                            // 1098
        getNodeIndex: function (element) {                                                  // 1099
            return parseInt(element.getAttribute('data-index'), 10);                        // 1100
        },                                                                                  // 1101
                                                                                            // 1102
        getNestedProperty: function (obj, property) {                                       // 1103
            property.replace(                                                               // 1104
                // Matches native JavaScript notation in a String,                          // 1105
                // e.g. '["doubleQuoteProp"].dotProp[2]'                                    // 1106
                /\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,                // 1107
                function (str, singleQuoteProp, doubleQuoteProp, arrayIndex, dotProp) {     // 1108
                    var prop = dotProp || singleQuoteProp || doubleQuoteProp ||             // 1109
                            (arrayIndex && parseInt(arrayIndex, 10));                       // 1110
                    if (str && obj) {                                                       // 1111
                        obj = obj[prop];                                                    // 1112
                    }                                                                       // 1113
                }                                                                           // 1114
            );                                                                              // 1115
            return obj;                                                                     // 1116
        },                                                                                  // 1117
                                                                                            // 1118
        getDataProperty: function (obj, property) {                                         // 1119
            if (obj.getAttribute) {                                                         // 1120
                var prop = obj.getAttribute('data-' +                                       // 1121
                        property.replace(/([A-Z])/g, '-$1').toLowerCase());                 // 1122
                if (typeof prop === 'string') {                                             // 1123
                    if (/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/         // 1124
                            .test(prop)) {                                                  // 1125
                        try {                                                               // 1126
                            return $.parseJSON(prop);                                       // 1127
                        } catch (ignore) {}                                                 // 1128
                    }                                                                       // 1129
                    return prop;                                                            // 1130
                }                                                                           // 1131
            }                                                                               // 1132
        },                                                                                  // 1133
                                                                                            // 1134
        getItemProperty: function (obj, property) {                                         // 1135
            var prop = obj[property];                                                       // 1136
            if (prop === undefined) {                                                       // 1137
                prop = this.getDataProperty(obj, property);                                 // 1138
                if (prop === undefined) {                                                   // 1139
                    prop = this.getNestedProperty(obj, property);                           // 1140
                }                                                                           // 1141
            }                                                                               // 1142
            return prop;                                                                    // 1143
        },                                                                                  // 1144
                                                                                            // 1145
        initStartIndex: function () {                                                       // 1146
            var index = this.options.index,                                                 // 1147
                urlProperty = this.options.urlProperty,                                     // 1148
                i;                                                                          // 1149
            // Check if the index is given as a list object:                                // 1150
            if (index && typeof index !== 'number') {                                       // 1151
                for (i = 0; i < this.num; i += 1) {                                         // 1152
                    if (this.list[i] === index ||                                           // 1153
                            this.getItemProperty(this.list[i], urlProperty) ===             // 1154
                                this.getItemProperty(index, urlProperty)) {                 // 1155
                        index  = i;                                                         // 1156
                        break;                                                              // 1157
                    }                                                                       // 1158
                }                                                                           // 1159
            }                                                                               // 1160
            // Make sure the index is in the list range:                                    // 1161
            this.index = this.circle(parseInt(index, 10) || 0);                             // 1162
        },                                                                                  // 1163
                                                                                            // 1164
        initEventListeners: function () {                                                   // 1165
            var that = this,                                                                // 1166
                slidesContainer = this.slidesContainer,                                     // 1167
                proxyListener = function (event) {                                          // 1168
                    var type = that.support.transition &&                                   // 1169
                            that.support.transition.end === event.type ?                    // 1170
                                    'transitionend' : event.type;                           // 1171
                    that['on' + type](event);                                               // 1172
                };                                                                          // 1173
            $(window).on('resize', proxyListener);                                          // 1174
            $(document.body).on('keydown', proxyListener);                                  // 1175
            this.container.on('click', proxyListener);                                      // 1176
            if (this.support.touch) {                                                       // 1177
                slidesContainer                                                             // 1178
                    .on('touchstart touchmove touchend', proxyListener);                    // 1179
            } else if (this.options.emulateTouchEvents &&                                   // 1180
                    this.support.transition) {                                              // 1181
                slidesContainer                                                             // 1182
                    .on('mousedown mousemove mouseup mouseout', proxyListener);             // 1183
            }                                                                               // 1184
            if (this.support.transition) {                                                  // 1185
                slidesContainer.on(                                                         // 1186
                    this.support.transition.end,                                            // 1187
                    proxyListener                                                           // 1188
                );                                                                          // 1189
            }                                                                               // 1190
            this.proxyListener = proxyListener;                                             // 1191
        },                                                                                  // 1192
                                                                                            // 1193
        destroyEventListeners: function () {                                                // 1194
            var slidesContainer = this.slidesContainer,                                     // 1195
                proxyListener = this.proxyListener;                                         // 1196
            $(window).off('resize', proxyListener);                                         // 1197
            $(document.body).off('keydown', proxyListener);                                 // 1198
            this.container.off('click', proxyListener);                                     // 1199
            if (this.support.touch) {                                                       // 1200
                slidesContainer                                                             // 1201
                    .off('touchstart touchmove touchend', proxyListener);                   // 1202
            } else if (this.options.emulateTouchEvents &&                                   // 1203
                    this.support.transition) {                                              // 1204
                slidesContainer                                                             // 1205
                    .off('mousedown mousemove mouseup mouseout', proxyListener);            // 1206
            }                                                                               // 1207
            if (this.support.transition) {                                                  // 1208
                slidesContainer.off(                                                        // 1209
                    this.support.transition.end,                                            // 1210
                    proxyListener                                                           // 1211
                );                                                                          // 1212
            }                                                                               // 1213
        },                                                                                  // 1214
                                                                                            // 1215
        handleOpen: function () {                                                           // 1216
            if (this.options.onopened) {                                                    // 1217
                this.options.onopened.call(this);                                           // 1218
            }                                                                               // 1219
        },                                                                                  // 1220
                                                                                            // 1221
        initWidget: function () {                                                           // 1222
            var that = this,                                                                // 1223
                openHandler = function (event) {                                            // 1224
                    if (event.target === that.container[0]) {                               // 1225
                        that.container.off(                                                 // 1226
                            that.support.transition.end,                                    // 1227
                            openHandler                                                     // 1228
                        );                                                                  // 1229
                        that.handleOpen();                                                  // 1230
                    }                                                                       // 1231
                };                                                                          // 1232
            this.container = $(this.options.container);                                     // 1233
            if (!this.container.length) {                                                   // 1234
                return false;                                                               // 1235
            }                                                                               // 1236
            this.slidesContainer = this.container.find(                                     // 1237
                this.options.slidesContainer                                                // 1238
            ).first();                                                                      // 1239
            if (!this.slidesContainer.length) {                                             // 1240
                return false;                                                               // 1241
            }                                                                               // 1242
            this.titleElement = this.container.find(                                        // 1243
                this.options.titleElement                                                   // 1244
            ).first();                                                                      // 1245
            if (this.num === 1) {                                                           // 1246
                this.container.addClass(this.options.singleClass);                          // 1247
            }                                                                               // 1248
            if (this.options.onopen) {                                                      // 1249
                this.options.onopen.call(this);                                             // 1250
            }                                                                               // 1251
            if (this.support.transition && this.options.displayTransition) {                // 1252
                this.container.on(                                                          // 1253
                    this.support.transition.end,                                            // 1254
                    openHandler                                                             // 1255
                );                                                                          // 1256
            } else {                                                                        // 1257
                this.handleOpen();                                                          // 1258
            }                                                                               // 1259
            if (this.options.hidePageScrollbars) {                                          // 1260
                // Hide the page scrollbars:                                                // 1261
                this.bodyOverflowStyle = document.body.style.overflow;                      // 1262
                document.body.style.overflow = 'hidden';                                    // 1263
            }                                                                               // 1264
            this.container[0].style.display = 'block';                                      // 1265
            this.initSlides();                                                              // 1266
            this.container.addClass(this.options.displayClass);                             // 1267
        },                                                                                  // 1268
                                                                                            // 1269
        initOptions: function (options) {                                                   // 1270
            // Create a copy of the prototype options:                                      // 1271
            this.options = $.extend({}, this.options);                                      // 1272
            // Check if carousel mode is enabled:                                           // 1273
            if ((options && options.carousel) ||                                            // 1274
                    (this.options.carousel && (!options || options.carousel !== false))) {  // 1275
                $.extend(this.options, this.carouselOptions);                               // 1276
            }                                                                               // 1277
            // Override any given options:                                                  // 1278
            $.extend(this.options, options);                                                // 1279
            if (this.num < 3) {                                                             // 1280
                // 1 or 2 slides cannot be displayed continuous,                            // 1281
                // remember the original option by setting to null instead of false:        // 1282
                this.options.continuous = this.options.continuous ? null : false;           // 1283
            }                                                                               // 1284
            if (!this.support.transition) {                                                 // 1285
                this.options.emulateTouchEvents = false;                                    // 1286
            }                                                                               // 1287
            if (this.options.event) {                                                       // 1288
                this.preventDefault(this.options.event);                                    // 1289
            }                                                                               // 1290
        }                                                                                   // 1291
                                                                                            // 1292
    });                                                                                     // 1293
                                                                                            // 1294
    return Gallery;                                                                         // 1295
}));                                                                                        // 1296
                                                                                            // 1297
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/blueimp-helper.js                        //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * blueimp helper JS 1.2.0                                                                  // 2
 * https://github.com/blueimp/Gallery                                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Licensed under the MIT license:                                                          // 8
 * http://www.opensource.org/licenses/MIT                                                   // 9
 */                                                                                         // 10
                                                                                            // 11
/* global define, window, document */                                                       // 12
                                                                                            // 13
(function () {                                                                              // 14
    'use strict';                                                                           // 15
                                                                                            // 16
    function extend(obj1, obj2) {                                                           // 17
        var prop;                                                                           // 18
        for (prop in obj2) {                                                                // 19
            if (obj2.hasOwnProperty(prop)) {                                                // 20
                obj1[prop] = obj2[prop];                                                    // 21
            }                                                                               // 22
        }                                                                                   // 23
        return obj1;                                                                        // 24
    }                                                                                       // 25
                                                                                            // 26
    function Helper(query) {                                                                // 27
        if (!this || this.find !== Helper.prototype.find) {                                 // 28
            // Called as function instead of as constructor,                                // 29
            // so we simply return a new instance:                                          // 30
            return new Helper(query);                                                       // 31
        }                                                                                   // 32
        this.length = 0;                                                                    // 33
        if (query) {                                                                        // 34
            if (typeof query === 'string') {                                                // 35
                query = this.find(query);                                                   // 36
            }                                                                               // 37
            if (query.nodeType || query === query.window) {                                 // 38
                // Single HTML element                                                      // 39
                this.length = 1;                                                            // 40
                this[0] = query;                                                            // 41
            } else {                                                                        // 42
                // HTML element collection                                                  // 43
                var i = query.length;                                                       // 44
                this.length = i;                                                            // 45
                while (i) {                                                                 // 46
                    i -= 1;                                                                 // 47
                    this[i] = query[i];                                                     // 48
                }                                                                           // 49
            }                                                                               // 50
        }                                                                                   // 51
    }                                                                                       // 52
                                                                                            // 53
    Helper.extend = extend;                                                                 // 54
                                                                                            // 55
    Helper.contains = function (container, element) {                                       // 56
        do {                                                                                // 57
            element = element.parentNode;                                                   // 58
            if (element === container) {                                                    // 59
                return true;                                                                // 60
            }                                                                               // 61
        } while (element);                                                                  // 62
        return false;                                                                       // 63
    };                                                                                      // 64
                                                                                            // 65
    Helper.parseJSON = function (string) {                                                  // 66
        return window.JSON && JSON.parse(string);                                           // 67
    };                                                                                      // 68
                                                                                            // 69
    extend(Helper.prototype, {                                                              // 70
                                                                                            // 71
        find: function (query) {                                                            // 72
            var container = this[0] || document;                                            // 73
            if (typeof query === 'string') {                                                // 74
                if (container.querySelectorAll) {                                           // 75
                    query = container.querySelectorAll(query);                              // 76
                } else if (query.charAt(0) === '#') {                                       // 77
                    query = container.getElementById(query.slice(1));                       // 78
                } else {                                                                    // 79
                    query = container.getElementsByTagName(query);                          // 80
                }                                                                           // 81
            }                                                                               // 82
            return new Helper(query);                                                       // 83
        },                                                                                  // 84
                                                                                            // 85
        hasClass: function (className) {                                                    // 86
            if (!this[0]) {                                                                 // 87
                return false;                                                               // 88
            }                                                                               // 89
            return new RegExp('(^|\\s+)' + className +                                      // 90
                '(\\s+|$)').test(this[0].className);                                        // 91
        },                                                                                  // 92
                                                                                            // 93
        addClass: function (className) {                                                    // 94
            var i = this.length,                                                            // 95
                element;                                                                    // 96
            while (i) {                                                                     // 97
                i -= 1;                                                                     // 98
                element = this[i];                                                          // 99
                if (!element.className) {                                                   // 100
                    element.className = className;                                          // 101
                    return this;                                                            // 102
                }                                                                           // 103
                if (this.hasClass(className)) {                                             // 104
                    return this;                                                            // 105
                }                                                                           // 106
                element.className += ' ' + className;                                       // 107
            }                                                                               // 108
            return this;                                                                    // 109
        },                                                                                  // 110
                                                                                            // 111
        removeClass: function (className) {                                                 // 112
            var regexp = new RegExp('(^|\\s+)' + className + '(\\s+|$)'),                   // 113
                i = this.length,                                                            // 114
                element;                                                                    // 115
            while (i) {                                                                     // 116
                i -= 1;                                                                     // 117
                element = this[i];                                                          // 118
                element.className = element.className.replace(regexp, ' ');                 // 119
            }                                                                               // 120
            return this;                                                                    // 121
        },                                                                                  // 122
                                                                                            // 123
        on: function (eventName, handler) {                                                 // 124
            var eventNames = eventName.split(/\s+/),                                        // 125
                i,                                                                          // 126
                element;                                                                    // 127
            while (eventNames.length) {                                                     // 128
                eventName = eventNames.shift();                                             // 129
                i = this.length;                                                            // 130
                while (i) {                                                                 // 131
                    i -= 1;                                                                 // 132
                    element = this[i];                                                      // 133
                    if (element.addEventListener) {                                         // 134
                        element.addEventListener(eventName, handler, false);                // 135
                    } else if (element.attachEvent) {                                       // 136
                        element.attachEvent('on' + eventName, handler);                     // 137
                    }                                                                       // 138
                }                                                                           // 139
            }                                                                               // 140
            return this;                                                                    // 141
        },                                                                                  // 142
                                                                                            // 143
        off: function (eventName, handler) {                                                // 144
            var eventNames = eventName.split(/\s+/),                                        // 145
                i,                                                                          // 146
                element;                                                                    // 147
            while (eventNames.length) {                                                     // 148
                eventName = eventNames.shift();                                             // 149
                i = this.length;                                                            // 150
                while (i) {                                                                 // 151
                    i -= 1;                                                                 // 152
                    element = this[i];                                                      // 153
                    if (element.removeEventListener) {                                      // 154
                        element.removeEventListener(eventName, handler, false);             // 155
                    } else if (element.detachEvent) {                                       // 156
                        element.detachEvent('on' + eventName, handler);                     // 157
                    }                                                                       // 158
                }                                                                           // 159
            }                                                                               // 160
            return this;                                                                    // 161
        },                                                                                  // 162
                                                                                            // 163
        empty: function () {                                                                // 164
            var i = this.length,                                                            // 165
                element;                                                                    // 166
            while (i) {                                                                     // 167
                i -= 1;                                                                     // 168
                element = this[i];                                                          // 169
                while (element.hasChildNodes()) {                                           // 170
                    element.removeChild(element.lastChild);                                 // 171
                }                                                                           // 172
            }                                                                               // 173
            return this;                                                                    // 174
        },                                                                                  // 175
                                                                                            // 176
        first: function () {                                                                // 177
            return new Helper(this[0]);                                                     // 178
        }                                                                                   // 179
                                                                                            // 180
    });                                                                                     // 181
                                                                                            // 182
    if (typeof define === 'function' && define.amd) {                                       // 183
        define(function () {                                                                // 184
            return Helper;                                                                  // 185
        });                                                                                 // 186
    } else {                                                                                // 187
        window.blueimp = window.blueimp || {};                                              // 188
        window.blueimp.helper = Helper;                                                     // 189
    }                                                                                       // 190
}());                                                                                       // 191
                                                                                            // 192
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/blueimp-gallery-video.js                 //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * blueimp Gallery Video Factory JS 1.1.0                                                   // 2
 * https://github.com/blueimp/Gallery                                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Licensed under the MIT license:                                                          // 8
 * http://www.opensource.org/licenses/MIT                                                   // 9
 */                                                                                         // 10
                                                                                            // 11
/* global define, window, document */                                                       // 12
                                                                                            // 13
(function (factory) {                                                                       // 14
    'use strict';                                                                           // 15
    if (typeof define === 'function' && define.amd) {                                       // 16
        // Register as an anonymous AMD module:                                             // 17
        define([                                                                            // 18
            './blueimp-helper',                                                             // 19
            './blueimp-gallery'                                                             // 20
        ], factory);                                                                        // 21
    } else {                                                                                // 22
        // Browser globals:                                                                 // 23
        factory(                                                                            // 24
            window.blueimp.helper || window.jQuery,                                         // 25
            window.blueimp.Gallery                                                          // 26
        );                                                                                  // 27
    }                                                                                       // 28
}(function ($, Gallery) {                                                                   // 29
    'use strict';                                                                           // 30
                                                                                            // 31
    $.extend(Gallery.prototype.options, {                                                   // 32
        // The class for video content elements:                                            // 33
        videoContentClass: 'video-content',                                                 // 34
        // The class for video when it is loading:                                          // 35
        videoLoadingClass: 'video-loading',                                                 // 36
        // The class for video when it is playing:                                          // 37
        videoPlayingClass: 'video-playing',                                                 // 38
        // The list object property (or data attribute) for the video poster URL:           // 39
        videoPosterProperty: 'poster',                                                      // 40
        // The list object property (or data attribute) for the video sources array:        // 41
        videoSourcesProperty: 'sources'                                                     // 42
    });                                                                                     // 43
                                                                                            // 44
    Gallery.prototype.videoFactory = function (obj, callback, videoInterface) {             // 45
        var that = this,                                                                    // 46
            options = this.options,                                                         // 47
            videoContainerNode = this.elementPrototype.cloneNode(false),                    // 48
            videoContainer = $(videoContainerNode),                                         // 49
            errorArgs = [{                                                                  // 50
                type: 'error',                                                              // 51
                target: videoContainerNode                                                  // 52
            }],                                                                             // 53
            video = videoInterface || document.createElement('video'),                      // 54
            url = this.getItemProperty(obj, options.urlProperty),                           // 55
            type = this.getItemProperty(obj, options.typeProperty),                         // 56
            title = this.getItemProperty(obj, options.titleProperty),                       // 57
            posterUrl = this.getItemProperty(obj, options.videoPosterProperty),             // 58
            posterImage,                                                                    // 59
            sources = this.getItemProperty(                                                 // 60
                obj,                                                                        // 61
                options.videoSourcesProperty                                                // 62
            ),                                                                              // 63
            source,                                                                         // 64
            playMediaControl,                                                               // 65
            isLoading,                                                                      // 66
            hasControls;                                                                    // 67
        videoContainer.addClass(options.videoContentClass);                                 // 68
        if (title) {                                                                        // 69
            videoContainerNode.title = title;                                               // 70
        }                                                                                   // 71
        if (video.canPlayType) {                                                            // 72
            if (url && type && video.canPlayType(type)) {                                   // 73
                video.src = url;                                                            // 74
            } else {                                                                        // 75
                while (sources && sources.length) {                                         // 76
                    source = sources.shift();                                               // 77
                    url = this.getItemProperty(source, options.urlProperty);                // 78
                    type = this.getItemProperty(source, options.typeProperty);              // 79
                    if (url && type && video.canPlayType(type)) {                           // 80
                        video.src = url;                                                    // 81
                        break;                                                              // 82
                    }                                                                       // 83
                }                                                                           // 84
            }                                                                               // 85
        }                                                                                   // 86
        if (posterUrl) {                                                                    // 87
            video.poster = posterUrl;                                                       // 88
            posterImage = this.imagePrototype.cloneNode(false);                             // 89
            $(posterImage).addClass(options.toggleClass);                                   // 90
            posterImage.src = posterUrl;                                                    // 91
            posterImage.draggable = false;                                                  // 92
            videoContainerNode.appendChild(posterImage);                                    // 93
        }                                                                                   // 94
        playMediaControl = document.createElement('a');                                     // 95
        playMediaControl.setAttribute('target', '_blank');                                  // 96
        if (!videoInterface) {                                                              // 97
            playMediaControl.setAttribute('download', title);                               // 98
        }                                                                                   // 99
        playMediaControl.href = url;                                                        // 100
        if (video.src) {                                                                    // 101
            video.controls = true;                                                          // 102
            (videoInterface || $(video))                                                    // 103
                .on('error', function () {                                                  // 104
                    that.setTimeout(callback, errorArgs);                                   // 105
                })                                                                          // 106
                .on('pause', function () {                                                  // 107
                    isLoading = false;                                                      // 108
                    videoContainer                                                          // 109
                        .removeClass(that.options.videoLoadingClass)                        // 110
                        .removeClass(that.options.videoPlayingClass);                       // 111
                    if (hasControls) {                                                      // 112
                        that.container.addClass(that.options.controlsClass);                // 113
                    }                                                                       // 114
                    if (that.interval) {                                                    // 115
                        that.play();                                                        // 116
                    }                                                                       // 117
                })                                                                          // 118
                .on('playing', function () {                                                // 119
                    isLoading = false;                                                      // 120
                    videoContainer                                                          // 121
                        .removeClass(that.options.videoLoadingClass)                        // 122
                        .addClass(that.options.videoPlayingClass);                          // 123
                    if (that.container.hasClass(that.options.controlsClass)) {              // 124
                        hasControls = true;                                                 // 125
                        that.container.removeClass(that.options.controlsClass);             // 126
                    } else {                                                                // 127
                        hasControls = false;                                                // 128
                    }                                                                       // 129
                })                                                                          // 130
                .on('play', function () {                                                   // 131
                    window.clearTimeout(that.timeout);                                      // 132
                    isLoading = true;                                                       // 133
                    videoContainer.addClass(that.options.videoLoadingClass);                // 134
                });                                                                         // 135
            $(playMediaControl).on('click', function (event) {                              // 136
                that.preventDefault(event);                                                 // 137
                if (isLoading) {                                                            // 138
                    video.pause();                                                          // 139
                } else {                                                                    // 140
                    video.play();                                                           // 141
                }                                                                           // 142
            });                                                                             // 143
            videoContainerNode.appendChild(                                                 // 144
                (videoInterface && videoInterface.element) || video                         // 145
            );                                                                              // 146
        }                                                                                   // 147
        videoContainerNode.appendChild(playMediaControl);                                   // 148
        this.setTimeout(callback, [{                                                        // 149
            type: 'load',                                                                   // 150
            target: videoContainerNode                                                      // 151
        }]);                                                                                // 152
        return videoContainerNode;                                                          // 153
    };                                                                                      // 154
                                                                                            // 155
    return Gallery;                                                                         // 156
}));                                                                                        // 157
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/jquery.blueimp-gallery.js                //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
* blueimp Gallery jQuery plugin 1.2.2                                                       // 2
* https://github.com/blueimp/Gallery                                                        // 3
*                                                                                           // 4
* Copyright 2013, Sebastian Tschan                                                          // 5
* https://blueimp.net                                                                       // 6
*                                                                                           // 7
* Licensed under the MIT license:                                                           // 8
* http://www.opensource.org/licenses/MIT                                                    // 9
*/                                                                                          // 10
                                                                                            // 11
/* global define, window, document */                                                       // 12
                                                                                            // 13
(function (factory) {                                                                       // 14
    'use strict';                                                                           // 15
    if (typeof define === 'function' && define.amd) {                                       // 16
        define([                                                                            // 17
            'jquery',                                                                       // 18
            './blueimp-gallery'                                                             // 19
        ], factory);                                                                        // 20
    } else {                                                                                // 21
        factory(                                                                            // 22
            window.jQuery,                                                                  // 23
            window.blueimp.Gallery                                                          // 24
        );                                                                                  // 25
    }                                                                                       // 26
}(function ($, Gallery) {                                                                   // 27
    'use strict';                                                                           // 28
                                                                                            // 29
    // Global click handler to open links with data-gallery attribute                       // 30
    // in the Gallery lightbox:                                                             // 31
    $(document).on('click', '[data-gallery]', function (event) {                            // 32
        // Get the container id from the data-gallery attribute:                            // 33
        var id = $(this).data('gallery'),                                                   // 34
            widget = $(id),                                                                 // 35
            container = (widget.length && widget) ||                                        // 36
                $(Gallery.prototype.options.container),                                     // 37
            callbacks = {                                                                   // 38
                onopen: function () {                                                       // 39
                    container                                                               // 40
                        .data('gallery', this)                                              // 41
                        .trigger('open');                                                   // 42
                },                                                                          // 43
                onopened: function () {                                                     // 44
                    container.trigger('opened');                                            // 45
                },                                                                          // 46
                onslide: function () {                                                      // 47
                    container.trigger('slide', arguments);                                  // 48
                },                                                                          // 49
                onslideend: function () {                                                   // 50
                    container.trigger('slideend', arguments);                               // 51
                },                                                                          // 52
                onslidecomplete: function () {                                              // 53
                    container.trigger('slidecomplete', arguments);                          // 54
                },                                                                          // 55
                onclose: function () {                                                      // 56
                    container.trigger('close');                                             // 57
                },                                                                          // 58
                onclosed: function () {                                                     // 59
                    container                                                               // 60
                        .trigger('closed')                                                  // 61
                        .removeData('gallery');                                             // 62
                }                                                                           // 63
            },                                                                              // 64
            options = $.extend(                                                             // 65
                // Retrieve custom options from data-attributes                             // 66
                // on the Gallery widget:                                                   // 67
                container.data(),                                                           // 68
                {                                                                           // 69
                    container: container[0],                                                // 70
                    index: this,                                                            // 71
                    event: event                                                            // 72
                },                                                                          // 73
                callbacks                                                                   // 74
            ),                                                                              // 75
            // Select all links with the same data-gallery attribute:                       // 76
            links = $('[data-gallery="' + id + '"]');                                       // 77
        if (options.filter) {                                                               // 78
            links = links.filter(options.filter);                                           // 79
        }                                                                                   // 80
        return new Gallery(links, options);                                                 // 81
    });                                                                                     // 82
                                                                                            // 83
}));                                                                                        // 84
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/bootstrap-image-gallery.js               //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * Bootstrap Image Gallery 3.0.1                                                            // 2
 * https://github.com/blueimp/Bootstrap-Image-Gallery                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Licensed under the MIT license:                                                          // 8
 * http://www.opensource.org/licenses/MIT                                                   // 9
 */                                                                                         // 10
                                                                                            // 11
/*global define, window */                                                                  // 12
                                                                                            // 13
(function (factory) {                                                                       // 14
    'use strict';                                                                           // 15
    if (typeof define === 'function' && define.amd) {                                       // 16
        define([                                                                            // 17
            'jquery',                                                                       // 18
            './blueimp-gallery'                                                             // 19
        ], factory);                                                                        // 20
    } else {                                                                                // 21
        factory(                                                                            // 22
            window.jQuery,                                                                  // 23
            window.blueimp.Gallery                                                          // 24
        );                                                                                  // 25
    }                                                                                       // 26
}(function ($, Gallery) {                                                                   // 27
    'use strict';                                                                           // 28
                                                                                            // 29
    $.extend(Gallery.prototype.options, {                                                   // 30
        useBootstrapModal: true                                                             // 31
    });                                                                                     // 32
                                                                                            // 33
    var close = Gallery.prototype.close,                                                    // 34
        imageFactory = Gallery.prototype.imageFactory,                                      // 35
        videoFactory = Gallery.prototype.videoFactory,                                      // 36
        audioFactory = Gallery.prototype.audioFactory,                                      // 37
        textFactory = Gallery.prototype.textFactory;                                        // 38
                                                                                            // 39
    $.extend(Gallery.prototype, {                                                           // 40
                                                                                            // 41
        modalFactory: function (obj, callback, factoryInterface, factory) {                 // 42
            if (!this.options.useBootstrapModal || factoryInterface) {                      // 43
                return factory.call(this, obj, callback, factoryInterface);                 // 44
            }                                                                               // 45
            var that = this,                                                                // 46
                modalTemplate = this.container.children('.modal'),                          // 47
                modal = modalTemplate.clone().show()                                        // 48
                    .on('click', function (event) {                                         // 49
                        // Close modal if click is outside of modal-content:                // 50
                        if (event.target === modal[0] ||                                    // 51
                                event.target === modal.children()[0]) {                     // 52
                            event.preventDefault();                                         // 53
                            event.stopPropagation();                                        // 54
                            that.close();                                                   // 55
                        }                                                                   // 56
                    }),                                                                     // 57
                element = factory.call(this, obj, function (event) {                        // 58
                    callback({                                                              // 59
                        type: event.type,                                                   // 60
                        target: modal[0]                                                    // 61
                    });                                                                     // 62
                    modal.addClass('in');                                                   // 63
                }, factoryInterface);                                                       // 64
            modal.find('.modal-title').text(element.title || String.fromCharCode(160));     // 65
            modal.find('.modal-body').append(element);                                      // 66
            return modal[0];                                                                // 67
        },                                                                                  // 68
                                                                                            // 69
        imageFactory: function (obj, callback, factoryInterface) {                          // 70
            return this.modalFactory(obj, callback, factoryInterface, imageFactory);        // 71
        },                                                                                  // 72
                                                                                            // 73
        videoFactory: function (obj, callback, factoryInterface) {                          // 74
            return this.modalFactory(obj, callback, factoryInterface, videoFactory);        // 75
        },                                                                                  // 76
                                                                                            // 77
        audioFactory: function (obj, callback, factoryInterface) {                          // 78
            return this.modalFactory(obj, callback, factoryInterface, audioFactory);        // 79
        },                                                                                  // 80
                                                                                            // 81
        textFactory: function (obj, callback, factoryInterface) {                           // 82
            return this.modalFactory(obj, callback, factoryInterface, textFactory);         // 83
        },                                                                                  // 84
                                                                                            // 85
        close: function () {                                                                // 86
            this.container.find('.modal').removeClass('in');                                // 87
            close.call(this);                                                               // 88
        }                                                                                   // 89
                                                                                            // 90
    });                                                                                     // 91
                                                                                            // 92
}));                                                                                        // 93
                                                                                            // 94
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/blueimp-youtube.js                       //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * blueimp Gallery YouTube Video Factory JS 1.1.2                                           // 2
 * https://github.com/blueimp/Gallery                                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Licensed under the MIT license:                                                          // 8
 * http://www.opensource.org/licenses/MIT                                                   // 9
 */                                                                                         // 10
                                                                                            // 11
/* global define, window, document, YT */                                                   // 12
                                                                                            // 13
(function (factory) {                                                                       // 14
    'use strict';                                                                           // 15
    if (typeof define === 'function' && define.amd) {                                       // 16
        // Register as an anonymous AMD module:                                             // 17
        define([                                                                            // 18
            './blueimp-helper',                                                             // 19
            './blueimp-gallery-video'                                                       // 20
        ], factory);                                                                        // 21
    } else {                                                                                // 22
        // Browser globals:                                                                 // 23
        factory(                                                                            // 24
            window.blueimp.helper || window.jQuery,                                         // 25
            window.blueimp.Gallery                                                          // 26
        );                                                                                  // 27
    }                                                                                       // 28
}(function ($, Gallery) {                                                                   // 29
    'use strict';                                                                           // 30
                                                                                            // 31
    if (!window.postMessage) {                                                              // 32
        return Gallery;                                                                     // 33
    }                                                                                       // 34
                                                                                            // 35
    $.extend(Gallery.prototype.options, {                                                   // 36
        // The list object property (or data attribute) with the YouTube video id:          // 37
        youTubeVideoIdProperty: 'youtube',                                                  // 38
        // Optional object with parameters passed to the YouTube video player:              // 39
        // https://developers.google.com/youtube/player_parameters                          // 40
        youTubePlayerVars: {                                                                // 41
            wmode: 'transparent'                                                            // 42
        },                                                                                  // 43
        // Require a click on the native YouTube player for the initial playback:           // 44
        youTubeClickToPlay: true                                                            // 45
    });                                                                                     // 46
                                                                                            // 47
    var textFactory = Gallery.prototype.textFactory || Gallery.prototype.imageFactory,      // 48
        YouTubePlayer = function (videoId, playerVars, clickToPlay) {                       // 49
            this.videoId = videoId;                                                         // 50
            this.playerVars = playerVars;                                                   // 51
            this.clickToPlay = clickToPlay;                                                 // 52
            this.element = document.createElement('div');                                   // 53
            this.listeners = {};                                                            // 54
        };                                                                                  // 55
                                                                                            // 56
    $.extend(YouTubePlayer.prototype, {                                                     // 57
                                                                                            // 58
        canPlayType: function () {                                                          // 59
            return true;                                                                    // 60
        },                                                                                  // 61
                                                                                            // 62
        on: function (type, func) {                                                         // 63
            this.listeners[type] = func;                                                    // 64
            return this;                                                                    // 65
        },                                                                                  // 66
                                                                                            // 67
        loadAPI: function () {                                                              // 68
            var that = this,                                                                // 69
                onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady,                   // 70
                apiUrl = '//www.youtube.com/iframe_api',                                    // 71
                scriptTags = document.getElementsByTagName('script'),                       // 72
                i = scriptTags.length,                                                      // 73
                scriptTag;                                                                  // 74
            window.onYouTubeIframeAPIReady = function () {                                  // 75
                if (onYouTubeIframeAPIReady) {                                              // 76
                    onYouTubeIframeAPIReady.apply(this);                                    // 77
                }                                                                           // 78
                if (that.playOnReady) {                                                     // 79
                    that.play();                                                            // 80
                }                                                                           // 81
            };                                                                              // 82
            while (i) {                                                                     // 83
                i -= 1;                                                                     // 84
                if (scriptTags[i].src === apiUrl) {                                         // 85
                    return;                                                                 // 86
                }                                                                           // 87
            }                                                                               // 88
            scriptTag = document.createElement('script');                                   // 89
            scriptTag.src = apiUrl;                                                         // 90
            scriptTags[0].parentNode.insertBefore(scriptTag, scriptTags[0]);                // 91
        },                                                                                  // 92
                                                                                            // 93
        onReady: function () {                                                              // 94
            this.ready = true;                                                              // 95
            if (this.playOnReady) {                                                         // 96
                this.play();                                                                // 97
            }                                                                               // 98
        },                                                                                  // 99
                                                                                            // 100
        onPlaying: function () {                                                            // 101
            if (this.playStatus < 2) {                                                      // 102
                this.listeners.playing();                                                   // 103
                this.playStatus = 2;                                                        // 104
            }                                                                               // 105
        },                                                                                  // 106
                                                                                            // 107
        onPause: function () {                                                              // 108
            Gallery.prototype.setTimeout.call(                                              // 109
                this,                                                                       // 110
                this.checkSeek,                                                             // 111
                null,                                                                       // 112
                2000                                                                        // 113
            );                                                                              // 114
        },                                                                                  // 115
                                                                                            // 116
        checkSeek: function () {                                                            // 117
            if (this.stateChange === YT.PlayerState.PAUSED ||                               // 118
                    this.stateChange === YT.PlayerState.ENDED) {                            // 119
                // check if current state change is actually paused                         // 120
                this.listeners.pause();                                                     // 121
                delete this.playStatus;                                                     // 122
            }                                                                               // 123
        },                                                                                  // 124
                                                                                            // 125
        onStateChange: function (event) {                                                   // 126
            switch (event.data) {                                                           // 127
            case YT.PlayerState.PLAYING:                                                    // 128
                this.hasPlayed = true;                                                      // 129
                this.onPlaying();                                                           // 130
                break;                                                                      // 131
            case YT.PlayerState.PAUSED:                                                     // 132
            case YT.PlayerState.ENDED:                                                      // 133
                this.onPause();                                                             // 134
                break;                                                                      // 135
            }                                                                               // 136
            // Save most recent state change to this.stateChange                            // 137
            this.stateChange = event.data;                                                  // 138
        },                                                                                  // 139
                                                                                            // 140
        onError: function (event) {                                                         // 141
            this.listeners.error(event);                                                    // 142
        },                                                                                  // 143
                                                                                            // 144
        play: function () {                                                                 // 145
            var that = this;                                                                // 146
            if (!this.playStatus) {                                                         // 147
                this.listeners.play();                                                      // 148
                this.playStatus = 1;                                                        // 149
            }                                                                               // 150
            if (this.ready) {                                                               // 151
                if (!this.hasPlayed && (this.clickToPlay || (window.navigator &&            // 152
                        /iP(hone|od|ad)/.test(window.navigator.platform)))) {               // 153
                    // Manually trigger the playing callback if clickToPlay                 // 154
                    // is enabled and to workaround a limitation in iOS,                    // 155
                    // which requires synchronous user interaction to start                 // 156
                    // the video playback:                                                  // 157
                    this.onPlaying();                                                       // 158
                } else {                                                                    // 159
                    this.player.playVideo();                                                // 160
                }                                                                           // 161
            } else {                                                                        // 162
                this.playOnReady = true;                                                    // 163
                if (!(window.YT && YT.Player)) {                                            // 164
                    this.loadAPI();                                                         // 165
                } else if (!this.player) {                                                  // 166
                    this.player = new YT.Player(this.element, {                             // 167
                        videoId: this.videoId,                                              // 168
                        playerVars: this.playerVars,                                        // 169
                        events: {                                                           // 170
                            onReady: function () {                                          // 171
                                that.onReady();                                             // 172
                            },                                                              // 173
                            onStateChange: function (event) {                               // 174
                                that.onStateChange(event);                                  // 175
                            },                                                              // 176
                            onError: function (event) {                                     // 177
                                that.onError(event);                                        // 178
                            }                                                               // 179
                        }                                                                   // 180
                    });                                                                     // 181
                }                                                                           // 182
            }                                                                               // 183
        },                                                                                  // 184
                                                                                            // 185
        pause: function () {                                                                // 186
            if (this.ready) {                                                               // 187
                this.player.pauseVideo();                                                   // 188
            } else if (this.playStatus) {                                                   // 189
                delete this.playOnReady;                                                    // 190
                this.listeners.pause();                                                     // 191
                delete this.playStatus;                                                     // 192
            }                                                                               // 193
        }                                                                                   // 194
                                                                                            // 195
    });                                                                                     // 196
                                                                                            // 197
    $.extend(Gallery.prototype, {                                                           // 198
                                                                                            // 199
        YouTubePlayer: YouTubePlayer,                                                       // 200
                                                                                            // 201
        textFactory: function (obj, callback) {                                             // 202
            var videoId = this.getItemProperty(obj, this.options.youTubeVideoIdProperty);   // 203
            if (videoId) {                                                                  // 204
                return this.videoFactory(                                                   // 205
                    obj,                                                                    // 206
                    callback,                                                               // 207
                    new YouTubePlayer(                                                      // 208
                        videoId,                                                            // 209
                        this.options.youTubePlayerVars,                                     // 210
                        this.options.youTubeClickToPlay                                     // 211
                    )                                                                       // 212
                );                                                                          // 213
            }                                                                               // 214
            return textFactory.call(this, obj, callback);                                   // 215
        }                                                                                   // 216
                                                                                            // 217
    });                                                                                     // 218
                                                                                            // 219
    return Gallery;                                                                         // 220
}));                                                                                        // 221
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/andruschka:bootstrap-image-gallery/lib/blueimp-gallery-audio.js                 //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
/*                                                                                          // 1
 * blueimp Gallery Audio Factory JS 1.1.0                                                   // 2
 * https://github.com/blueimp/Gallery                                                       // 3
 *                                                                                          // 4
 * Copyright 2013, Sebastian Tschan                                                         // 5
 * https://blueimp.net                                                                      // 6
 *                                                                                          // 7
 * Licensed under the MIT license:                                                          // 8
 * http://www.opensource.org/licenses/MIT                                                   // 9
 */                                                                                         // 10
                                                                                            // 11
/* global define, window, document */                                                       // 12
                                                                                            // 13
(function (factory) {                                                                       // 14
    'use strict';                                                                           // 15
    if (typeof define === 'function' && define.amd) {                                       // 16
        // Register as an anonymous AMD module:                                             // 17
        define([                                                                            // 18
            './blueimp-helper',                                                             // 19
            './blueimp-gallery'                                                             // 20
        ], factory);                                                                        // 21
    } else {                                                                                // 22
        // Browser globals:                                                                 // 23
        factory(                                                                            // 24
            window.blueimp.helper || window.jQuery,                                         // 25
            window.blueimp.Gallery                                                          // 26
        );                                                                                  // 27
    }                                                                                       // 28
}(function ($, Gallery) {                                                                   // 29
    'use strict';                                                                           // 30
                                                                                            // 31
    $.extend(Gallery.prototype.options, {                                                   // 32
        // The class for audio content elements:                                            // 33
        audioContentClass: 'audio-content',                                                 // 34
        // The class for audio when it is loading:                                          // 35
        audioLoadingClass: 'audio-loading',                                                 // 36
        // The class for audio when it is playing:                                          // 37
        audioPlayingClass: 'audio-playing',                                                 // 38
        // The list object property (or data attribute) for the audio poster URL:           // 39
        audioPosterProperty: 'poster',                                                      // 40
        // The list object property (or data attribute) for the audio sources array:        // 41
        audioSourcesProperty: 'sources'                                                     // 42
    });                                                                                     // 43
                                                                                            // 44
    Gallery.prototype.audioFactory = function (obj, callback, audioInterface) {             // 45
        var that = this,                                                                    // 46
            options = this.options,                                                         // 47
            audioContainerNode = this.elementPrototype.cloneNode(false),                    // 48
            audioContainer = $(audioContainerNode),                                         // 49
            errorArgs = [{                                                                  // 50
                type: 'error',                                                              // 51
                target: audioContainerNode                                                  // 52
            }],                                                                             // 53
            audio = audioInterface || document.createElement('audio'),                      // 54
            url = this.getItemProperty(obj, options.urlProperty),                           // 55
            type = this.getItemProperty(obj, options.typeProperty),                         // 56
            title = this.getItemProperty(obj, options.titleProperty),                       // 57
            posterUrl = this.getItemProperty(obj, options.audioPosterProperty),             // 58
            posterImage,                                                                    // 59
            sources = this.getItemProperty(                                                 // 60
                obj,                                                                        // 61
                options.audioSourcesProperty                                                // 62
            ),                                                                              // 63
            source,                                                                         // 64
            playMediaControl,                                                               // 65
            isLoading,                                                                      // 66
            hasControls;                                                                    // 67
        audioContainer.addClass(options.audioContentClass);                                 // 68
        if (title) {                                                                        // 69
            audioContainerNode.title = title;                                               // 70
        }                                                                                   // 71
        if (audio.canPlayType) {                                                            // 72
            if (url && type && audio.canPlayType(type)) {                                   // 73
                audio.src = url;                                                            // 74
            } else {                                                                        // 75
                while (sources && sources.length) {                                         // 76
                    source = sources.shift();                                               // 77
                    url = this.getItemProperty(source, options.urlProperty);                // 78
                    type = this.getItemProperty(source, options.typeProperty);              // 79
                    if (url && type && audio.canPlayType(type)) {                           // 80
                        audio.src = url;                                                    // 81
                        break;                                                              // 82
                    }                                                                       // 83
                }                                                                           // 84
            }                                                                               // 85
        }                                                                                   // 86
        if (posterUrl) {                                                                    // 87
            audio.poster = posterUrl;                                                       // 88
            posterImage = this.imagePrototype.cloneNode(false);                             // 89
            $(posterImage).addClass(options.toggleClass);                                   // 90
            posterImage.src = posterUrl;                                                    // 91
            posterImage.draggable = false;                                                  // 92
            audioContainerNode.appendChild(posterImage);                                    // 93
        }                                                                                   // 94
        playMediaControl = document.createElement('a');                                     // 95
        playMediaControl.setAttribute('target', '_blank');                                  // 96
        if (!audioInterface) {                                                              // 97
            playMediaControl.setAttribute('download', title);                               // 98
        }                                                                                   // 99
        playMediaControl.href = url;                                                        // 100
        if (audio.src) {                                                                    // 101
            audio.controls = true;                                                          // 102
            (audioInterface || $(audio))                                                    // 103
                .on('error', function () {                                                  // 104
                    that.setTimeout(callback, errorArgs);                                   // 105
                })                                                                          // 106
                .on('pause', function () {                                                  // 107
                    isLoading = false;                                                      // 108
                    audioContainer                                                          // 109
                        .removeClass(that.options.audioLoadingClass)                        // 110
                        .removeClass(that.options.audioPlayingClass);                       // 111
                    if (hasControls) {                                                      // 112
                        that.container.addClass(that.options.controlsClass);                // 113
                    }                                                                       // 114
                    if (that.interval) {                                                    // 115
                        that.play();                                                        // 116
                    }                                                                       // 117
                })                                                                          // 118
                .on('playing', function () {                                                // 119
                    isLoading = false;                                                      // 120
                    audioContainer                                                          // 121
                        .removeClass(that.options.audioLoadingClass)                        // 122
                        .addClass(that.options.audioPlayingClass);                          // 123
                    if (that.container.hasClass(that.options.controlsClass)) {              // 124
                        hasControls = true;                                                 // 125
                        that.container.removeClass(that.options.controlsClass);             // 126
                    } else {                                                                // 127
                        hasControls = false;                                                // 128
                    }                                                                       // 129
                })                                                                          // 130
                .on('play', function () {                                                   // 131
                    window.clearTimeout(that.timeout);                                      // 132
                    isLoading = true;                                                       // 133
                    audioContainer.addClass(that.options.audioLoadingClass);                // 134
                });                                                                         // 135
            $(playMediaControl).on('click', function (event) {                              // 136
                that.preventDefault(event);                                                 // 137
                if (isLoading) {                                                            // 138
                    audio.pause();                                                          // 139
                } else {                                                                    // 140
                    audio.play();                                                           // 141
                }                                                                           // 142
            });                                                                             // 143
            audioContainerNode.appendChild(                                                 // 144
                (audioInterface && audioInterface.element) || audio                         // 145
            );                                                                              // 146
        }                                                                                   // 147
        audioContainerNode.appendChild(playMediaControl);                                   // 148
        this.setTimeout(callback, [{                                                        // 149
            type: 'load',                                                                   // 150
            target: audioContainerNode                                                      // 151
        }]);                                                                                // 152
        return audioContainerNode;                                                          // 153
    };                                                                                      // 154
                                                                                            // 155
    return Gallery;                                                                         // 156
}));                                                                                        // 157
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("andruschka:bootstrap-image-gallery");

})();
