const generateRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const digestMessage = async (message) => {
  const messageBuffer = new TextEncoder().encode(message);                    
  const hashBuffer = await crypto.subtle.digest('SHA-512', messageBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateBackgroundColor = async () => {
  const hash = await digestMessage(luxon.DateTime.now().toLocaleString());
  return `#${hash.substring(0, 6).toUpperCase()}`;
};

$(document).ready(async () => {
  luxon.Settings.defaultLocale = 'pt-BR';
  luxon.Settings.defaultZone = 'America/Sao_Paulo';

  const currentDayAndMonth = luxon.DateTime.now().toFormat('dd/MM');

  let backgroundColor = '#660000';

  if (['05/03', '09/08', '08/09', '16/12'].includes(currentDayAndMonth)) {
    backgroundColor = await generateBackgroundColor();
  }
  
  $('body').css('background-color', backgroundColor);
  
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
