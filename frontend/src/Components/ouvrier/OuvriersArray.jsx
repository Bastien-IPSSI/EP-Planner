import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";


function OuvrierArray() {
  const [employes, setEmployes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/employes")
      .then((response) => response.json())
      .then((data) => {
        setEmployes(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Erreur API :", error));
  }, []);

  function test(e) {
    const id = e.target.value;

    fetch(`http://localhost:8000/api/admin/employes/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Échec de la suppression');
        }

        setEmployes(prevEmployes => prevEmployes.filter(employe => employe.id !== parseInt(id)));
        console.log('Suppression réussie');
      })
      .catch(error => {
        console.error('Il y a eu une erreur !', error);
      });
  }

  if (isLoading) {
    return <Spinner />;
  }
 
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Prénom</th>
          <th>Nom</th>
          <th>Rôle</th>
        </tr>
      </thead>
      <tbody>
        {employes.map((employe, index) => (
          <tr key={index}>
            <td>{employe.prenom}</td>
            <td>{employe.nom}</td>
            <td className="d-flex justify-content-around">
                <span>{employe.role}</span>
                <div className="btns">
                    <Link to={`/admin/ouvriers/${employe.id}`}>
                        <button type="button" className="btn btn-dark mx-2">Gerer</button>
                    </Link>
                    <button type="button" value={employe.id} className="btn btn-danger mx-2" onClick={test}>Suprimmer</button>
                </div>
                </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default OuvrierArray;
