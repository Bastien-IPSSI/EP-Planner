import OuvrierForm from "../../../Components/ouvrier/OuvrierForm";

const CreateOuvrier = () => {
    return (
        <div>
            <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
                <OuvrierForm />
            </div>
        </div>
    );
};

export default CreateOuvrier;