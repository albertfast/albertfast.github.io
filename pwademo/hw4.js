document.addEventListener('DOMContentLoaded', () => {
  const selectBackground = document.getElementById('background-select');
  const changeBackgroundButton = document.getElementById('change-background');
  const userNameInput = document.getElementById('name-input');
  const storedNameDisplay = document.getElementById('greeting');

  // Event listener for background change
  changeBackgroundButton.addEventListener('click', () => {
      const selectedValue = selectBackground.value;

      // Debug message
      console.log(`Background change button clicked. Selected value: ${selectedValue}`);

      // Remove any previous background classes
      document.body.classList.remove('lightblue', 'lightgold');

      // Add the selected background class
      if (selectedValue === 'lightblue') {
          document.body.classList.add('lightblue');
          console.log('Background changed to lightblue.');
      } else if (selectedValue === 'lightgold') {
          document.body.classList.add('lightgold');
          console.log('Background changed to lightgold.');
      }
  });

  // Store and retrieve user name in local storage
  userNameInput.addEventListener('input', () => {
      const userName = userNameInput.value;

      // Debug message
      console.log(`User input detected. Current input: ${userName}`);

      if (userName) {
          localStorage.setItem('name', userName);
          storedNameDisplay.textContent = `Welcome, ${userName}!`;
          console.log('User name saved in local storage.');
      }
  });

  // Load stored name on page load
  const storedName = localStorage.getItem('name');
  if (storedName) {
      storedNameDisplay.textContent = `Welcome back, ${storedName}!`;
      console.log(`Stored name loaded from local storage: ${storedName}`);
  }

  // Register Service Worker
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('service-worker.js')
        .then(() => console.log('Service Worker registered successfully.'))
        .catch((error) => console.error('Service Worker registration failed:', error));
  } else {
      console.error('Service Worker not supported in this browser.');
  }

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (event) => {
      console.log('beforeinstallprompt event triggered.');
      event.preventDefault(); // Prevent the mini-infobar from appearing
      deferredPrompt = event;
      console.log('Deferred prompt saved.');

      // Show an install button or trigger prompt
      const installButton = document.getElementById('install-button');
      if (installButton) {
          installButton.style.display = 'block';
          console.log('Install button displayed.');

          installButton.addEventListener('click', () => {
              console.log('Install button clicked.');
              deferredPrompt.prompt();

              deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') {
                      console.log('User accepted the install prompt.');
                  } else {
                      console.log('User dismissed the install prompt.');
                  }
                  deferredPrompt = null;
              }).catch((error) => {
                  console.error('Error during the install prompt:', error);
              });
          });
      } else {
          console.error('Install button not found in the DOM.');
      }
  });

  // Debugging visibility of the install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
        console.log('Install button detected in the DOM. Initial state:', installButton.style.display);
    } else {
        console.error('Install button not present in the DOM.');
    }
});
