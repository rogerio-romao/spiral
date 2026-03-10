/**
 * Without this, if the user preference is to hide the music player initially, there will be a flash of the player on load before the script runs and hides it. By applying the preference immediately on script load, we can prevent this flash and ensure the UI is consistent with user preferences from the moment the page renders. This is loaded as a script in `index.html`.
 */

try {
    const prefs = JSON.parse(localStorage.getItem('spiral:preferences') || '{}');
    if (prefs.showPlayer === false) {
        document.querySelector('#player').style.display = 'none';
    }
} catch {
    // localStorage unavailable or corrupt — fail silently
}
