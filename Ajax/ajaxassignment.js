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

// Handle the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('beforeinstallprompt event triggered.');
    event.preventDefault(); // Prevent the mini-infobar from appearing
    deferredPrompt = event; // Save the event for later use
    console.log('Deferred prompt saved.');

    // Display the install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        console.log('Install button displayed.');

        installButton.addEventListener('click', () => {
            console.log('Install button clicked.');
            deferredPrompt.prompt(); // Show the install prompt

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt.');
                } else {
                    console.log('User dismissed the install prompt.');
                }
                deferredPrompt = null; // Reset the prompt
            }).catch((error) => {
                console.error('Error during the install prompt:', error);
            });
        });
    } else {
        console.error('Install button not found in the DOM.');
    }
});

// Debugging visibility of the install button
document.addEventListener('DOMContentLoaded', () => {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        console.log('Install button detected in the DOM. Initial state:', installButton.style.display);
    } else {
        console.error('Install button not present in the DOM.');
    }
});
