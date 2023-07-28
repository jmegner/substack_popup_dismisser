// ==UserScript==
// @name        substack_popup_dismisser
// @namespace   https://github.com/jmegner
// @version     0.2
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

(new MutationObserver(makeLogWrappedCallback(checkForPopups))).observe(
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

function getXPathResult(xpathExpression)
{
  var xPathResult = document.evaluate(xpathExpression, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  //console.debug("xPathResult", xPathResult);
  var firstResult = xPathResult.iterateNext();
  //console.debug("firstResult", firstResult);
  return firstResult;
}

function checkForPopups(changes, observer)
{
  let xpaths = [
    "//div[text()='Continue reading']",
    "//button[text()='Continue reading']",
    "//div[text()='No thanks']",
    "//button[text()='No thanks']",
  ];

  for(let xpath of xpaths)
  {
    let dismissalElem = getXPathResult(xpath);
    if(dismissalElem)
    {
      dismissalElem.click();
      console.debug(
        "substack_popup_dismisser clicked \"" + xpath + "\", relevant mutation list",
        changes);
    }
  }
}
