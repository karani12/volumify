document.getElementById('volumeSlider').addEventListener('input', function() {
    const volumeValue = this.value / 100;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: adjustVolume,
        args: [volumeValue]
      });
    });
  });
  
  document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('volumeSlider').value = 100;
    const volumeValue = 1.0; 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: adjustVolume,
        args: [volumeValue]
      });
    });
  });
  
  function adjustVolume(volume) {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(media => {
      if (!media.audioContext) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(media);
        const gainNode = audioContext.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        media.audioContext = audioContext;
        media.source = source;
        media.gainNode = gainNode;
      }
      media.gainNode.gain.value = volume; 
    });
  }
  