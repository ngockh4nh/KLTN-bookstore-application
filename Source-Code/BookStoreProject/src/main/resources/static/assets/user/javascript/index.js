
/* module for importing other js files */
function include(file) {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

include('/assets/user/catalog/view/javascript/jquery/jquery.min.js');
include('/assets/user/catalog/view/javascript/jquery/materialize.min.js');
include('/assets/user/catalog/view/javascript/jquery/chart.min.js');
include('/assets/user/catalog/view/javascript/jquery/uuid.min.js');
