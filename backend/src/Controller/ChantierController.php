<?php

namespace App\Controller;

use App\Entity\Employe;
use App\Repository\ChantierRepository;
use Doctrine\ORM\EntityManagerInterface; // Ajout de l'import pour EntityManagerInterface
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class ChantierController extends AbstractController
{
    private $entityManager;

    // Injection de EntityManagerInterface dans le constructeur
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getChantiersByEmploye($id, ChantierRepository $chantierRepository): JsonResponse
    {
        // Récupérer l'employé par son ID
        $employe = $this->entityManager->getRepository(Employe::class)->find($id);

        // Si l'employé n'existe pas, on retourne une erreur
        if (!$employe) {
            return new JsonResponse(['error' => 'Employé non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupérer les chantiers associés à l'employé
        $chantiers = $chantierRepository->findBy(['employe' => $id]);

        // Si aucun chantier n'est trouvé, on retourne un message vide
        if (empty($chantiers)) {
            return new JsonResponse(['message' => 'Aucun chantier trouvé pour cet employé'], JsonResponse::HTTP_OK);
        }

        // Retourner les chantiers au format JSON
        return $this->json($chantiers);
    }
}
