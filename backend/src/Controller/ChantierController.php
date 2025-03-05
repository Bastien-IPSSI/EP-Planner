<?php

namespace App\Controller;

use App\Entity\Employe;
use App\Entity\Affectation;
use App\Repository\ChantierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ChantierController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/employe/{id}/chantiers', name: 'api_employe_chantiers', methods: ['GET'])]
    public function getChantiersByEmploye($id): JsonResponse
    {
        // Récupérer l'employé par son ID
        $employe = $this->entityManager->getRepository(Employe::class)->find($id);

        if (!$employe) {
            return new JsonResponse(['error' => 'Employé non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupérer les affectations de l'employé
        $affectations = $this->entityManager->getRepository(Affectation::class)->findBy(['employe' => $employe]);

        if (empty($affectations)) {
            return new JsonResponse(['message' => 'Aucune affectation trouvée pour cet employé'], JsonResponse::HTTP_OK);
        }

        // Récupérer les chantiers associés aux affectations
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