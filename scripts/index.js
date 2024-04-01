$(document).ready(() => {
  const emojiTransitions = {
    'deaf-man-emoji': 'man-bowing-emoji',
    'man-bowing-emoji': 'man-shrugging-emoji',
    'man-shrugging-emoji': 'man-bowing-emoji'
  };
  
  const sound = new Howl({
    src: ['./assets/track.mp3']
  });

  sound.on('fade', () => {
    const currentEmoji = $('img').attr('src').split('/').pop().split('.').shift();

    if (currentEmoji === 'man-shrugging-emoji') {
      sound.pause();
    }
  });

  sound.on('end', () => {
    $('img').attr('src', `./assets/deaf-man-emoji.svg`);
    sound.volume(0.25);
  });

  $('#emoji').on('click', () => {
    const currentEmoji = $('img').attr('src').split('/').pop().split('.').shift();

    const nextEmoji = emojiTransitions[currentEmoji];

    $('img').attr('src', `./assets/${nextEmoji}.svg`);

    if (nextEmoji === 'man-bowing-emoji') {
      sound.fade(0, 0.25, 250);
      sound.play();
    } else if (nextEmoji === 'man-shrugging-emoji') {
      sound.fade(sound.volume(), 0, 250);
    }
  });
});
