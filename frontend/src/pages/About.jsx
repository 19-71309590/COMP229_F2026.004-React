function About() {
  return (
    <div className="about">
      <h1>About Me</h1>

      <img
        className="profile-image"
        src="profile.png"
        alt="Profile Image"
      />

      <h2>Gyubin Mun</h2>

      <p>I am a passionate developer looking to create innovative solutions.</p>
    <a className="resume-link"
        href="resume.pdf" 
        target="_blank"
    >
      View My Resume
    </a>
    </div>
  );
}

export default About;