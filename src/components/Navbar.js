import "./navbar.css";
import logo from "./media/accessibility logo (1).png"

function Navbar() {
    return (
        <nav className="navbar navbar-light bg-dark container-fluid">
            <a className="navbar-logo navbar-brand" href="/"><img src={logo} width="100" height="95" alt="logo" /></a>
                <ul className="navbar-nav mr-auto info-button">
                    <li className="nav-item dropdown">
                        <a className="nav-link" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="info-icon material-symbols-outlined">info</span></a>
                        <div className="dropdown-menu position-absolute" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal1">Project Overview</a>
                        <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal2">WAVE Overview</a>
                        <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modal3">How to Use</a>
                        </div>
                    </li>
                </ul>
            <div className="modal fade" id="modal1" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Project Overview</h5>
                    </div>
                    <div className="modal-body">
                    <p>
                        The Accessibility Web Scraper is a solution to automate the process of searching URLs using the WAVE Web Accessibility Evaluation tool. 
                        The idea for the project arose from the tedious and time-consuming process of manually checking every URL associated with a website, 
                        and the goal is to save developers, designers, and website managers time and promote frequent web accessibility audits.       
                    </p>
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
                </div>
            </div> 
            <div className="modal fade" id="modal2" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">WAVE Overview</h5>
                    </div>
                    <div className="modal-body">
                    <p>
                        WAVE is a suite of evaluation tools that helps authors make their web content more accessible to individuals with disabilities. 
                        The software can identify many accessibility and Web Content Accessibility Guideline errors and facilitates human evaluation of web 
                        content.   
                    </p>
                    <a href="https://wave.webaim.org/">Learn More</a>
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
                </div>
            </div> 
            <div className="modal fade" id="modal3" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">How to Use</h5>
                    </div>
                    <div className="modal-body">
                    <p>
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
  