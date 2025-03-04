<?php

namespace App\Controller;

use App\Entity\Affectation;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

class ChantierController extends AbstractController
{
    /**
     * @Route("/api/employe/{id}/chantiers", methods={"GET"})
     */
    public function getChantiers($id, EntityManagerInterface $em)
    {
        // On récupère toutes les affectations pour cet employé
        $affectations = $em->getRepository(Affectation::class)
            ->createQueryBuilder('a')
            ->leftJoin('a.chantier', 'c') // Joindre la table chantier
            ->addSelect('c')
            ->where('a.employe = :employe_id')
            ->setParameter('employe_id', $id)
            ->getQuery()
            ->getResult();

        if (empty($affectations)) {
            return new JsonResponse(['message' => 'Aucun chantier trouvé pour cet employé.'], JsonResponse::HTTP_OK);
        }

        // On récupère les informations des chantiers
        $chantierData = [];
        foreach ($affectations as $affectation) {
            $chantier = $affectation->getChantier();
            $chantierData[] = [
                'id' => $chantier->getId(),
                'nom' => $chantier->getNom(),
                'description' => $chantier->getDescription(),
            ];
        }

        return new JsonResponse($chantierData, JsonResponse::HTTP_OK);
    }
}
