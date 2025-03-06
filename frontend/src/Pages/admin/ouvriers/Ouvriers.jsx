import { Link } from "react-router-dom";
import OuvrierArray from "../../../Components/ouvrier/OuvriersArray";

function Ouvriers() {
    return ( 
        <div>
            <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
                <h1>Listes des ouvriers</h1>
                <div className="d-flex justify-content-end">
                    <Link to="/admin/ouvriers/new">
                        <button className="btn my-4 btn-dark">Créer un nouvel ouvrier</button>
                    </Link>
                </div>
                <OuvrierArray/>
            </div>
        </div>
     );
}

export default Ouvriers;