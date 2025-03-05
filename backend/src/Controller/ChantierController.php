<?php

namespace App\Controller;

<<<<<<< HEAD
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
=======
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
    #[Route('/api/admin/chantier/submit', name: 'api_admin_chantier_submit', methods: ['POST'])]
    public function submitChantier(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(["error" => "Invalid JSON data"], 400);
        }

        $entityManager->getConnection()->beginTransaction();
        try {
            $chantier = new Chantier();
            $chantier->setNom($data['nom']);
            $chantier->setLieu($data['lieu']);
            
            $dateDebut = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dateDebut']);
            $dateFin = \DateTimeImmutable::createFromFormat('Y-m-d', $data['dateFin']);
            
            $chantier->setDateDebut($dateDebut);
            $chantier->setDateFin($dateFin);
            $chantier->setStatut($data['statut']);

            $entityManager->persist($chantier);
            $entityManager->flush();

            foreach ($data['besoinChantier'] as $besoinData) {
                $besoinChantier = new BesoinChantier();
                $specialite = $entityManager->getRepository(Specialite::class)->findOneBy(['nom' => $besoinData['speciality']]);
                $besoinChantier->setSpecialite($specialite);
                $besoinChantier->setNombre($besoinData['number']);
                $besoinChantier->setChantier($chantier);

                $entityManager->persist($besoinChantier);
            }

            foreach ($data['affectations'] as $affectationData) {
                $employe = $entityManager->getRepository(Employe::class)->find($affectationData['id']);
                if ($employe) {
                    $affectation = new Affectation();
                    $affectation->setEmploye($employe);
                    $affectation->setChantier($chantier);
                    $affectation->setDate(new \DateTimeImmutable());
                    $affectation->setStatus("En cours");

                    $entityManager->persist($affectation);
                }
            }

            $entityManager->flush();
            $entityManager->getConnection()->commit();

            return new JsonResponse(["message" => "Chantier et données associés sauvegardés avec succès!"]);
        } catch (\Exception $e) {
            $entityManager->getConnection()->rollBack();
            return new JsonResponse(["error" => "Une erreur est survenue : " . $e->getMessage()], 500);
        }
    }
}
>>>>>>> 0a7de7559c794330fb2dfe42e4910fee5f988060
