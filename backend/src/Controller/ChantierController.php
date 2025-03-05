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
        $affectations = $em->getRepository(Affectation::class)
            ->createQueryBuilder('a')
            ->leftJoin('a.chantier', 'c')
            ->addSelect('c')
            ->where('a.employe = :employe_id')
            ->setParameter('employe_id', $id)
            ->getQuery()
            ->getResult();

        if (empty($affectations)) {
            return new JsonResponse(['message' => 'Aucun chantier trouvé pour cet employé.'], JsonResponse::HTTP_OK);
        }

        $chantierData = array_map(function ($affectation) {
            $chantier = $affectation->getChantier();
            return [
                'id' => $chantier->getId(),
                'nom' => $chantier->getNom(),
                'lieu' => $chantier->getLieu(),
                'date_debut' => $chantier->getDateDebut()->format('Y-m-d'),
                'date_fin' => $chantier->getDateFin()->format('Y-m-d'),
                'statut' => $chantier->getStatut(),
            ];
        }, $affectations);

        return new JsonResponse($chantierData, JsonResponse::HTTP_OK);
    }
}
