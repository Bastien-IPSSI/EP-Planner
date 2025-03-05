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
    #[Route('/api/admin/chantier', name: 'api_admin_chantier', methods: ['GET'])]
    public function getChantier(EntityManagerInterface $entityManager): JsonResponse
    {
        $chantiers = $entityManager->getRepository(Chantier::class)->findAll();
        $data = [];
        foreach ($chantiers as $chantier) {
            $data[] = [
                'id' => $chantier->getId(),
                'nom' => $chantier->getNom(),
                'lieu' => $chantier->getLieu(),
                'dateDebut' => $chantier->getDateDebut()->format('Y-m-d'),
                'dateFin' => $chantier->getDateFin()->format('Y-m-d'),
                'statut' => $chantier->getStatut(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/admin/chantier/{id}', name: 'api_admin_chantier_show', methods: ['GET'])]
    public function showChantier(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $chantier = $entityManager->getRepository(Chantier::class)->find($request->get('id'));
        if ($chantier === null) {
            return new JsonResponse(["error" => "Chantier not found"], 404);
        }

        $besoins = $entityManager->getRepository(BesoinChantier::class)->findBy(['chantier' => $chantier]);
        $affectations = $entityManager->getRepository(Affectation::class)->findBy(['chantier' => $chantier]);

        $data = [
            'id' => $chantier->getId(),
            'nom' => $chantier->getNom(),
            'lieu' => $chantier->getLieu(),
            'dateDebut' => $chantier->getDateDebut()->format('Y-m-d'),
            'dateFin' => $chantier->getDateFin()->format('Y-m-d'),
            'statut' => $chantier->getStatut(),
        ];

        foreach ($besoins as $besoin) {
            $data['besoins'][] = [
                'id' => $besoin->getId(),
                'nombre' => $besoin->getNombre(),
                'specialite' => $besoin->getSpecialite()->getNom(),
            ];
        }

        foreach ($affectations as $affectation) {
            $data['affectations'][] = [
                'id' => $affectation->getId(),
                'employe' => $affectation->getEmploye()->getUser()->getNom() . ' ' . $affectation->getEmploye()->getUser()->getPrenom(),
                'specialite' => $affectation->getEmploye()->getSpecialite()->getNom(),
                'statut' => $affectation->getStatus(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/admin/chantier/{id}/besoins', name: 'api_admin_chantier_besoins', methods: ['GET'])]
    // Get all besoins for the chantier with id
    public function getBesoins(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $besoins = $entityManager->getRepository(BesoinChantier::class)->findBy(['chantier' => $request->get('id')]);
        $affectation = $entityManager->getRepository(Affectation::class)->findBy(['chantier' => $request->get('id')]);

        $data = [];

        foreach ($besoins as $besoin) {
            $isAffected = false;
            $nbNeed = $besoin->getNombre();
            foreach ($affectation as $affectation) {
                if($affectation->getEmploye()->getSpecialite()->getNom() == $besoin->getSpecialite()->getNom()) {
                    $nbNeed -= 1;
                    if($nbNeed == 0) {
                        $isAffected = true;
                    }
                }
            }

            if (!$isAffected) {
                $data[] = [
                    'id' => $besoin->getId(),
                    'specialite' => $besoin->getSpecialite()->getNom(),
                    'nombre' => $nbNeed,
                ];
            }
        }

        return new JsonResponse($data);
    }


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