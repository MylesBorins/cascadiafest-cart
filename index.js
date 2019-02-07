#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log("✨ Streaming JSConfHI 2019 ✨ ");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://isleinterpret.1capapp.com/event/gatherscript#');
  let prevText = '';
  page.on('console', async (msg) => {
    let newText = msg.text();
    let output = '';
    if (newText.startsWith('update:')) {
      newText = newText.slice(7);
      if (newText.search(prevText) === 0) {
        update = newText.slice(prevText.length);
      }
      else {
        update = `\n${newText}`;
      }
      prevText = newText;
      process.stdout.write(update);
    }
    
  }) 
  
  await page.evaluate(() => {
    const targetNode = document.getElementsByClassName('STREAM')[0]
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
          const children = targetNode.children;
          const latest = children[children.length - 1];
          console.log("update:" + latest.innerText);
        }
      }
    };
    
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    
  });
})();
