// ==UserScript==
// @name        substack_popup_dismisser
// @namespace   https://github.com/jmegner
// @version     0.1
// @description dismiss popups from substack
// @license     Unlicense
// @homepageURL https://github.com/jmegner/substack_popup_dismisser
// @supportURL  https://github.com/jmegner/substack_popup_dismisser/issues
// @match       https://*.substack.com/*
// @grant       GM.xmlHttpRequest
// @run-at      document-end
// ==/UserScript==

"use strict";
console.debug("substack_popup_dismisser active");

(new MutationObserver(makeLogWrappedCallback(checkForDismissalDiv))).observe(
  document,
  {childList: true, subtree: true});

function execLogWrappedFunc(funcToWrap, ...funcArgs)
{
  try
  {
    return funcToWrap(...funcArgs);
  }
  catch(err)
  {
    console.error(err);
    throw err;
  }
}

function makeLogWrappedCallback(funcToWrap)
{
  return function(...funcArgs) { return execLogWrappedFunc(funcToWrap, ...funcArgs); };
}

function getDismissalDiv()
{
  var xPathResult = document.evaluate("//div[text()='Continue reading']", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  //console.debug("xPathResult", xPathResult);
  var dismissalDiv = xPathResult.iterateNext();
  //console.debug("dismissalDiv", dismissalDiv);
  return dismissalDiv;

}

function checkForDismissalDiv(changes, observer)
{
  var dismissalDiv = getDismissalDiv();

  if(dismissalDiv)
  {
    dismissalDiv.click();
    console.debug("substack_popup_dismisser clicked dismiss; relevant mutation list", changes);
  }
}
