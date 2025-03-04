import ChantierForm from "../components/chantier/form";

const Chantier = () => {
    return (
        <div>
            <nav className="bg-dark" style={{ height: "10vh" }}>
                <ul>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/chantier">Chantier</a></li>
                </ul>
            </nav>
            <div className="container p-3 bg-light" style={{ height: "90vh" }}>
                <ChantierForm />
            </div>
        </div>
    );
};

export default Chantier;