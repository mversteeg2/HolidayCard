document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('holidayCardForm');
    const lyricsDiv = document.getElementById('songLyrics');
    const resetButton = document.getElementById('resetButton');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get user inputs
        const name = document.getElementById('name').value.trim();
        const year = parseInt(document.getElementById('year').value, 10);

        // Validate inputs
        if (!name || !year || year < 1945 || year > new Date().getFullYear()) {
            alert('Please enter a valid name and year (since 1945).');
            return;
        }

        // Send data to server
        fetch('/generateSong', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, year })
        })
        .then(response => response.json())
        .then(data => {
            if (data.song) {  // Checking if the song property exists in the response
                lyricsDiv.innerText = data.song;  // Displaying the song text
            } else {
                lyricsDiv.innerText = 'No song generated.';
            }
            resetButton.style.display = 'block';
        });
        
    });

    resetButton.addEventListener('click', function() {
        // Clear form and lyrics
        form.reset();
        lyricsDiv.innerText = '';
        this.style.display = 'none';
    });
});
