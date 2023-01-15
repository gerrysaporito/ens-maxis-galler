/**
 * Polyfill DOMParser for react-intl
 * Otherwise react-intl spews errors related to formatting messages with <xml>in them</xml>
 */
function setUpDOMParser() {
  const xmldom = require('xmldom');
  global['DOMParser'] = xmldom.DOMParser;
}

setUpDOMParser();
