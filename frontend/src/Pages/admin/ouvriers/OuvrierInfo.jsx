import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

function OuvrierInfo() {
  const { id } = useParams();
  const [ouvrier, setOuvrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [specialities, setSpecialities] = useState([]);

const fetchOuvrierInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/employes/${id}`);
        if (!response.ok) {
          throw new Error("Ouvrier non trouvé");
        }
        const data = await response.json();
        setOuvrier(data);
        setEditData({ ...data, skills: data.skills || [] });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  useEffect(() => {
    fetch("http://localhost:8000/api/specialities")
    .then((response) => response.json())
    .then((data) => setSpecialities(data))
    .catch((error) => console.error("Erreur API :", error));

    
    fetchOuvrierInfo();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...editData.skills];
    updatedSkills[index] = value;
    setEditData({ ...editData, skills: updatedSkills });
  };

  const addSkill = () => {
    setEditData({ ...editData, skills: [...editData.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = editData.skills.filter((_, i) => i !== index);
    setEditData({ ...editData, skills: updatedSkills });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/employes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");

      const updatedData = await response.json();
      console.log("Success!", updatedData.employe);
      
      setOuvrier(prevOuvrier => ({
        ...prevOuvrier, 
        ...updatedData.data
      }));
      setShowModal(false);
    } catch (error) {
      console.error("Erreur mise à jour :", error);
    }
  };

  if (loading) return <div className="container p-3">Chargement...</div>;
  if (error) return <div className="container p-3 text-danger">Erreur: {error}</div>;
  if (!ouvrier) return <div className="container p-3">Ouvrier non trouvé</div>;

  return (
    <div className="container p-4 bg-light" style={{marginTop: "9vh", minHeight: "91vh"}}>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h2 className="mb-0">{ouvrier.prenom} {ouvrier.nom}</h2>
          <Button variant="light" onClick={() => setShowModal(true)}>Modifier</Button>
        </div>
        <div className="card-body">
          <h4 className="text-secondary mb-3">Informations générales</h4>
          <div className="row">
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item"><strong>Prénom :</strong> {ouvrier.prenom}</li>
                <li className="list-group-item"><strong>Nom :</strong> {ouvrier.nom}</li>
                <li className="list-group-item"><strong>Email :</strong> {ouvrier.mail}</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item"><strong>Rôle :</strong> {ouvrier.role}</li>
                <li className="list-group-item"><strong>Spécialité :</strong> {ouvrier.specialite}</li>
              </ul>
            </div>
          </div>

          <hr className="my-4" />

          <h4 className="text-secondary mb-3">Compétences</h4>
          {ouvrier.skills && ouvrier.skills.length > 0 ? (
            <ul className="list-group">
              {ouvrier.skills.map((skill, index) => (
                <li key={index} className="list-group-item">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune compétence renseignée</p>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'ouvrier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" name="nom" value={editData.nom} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" name="prenom" value={editData.prenom} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="mail" value={editData.mail} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rôle</Form.Label>
              <Form.Select name="role" value={editData.role} onChange={handleEditChange}>
                <option value="admin">Admin</option>
                <option value="ouvrier">Ouvrier</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Spécialité</Form.Label>
              <Form.Select name="specialite" value={editData.specialite} onChange={handleEditChange}>
                {specialities.map((specialite, index) => (
                    <option key={index} value={specialite.id}>{specialite}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <h4 className="mt-3">Compétences</h4>
            {editData.skills.map((skill, index) => (
              <div key={index} className="input-group mb-2">
                <Form.Control
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
                <Button variant="danger" onClick={() => removeSkill(index)}>X</Button>
              </div>
            ))}
            <Button variant="outline-dark" className="mt-3 mx-2" onClick={addSkill}>Ajouter une compétence</Button>

            <Button className="mt-3 mx-2" variant="success" onClick={handleSaveChanges}>Enregistrer</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OuvrierInfo;
