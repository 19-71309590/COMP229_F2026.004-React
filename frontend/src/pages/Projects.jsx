function Projects() {
  return (
    <div className="projects">
      <h1>My Projects</h1>

      <p>Here are some of the projects I have worked on.</p>

      <div className="project-list">
        <article className="project-card">
          <img
            src="/projects/expense-tracker.png"
            alt="Expense Tracker application"
          />

          <h2>Expense Tracker App</h2>
          <p><strong>Completion Date:</strong> June 24, 2026</p>

          <p>
            This was a team project where we recreated the main features
            of an existing expense tracker application.
          </p>

          <p>
            <strong>My Role:</strong> I worked on the frontend and helped
            create the screens and user interface.
          </p>

          <p>
            <strong>Outcome:</strong> The project resulted in iOS and Web
            application prototype based on common expense tracker features.
          </p>
        </article>

        <article className="project-card">
          <img
            src="/projects/car-rental.png"
            alt="Car rental database project"
          />

          <h2>Car Rental Database Project</h2>
          <p><strong>Completion Date:</strong> August 20, 2026</p>

          <p>
            This project simulated a database system based on the needs
            of customers and a car rental company.
          </p>

          <p>
            <strong>My Role:</strong> I analyzed the required data and
            helped design the database structure.
          </p>

          <p>
            <strong>Outcome:</strong> The final database design demonstrated
            how customer, vehicle, reservation, and rental information could
            be organized in a car rental system.
          </p>
        </article>

        <article className="project-card">
          <img
            src="/projects/stock-trading.png"
            alt="AI stock trading program"
          />

          <h2>AI Stock Trading Program</h2>
          <p><strong>Completion Date:</strong> In Progress</p>

          <p>
            This is an in-progress paper-trading project that collects and
            validates ETF market data for a future automated investment strategy.
          </p>

          <p>
            <strong>My Role:</strong> I am independently planning and developing
            the project using Python.
          </p>

          <p>
            <strong>Outcome:</strong> I implemented project settings, ETF price
            downloads, data validation, and SQLite storage. The trading strategy
            and dashboard are still in development.
          </p>
        </article>
      </div>
    </div>
  )
}

export default Projects