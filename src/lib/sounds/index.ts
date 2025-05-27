const soundsList = {
  windowOpen: 'window-open.mp3',
  windowClose: 'window-close.mp3',
  click: 'click.mp3',
  notification: 'notification.mp3',
  error: 'error.mp3',
  success: 'success.mp3',
  typing: 'typing.mp3',
};

// Helper function to download sounds from Freesound or other sources
async function downloadSounds() {
  // This would be run by a build script
  // Sites like freesound.org or mixkit.co have free sound effects
  // Example API usage for freesound.org would go here
}

export { soundsList, downloadSounds };
