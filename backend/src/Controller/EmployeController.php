<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Employe;
use Doctrine\ORM\EntityManagerInterface;

final class EmployeController extends AbstractController
{
    #[Route('/api/admin/employes', name: 'api_admin_employes', methods: ['GET'])]
    public function getAllEmployesWithUsers(EntityManagerInterface $entityManager): JsonResponse
    {
    
        $employes = $entityManager->getRepository(Employe::class)->findAll();

        $data = array_map(function (Employe $employe) {
            return [
                'id' => $employe->getId(),
                'specialite' => $employe->getSpecialite() ? $employe->getSpecialite()->getNom() : null,
                'user_name' => $employe->getUser() ? $employe->getUser()->getNom() : null,
                'user_prenom' => $employe->getUser() ? $employe->getUser()->getPrenom() : null,
            ];
        }, $employes);

        return new JsonResponse($data);
    }
}
