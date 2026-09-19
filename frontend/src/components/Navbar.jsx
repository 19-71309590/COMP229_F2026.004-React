import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h2>My Portfolio</h2>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Me</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#references">References</a></li>
        <li><a href="#contact">Contact Me</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;