import { Link, useNavigate } from "react-router-dom";

function Chantiers() {
    return ( 
        <div>
            <div className="container p-3 bg-light" style={{ height: "90vh" }}>
                <h1>Listes de tous les chantiers existants</h1>
                <Link to="/admin/chantiers/new">
                            <button>Creer un nouveau chantier</button>
                        </Link>
            </div>
        </div>
     );
}

export default Chantiers;