import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h1>Welcome to My Portfolio</h1>

      <p>This is the home page of my portfolio website.</p>

      <p>I want to improve my programming skills and create useful applications.</p>
    
    <Link className="home-button" to="/about">
      Learn More About Me
    </Link>
    </div>
  );
}

export default Home;