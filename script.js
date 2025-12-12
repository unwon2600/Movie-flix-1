const apiKey = '6d63675b'; // Your OMDB API key
const baseUrl = 'http://www.omdbapi.com/';

// Predefined movie titles to load on page load (edit as needed)
const defaultMovies = ['Inception', 'The Dark Knight', 'Interstellar'];

// Function to fetch movie details from OMDB
async function fetchMovieDetails(title) {
    try {
        const response = await fetch(`${baseUrl}?apikey=${apiKey}&t=${encodeURIComponent(title)}&plot=full`);
        const data = await response.json();
        if (data.Response === 'True') {
            return {
                title: data.Title,
                poster: data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
                genre: data.Genre || 'N/A',
                year: data.Year || 'N/A',
                synopsis: data.Plot || 'No synopsis available.',
                cast: data.Actors || 'N/A', // OMDB provides actors in one field
                rating: data.imdbRating ? `${data.imdbRating}/10` : 'N/A',
                downloadLink: `downloads/${title.toLowerCase().replace(/\s+/g, '')}.mp4` // Placeholder; customize to your files
            };
        }
    } catch (error) {
        console.error('Error fetching movie:', error);
    }
    return null;
}

// Render movies to the grid
function renderMovies(movies) {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = ''; // Clear existing
    movies.forEach(movie => {
        if (movie) {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title} Poster">
                <h3>${movie.title}</h3>
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p><strong>Release Year:</strong> ${movie.year}</p>
                <p><strong>Synopsis:</strong> ${movie.synopsis}</p>
                <p><strong>Cast:</strong> ${movie.cast}</p>
                <p><strong>Rating:</strong> ${movie.rating}</p>
                <a href="${movie.downloadLink}" download class="download-btn">Download Movie</a>
            `;
            grid.appendChild(card);
        }
    });
}

// Load default movies on page load
async function loadDefaultMovies() {
    const movies = [];
    for (const title of defaultMovies) {
        const movie = await fetchMovieDetails(title);
        movies.push(movie);
    }
    renderMovies(movies);
}

// Search functionality (fetches and displays the searched movie)
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        const movie = await fetchMovieDetails(query);
        renderMovies(movie ? [movie] : []);
    }
});

// Download confirmation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('download-btn')) {
        if (!confirm('Are you sure you want to download this movie? Ensure you have legal access.')) {
            e.preventDefault();
        }
    }
});

// Request Movies Modal (unchanged)
const modal = document.getElementById('request-modal');
const requestBtn = document.getElementById('request-btn');
const closeBtn = document.getElementById('close-modal');

requestBtn.addEventListener('click', () => {
    modal.showModal();
});

closeBtn.addEventListener('click', () => {
    modal.close();
});

document.getElementById('request-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('movie-title').value;
    const details = document.getElementById('movie-details').value;
    alert(`Request submitted: ${title} - ${details}`);
    modal.close();
    e.target.reset();
});

// Load movies on page load
window.addEventListener('load', loadDefaultMovies);
