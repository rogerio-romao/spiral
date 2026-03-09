try {
    const prefs = JSON.parse(localStorage.getItem('spiral:preferences') || '{}');
    if (prefs.showPlayer === false) {
        document.querySelector('#player').style.display = 'none';
    }
} catch {
    // localStorage unavailable or corrupt — fail silently
}
