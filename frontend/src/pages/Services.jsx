function Services() {
  return (
    <div className="services">
      <h1>My Services</h1>

      <p>
        These are some of the services I can provide based on my
        current skills and project experience.
      </p>

      <div className="service-list">
        <article className="service-card">
          <h2>Web Development</h2>
          <p>
            I can create basic responsive websites using HTML, CSS,
            JavaScript, and React.
          </p>
        </article>

        <article className="service-card">
          <h2>Mobile App Development</h2>
          <p>
            I can help build mobile application screens and user
            interfaces using React Native.
          </p>
        </article>

        <article className="service-card">
          <h2>Database Design</h2>
          <p>
            I can analyze data requirements and create relational
            database designs using tables, keys, and relationships.
          </p>
        </article>

        <article className="service-card">
          <h2>Python Programming</h2>
          <p>
            I can create basic Python programs for data processing,
            automation, and project experiments.
          </p>
        </article>
      </div>
    </div>
  )
}

export default Services