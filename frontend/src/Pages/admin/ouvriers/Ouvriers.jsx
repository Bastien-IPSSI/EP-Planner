import { Link, useNavigate } from "react-router-dom";

function Ouvriers() {
    return ( 
        <div>
            <div className="container p-3 bg-light" style={{ height: "90vh" }}>
                <h1>Listes de tous les Ouvriers existants</h1>
                <Link to="/admin/ouvriers/new">
                            <button>Creer un nouvel ouvrier</button>
                        </Link>
            </div>
        </div>
     );
}

export default Ouvriers;