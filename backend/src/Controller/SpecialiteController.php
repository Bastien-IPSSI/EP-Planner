<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Specialite;
use Doctrine\ORM\EntityManagerInterface;

final class SpecialiteController extends AbstractController
{
    #[Route('/api/specialities', name: 'api_specialities', methods: ['GET'])]
    public function getAllSpecialities(EntityManagerInterface $entityManager): JsonResponse
    {
        $specialities = $entityManager->getRepository(Specialite::class)->findAll();

        $specialityNames = array_map(fn(Specialite $specialite) => $specialite->getNom(), $specialities);

        return new JsonResponse($specialityNames);
    }
}
