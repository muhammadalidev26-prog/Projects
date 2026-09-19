
const toggleBtn = document.getElementById('toggle-theme');

// 1. Check for saved theme on page load
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  updateIcon(true);
} else {
  updateIcon(false);
}

// 2. Handle button click toggle
toggleBtn.addEventListener('click', () => {
  const isDarkNow = document.body.classList.toggle('dark-mode');
  
  // Save preference to localStorage
  localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
  
  // Update the visible icon
  updateIcon(isDarkNow);
});

// 3. Helper function to swap icon visibility/styles if needed
function updateIcon(isDark) {
  const moonIcon = toggleBtn.querySelector('.fa-moon');
  const sunIcon = toggleBtn.querySelector('.fa-sun');
  
  if (isDark) {
    if(moonIcon) moonIcon.style.opacity = '0.3';
    if(sunIcon) sunIcon.style.opacity = '1';
  } else {
    if(moonIcon) moonIcon.style.opacity = '1';
    if(sunIcon) sunIcon.style.opacity = '0.3';
  }
}