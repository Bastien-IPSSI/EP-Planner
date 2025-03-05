<?php

namespace App\Controller;

use App\Entity\Chantier;
use App\Entity\BesoinChantier;
use App\Entity\Affectation;
use App\Entity\Employe;
use App\Entity\Specialite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class ChantierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/admin/chantier/submit', name: 'api_admin_chantier_submit', methods: ['POST'])]
    public function submitChantier(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(["error" => "Invalid JSON data"], 400);
        }

        $this->entityManager->getConnection()->beginTransaction();
        try {
            $chantier = new Chantier();
            $chantier->setNom($data['nom']);
            $chantier->setLieu($data['lieu']);
            
            $dateDebut = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dateDebut']);
            $dateFin = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dateFin']);
            
            $chantier->setDateDebut($dateDebut);
            $chantier->setDateFin($dateFin);
            $chantier->setStatut($data['statut']);

            $this->entityManager->persist($chantier);
            $this->entityManager->flush();

            foreach ($data['besoinChantier'] as $besoinData) {
                $besoinChantier = new BesoinChantier();
                $specialite = $this->entityManager->getRepository(Specialite::class)->findOneBy(['nom' => $besoinData['speciality']]);
                $besoinChantier->setSpecialite($specialite);
                $besoinChantier->setNombre($besoinData['number']);
                $besoinChantier->setChantier($chantier);

                $this->entityManager->persist($besoinChantier);
            }

            foreach ($data['affectations'] as $affectationData) {
                $employe = $this->entityManager->getRepository(Employe::class)->find($affectationData['id']);
                if ($employe) {
                    $affectation = new Affectation();
                    $affectation->setEmploye($employe);
                    $affectation->setChantier($chantier);
                    $affectation->setDate(new \DateTimeImmutable());
                    $affectation->setStatus("En cours");

                    $this->entityManager->persist($affectation);
                }
            }

            $this->entityManager->flush();
            $this->entityManager->getConnection()->commit();

            return new JsonResponse(["message" => "Chantier et données associés sauvegardés avec succès!"]);
        } catch (\Exception $e) {
            $this->entityManager->getConnection()->rollBack();
            return new JsonResponse(["error" => "Une erreur est survenue : " . $e->getMessage()], 500);
        }
    }

    #[Route('/api/employe/{id}/chantiers', name: 'api_employe_chantiers', methods: ['GET'])]
    public function getChantiersByEmploye($id): JsonResponse
    {
       
        $employe = $this->entityManager->getRepository(Employe::class)->find($id);

        if (!$employe) {
            return new JsonResponse(['error' => 'Employé non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

       
        $affectations = $this->entityManager->getRepository(Affectation::class)->findBy(['employe' => $employe]);

        if (empty($affectations)) {
            return new JsonResponse(['message' => 'Aucune affectation trouvée pour cet employé'], JsonResponse::HTTP_OK);
        }

      
        $chantiers = [];
        foreach ($affectations as $affectation) {
            $chantier = $affectation->getChantier();
            $chantiers[] = [
                'id' => $chantier->getId(),
                'nom' => $chantier->getNom(),
                'lieu' => $chantier->getLieu(),
                'date_debut' => $chantier->getDateDebut()->format('Y-m-d'),
                'date_fin' => $chantier->getDateFin()->format('Y-m-d'),
                'statut' => $chantier->getStatut(),
                'affectation_status' => $affectation->getStatus(),
            ];
        }

        return new JsonResponse($chantiers, JsonResponse::HTTP_OK);
    }
}
