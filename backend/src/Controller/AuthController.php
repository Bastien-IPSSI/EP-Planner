<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\UserRepository;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $user = $userRepository->findOneBy(['mail' => $email]);


        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Identifiants incorrects'], 401);
        }

        $session = $request->getSession();
        $session->set('user_id', $user->getId());

        return $this->json(["user" => [
                'id' => $user->getId(),
                'employe_id' => $user->getEmploye()->getId(),
                'mail' => $user->getMail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'role' => $user->getRole()
            ]
        ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $session->remove('user_id');

        return $this->json(['message' => 'Déconnexion réussie']);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(Request $request, UserRepository $userRepository): JsonResponse
    {
        $session = $request->getSession();
        $userId = $session->get('user_id');

        if (!$userId) {
            return $this->json(null, 401);
        }

        $user = $userRepository->find($userId);
        return $this->json(["user" => [
            'id' => $user->getId(),
            'employe_id' => $user->getEmploye()->getId(), 
            'mail' => $user->getMail(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'role' => $user->getRole()
        ]
    ]);
    }

}
