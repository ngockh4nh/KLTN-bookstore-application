function include(file) {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

/* include all the components js file */

include('/assets/user/angular/chat.js');
include('/assets/user/javascript/constants.js');
include('/assets/user/angular/cardsCarousel.js');
include('/assets/user/angular/botTyping.js');
include('/assets/user/angular/charts.js');
include('/assets/user/angular/collapsible.js');
include('/assets/user/angular/dropDown.js');
include('/assets/user/angular/location.js');
include('/assets/user/angular/pdfAttachment.js');
include('/assets/user/angular/quickReplies.js');
include('/assets/user/angular/suggestionButtons.js');
