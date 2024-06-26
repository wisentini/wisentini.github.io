luxon.Settings.defaultLocale = 'pt-BR';
luxon.Settings.defaultZone = 'America/Sao_Paulo';

const emojiTransitions = {
  'deaf-man-emoji': 'man-bowing-emoji',
  'man-bowing-emoji': 'man-shrugging-emoji',
  'man-shrugging-emoji': 'man-bowing-emoji'
};

const digestMessage = async (message) => {
  const messageBuffer = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest('SHA-512', messageBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateBackgroundColor = async () => {
  const currentDayAndMonth = luxon.DateTime.now().toFormat('dd/MM');

  if (!['05/03', '07/05', '09/08', '08/09', '16/12'].includes(currentDayAndMonth)) {
    return '#660000';
  }

  const hash = await digestMessage(luxon.DateTime.now().toLocaleString());

  return `#${hash.substring(0, 6).toUpperCase()}`;
};

$(async () => {
  const backgroundColor = await generateBackgroundColor();
  
  $('body').css('background-color', backgroundColor);
  
  const sound = new Howl({
    src: ['./assets/track.mp3'],
    volume: 0.1,
    html5: true,
    onend: () => {
      sound.unload();
    }
  });

  sound.on('fade', () => {
    const currentEmoji = $('img').attr('src').split('/').pop().split('.').shift();

    if (currentEmoji === 'man-shrugging-emoji') {
      sound.pause();
    }
  });

  sound.on('end', () => {
    $('img').attr('src', `./assets/deaf-man-emoji.svg`);
    sound.volume(0.1);
  });

  $('#emoji').on('click', () => {
    const currentEmoji = $('img').attr('src').split('/').pop().split('.').shift();

    const nextEmoji = emojiTransitions[currentEmoji];

    $('img').attr('src', `./assets/${nextEmoji}.svg`);

    if (nextEmoji === 'man-bowing-emoji') {
      sound.fade(0, 0.1, 250);
      sound.play();
    } else if (nextEmoji === 'man-shrugging-emoji') {
      sound.fade(sound.volume(), 0, 250);
    }
  });
});
