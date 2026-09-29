const NavBar = () => {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-mark">S</div>
        <div>
          <span className="brand-name">StudentHub</span>
          <small>Academic records</small>
        </div>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="#">Home</a>
        <a href="#student-form">Students</a>
        <a href="#">Programs</a>
        <a href="#">Contact</a>
      </nav>

      <button type="button" className="nav-button">
        Sign Up
      </button>
    </header>
  )
}

export default NavBar