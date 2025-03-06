<?php

namespace App\Controller;

use App\Entity\Employe;
use App\Entity\Specialite;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;


final class EmployeController extends AbstractController
{
    #[Route('api/admin/employes/create', name: 'create_employe',  methods: ["POST"])]
    public function createEmploye(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        dump($data);
        if ($data === null) {
            return new Response('Invalid JSON', 400);
        }

        $user = new User();
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setMail($data['mail']);
        $user->setMdp($data['mdp']);
        $user->setRole($data['role']);

        $employe = new Employe();
        $employe->setDispo(true);
        $employe->setSkills($data['skills']);
        $employe->setUser($user);
        $entityManager->persist($employe);

        $user->setEmploye($employe);
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'success',
            'data reçu: ' => $data
        ]);
    }

    #[Route('/api/admin/employes', name: 'api_admin_employes', methods: ['GET'])]
    public function getAllemployeWithUsers(EntityManagerInterface $entityManager): JsonResponse
    {
    
        $employe = $entityManager->getRepository(Employe::class)->findAll();

        $data = array_map(function (Employe $employe) {
            return [
                'id' => $employe->getId(),
                'nom' => $employe->getUser() ? $employe->getUser()->getNom() : null,
                'prenom' => $employe->getUser() ? $employe->getUser()->getPrenom() : null,
                'mail' => $employe->getUser() ? $employe->getUser()->getMail() : null,
                'role' => $employe->getUser() ? $employe->getUser()->getRole() : null,
                'specialite' => $employe->getSpecialite() ? $employe->getSpecialite()->getNom() : null,
            ];
        }, $employe);
        dump($employe);
        return new JsonResponse($data);
    }

    #[Route('/api/admin/employes/{id}', name: 'api_admin_employe_show', methods: ['GET'])]
    public function showEmploye(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $employe = $entityManager->getRepository(Employe::class)->find($request->get('id'));
        if ($employe === null) {
            return new JsonResponse(["error" => "Employe not found"], 404);
        }


        $data = [
            'id' => $employe->getId(),
            'nom' => $employe->getUser() ? $employe->getUser()->getNom() : null,
            'prenom' => $employe->getUser() ? $employe->getUser()->getPrenom() : null,
            'mail' => $employe->getUser() ? $employe->getUser()->getMail() : null,
            'role' => $employe->getUser() ? $employe->getUser()->getRole() : null,
            'specialite' => $employe->getSpecialite() ? $employe->getSpecialite()->getNom() : null,
            'skills' => $employe->getSkills() ? $employe->getSkills() : null
        ];

        return new JsonResponse($data);
    }

    #[Route('/api/admin/employes/{id}', name: 'api_admin_employes_update', methods: ['PUT'])]
    public function updateEmploye(EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if ($data === null) {
            return new JsonResponse(["error" => "Invalid JSON data"], 400);
        }

        $employe = $entityManager->getRepository(Employe::class)->find($id);
        
        if ($employe === null) {
            return new JsonResponse(["error" => "Employé non trouvé"], 404);
        }

        $user = $employe->getUser();
        if ($user) {
            $user->setNom($data['nom'] ?? $user->getNom());
            $user->setPrenom($data['prenom'] ?? $user->getPrenom());
            $user->setMail($data['mail'] ?? $user->getMail());
            $user->setRole($data['role'] ?? $user->getRole());
        }

        // Mise à jour de la spécialité si elle existe
        if (!empty($data['specialite'])) {
            $specialite = $entityManager->getRepository(Specialite::class)->findOneBy(['nom' => $data['specialite']]);
            if ($specialite) {
                $employe->setSpecialite($specialite);
            } else {
                return new JsonResponse(["error" => "Spécialité non trouvée"], 400);
            }
        }

        // Mise à jour des compétences (array)
        if (isset($data['skills']) && is_array($data['skills'])) {
            $employe->setSkills($data['skills']);
        }

        $entityManager->persist($user);
        $entityManager->persist($employe);
        $entityManager->flush();

        return new JsonResponse([
            "message" => "Employé mis à jour avec succès!",
            "employe" => $employe,
            "data" =>$data
        ]);
    }


    #[Route('/api/admin/employes/{id}', name: 'delete_employe', methods: ['DELETE'])]
    public function deleteEmploye(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
    
        $employe = $entityManager->getRepository(Employe::class)->find($id);

        if (!$employe) {
            return new Response('Employe not found', 404);
        }
        
        $entityManager->remove($employe);
        $entityManager->flush();

        dump($employe);
        return new JsonResponse('Employe and associated User deleted', 200);
    }
}
