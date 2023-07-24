import "./navbar.css";
import logo from "./media/accessibility logo (1).png"

function Navbar() {
    return (
        <nav className="navbar navbar-light bg-dark">
            <a className="navbar-logo navbar-brand" href="/"><img src={logo} width="100" height="95" alt="logo" /></a>
            <button type="button" className="info-button btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal"><span className="info-icon material-symbols-outlined">info</span></button>
            <div className="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Accessibility Web Scraper</h5>
                    </div>
                    <div className="modal-body">
                    <p>
                        The Accessibility Web Scraper is a solution to automate the process of searching URLs using the WAVE Web Accessibility Evaluation tool. 
                        The idea for the project arose from the tedious and time-consuming process of manually checking every URL associated with a website, 
                        and the goal is to save developers, designers, and website managers time and promote frequent web accessibility audits.
                        <br></br>
                        <br></br>
                        Simply enter a URL into the search bar, and the application will automate WAVE searches on all associated links and generate an 
                        Excel file with errors, contrast errors, and alerts from the details tab of WAVE’s Web Accessibility Evaluation tool.
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
  