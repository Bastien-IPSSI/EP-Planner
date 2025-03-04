import BesoinChantier from "./besoinChantier";

const ChantierForm = () => {
    return (
        <div className="container bg-white p-2 h-100 d-flex flex-column">
            <form action="">

                <h1>Chantier :</h1>
                <div className="d-flex align-items-center">
                    <label  htmlFor="nom">Nom:</label>
                    <input className="form-control m-2" type="text" name="nom" id="nom" />

                    <label htmlFor="lieu">Lieu:</label>
                    <input className="form-control m-2" type="text" name="lieu" id="lieu" />
                </div>
                <div className="d-flex align-items-center">
                    <label htmlFor="date">Du</label>
                    <input className="form-control m-2" type="date" name="date" id="date" />

                    <label htmlFor="date">Au</label>
                    <input className="form-control m-2" type="date" name="date" id="date" />
                </div>
                <div className="d-flex align-items-center">
                    <label htmlFor="statut">Statut</label>
                    <select className="form-control m-2" name="statut" id="statut">
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>

                </div>
                <div>
                    <BesoinChantier />
                </div>
            </form>
        </div>
    );
}

export default ChantierForm