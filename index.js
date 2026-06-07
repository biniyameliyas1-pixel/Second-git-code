<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
        content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Professional web solutions for businesses and individuals. Delivering outstanding results through creativity and cutting-edge technology.">
  <title>Simple Website</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Skip to main content link for accessibility -->
  <a href="#main" class="skip-link">Skip to main content</a>

  <header>
    <h1>Welcome to My Website</h1>
  </header>

  <nav aria-label="Main navigation">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <main id="main">
    <section id="home">
      <h2>Home</h2>
      <p>
        Welcome to our website! 
        We are a passionate team dedicated to 
        providing top-notch web solutions for 
        businesses and individuals.
      </p>
    </section>

    <section id="about">
      <h2>About</h2>
      <p>
        Our company was founded in 2010 with 
        the mission to make the web a better place. 
        We believe in delivering outstanding results by 
        combining creativity and cutting-edge technology.
      </p>
    </section>

    <section id="services">
      <h2>Services</h2>
      <p>
        This is the services section of the website.
      </p>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p>
        Have a question or want to discuss 
        a project? We'd love to hear from you!
      </p>
      <form action="mailto:contact@example.com" method="GET">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>
        
        <button type="submit">Send</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 Your Website Name. All rights reserved.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>
