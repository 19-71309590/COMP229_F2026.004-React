import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="logo" to="/">
        <img src="/gm-logo.png" alt="Gyubin Mun logo" />
        <span>My Portfolio</span>
      </Link>      
      
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Me</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/references">References</Link></li>
        <li><Link to="/contact">Contact Me</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar