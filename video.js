function bindEvent(target, evtName, handler) {
  target.addEventListener(evtName, handler, true);
}

function setSpeed(video, n) {
  video.playbackRate = n;
}

function getSpeed(video) {
  return video.playbackRate;
}

function seek(video, n = 5) {
  video.currentTime += n;
}

function start() {
  const KEY_R = 'ArrowRight';
  const video = document.querySelector('video');
  if (!video) return console.error('没有 video 节点!');

  bindEvent(window, 'keydown', (evt) => {
    evt.stopPropagation();
    if (evt.key !== KEY_R || !evt.repeat) return;

    setSpeed(video, 5);
    console.log(evt);
  });

  bindEvent(window, 'keyup', (evt) => {
    if (evt.key !== KEY_R) return;

    if (getSpeed(video) !== 1) setSpeed(video, 1);
    else seek(video);
  });
}

start();
