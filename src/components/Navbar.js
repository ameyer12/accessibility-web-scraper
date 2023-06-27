import "./navbar.css";
import logo from "./media/Austin Meyer Logo (1).png"

function Navbar() {
    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-logo navbar-brand" href="/"><img src={logo} width="60" height="60" alt="logo" /></a>
            <button type="button" className="info-button btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal"><span className="info-icon material-symbols-outlined">info</span></button>
            <div className="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Accessibility Web Scraper</h5>
                    </div>
                    <div className="modal-body">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                        deserunt mollit anim id est laborum.
                    </p>
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
                </div>
            </div>
        </nav>
    );
}
  
export default Navbar;
  