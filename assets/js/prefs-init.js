try {
    const p = JSON.parse(localStorage.getItem('spiral:preferences') || '{}');
    if (p.showPlayer === false) {
        document.querySelector('#player').style.display = 'none';
    }
} catch {}
