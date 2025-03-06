const Spinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center p-3">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
        </div>
    );
};

export default Spinner;
