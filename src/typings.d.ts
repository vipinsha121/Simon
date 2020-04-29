
// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare var mApp: any; // Related to Metronic
declare var mLayout: any; // Related to Metronic
declare var mUtil: any; // Related to Metronic
declare var mMenu: any;
declare var mOffcanvas: any;
declare var mScrollTop: any;
declare var mHeader: any;
declare var mToggle: any;
declare var mQuicksearch: any;
declare var mPortlet: any;
declare var $: any;

interface JQuery {
    Jcrop(...any): any;
}

interface JQuery {
    daterangepicker(...any): any;
}

interface JQuery {
    datepicker(...any): any;
}

interface JQuery {
    datetimepicker(...any): any;
}

interface JQuery {
    slimScroll(...any): any;
}

interface JQuery {
    timeago(...any): any;
}

/**
 * jQuery selectpicker
 */

interface JQuery {
    selectpicker(...any): any;
}

/**
 * jQuery sparkline
 */

interface JQuery {
    sparkline(...any): any;
}

/**
 * jQuery Bootstrap Switch
 */

interface JQuery {
    bootstrapSwitch(...any): any;
}

/**
 * Morris
 */

declare namespace morris {
    interface IAreaOptions {
        gridEnabled?: boolean;
        // gridLineColor?: string;
        padding?: number;
    }
}

/**
 * Chartjs
 */

declare var Chart: any;

/**
 * Chartist
 */

declare namespace Chartist {
    interface ChartistStatic {
        Pie: any;
        Svg: any;
    }
}

declare var Chartist: Chartist.ChartistStatic;


/**
 * rtl-detect
 */

declare module 'rtl-detect';

/**
 * horizontal-timeline
 */
interface JQuery {
    horizontalTimeline(...any): any;
}

interface JQuery {
    inputmask(...any): any;
}


