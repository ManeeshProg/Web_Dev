const API_KEY = 'b5bc2516ac14c1eef571ba5629757089'; // Your TMDb API key
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('moviesContainer');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query !== '') {
    fetchMovies(query);
  }
});

async function fetchMovies(query) {
  moviesContainer.innerHTML = '<p>Loading...</p>'; // Show loading text

  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results.length > 0) {
      displayMovies(data.results);
    } else {
      moviesContainer.innerHTML = `<p>No movies found for "${query}".</p>`;
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    moviesContainer.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || '/path/to/default-image.jpg'}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.release_date}</p>
    </div>
  `).join('');
}
