import type { JSX } from "react"
import { Link } from "react-router"

const Navbar: () => JSX.Element = () => {
  return (
    <nav className="navbar">
        <Link to="/" className="">
            <p className="text-2xl font-bold text-gradient">RESUMIND</p>
        </Link>
        <Link to="/upload" className="primary-button w-fit">
            Upload Resume
        </Link>
    </nav>
  )
}

export default Navbar