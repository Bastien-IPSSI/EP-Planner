<?php

namespace App\Controller;

use App\Entity\User;
use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

class SecurityController extends AbstractController
{
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager;

    public function __construct(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Récupération de l'utilisateur en base de données
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
        }

        // Générer le token JWT
        $key = 'your-secret-key'; // Remplace par une clé sécurisée
        $payload = [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Expire dans 1 heure
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');

        // Créer un cookie avec le token
        $cookie = new Cookie(
            'auth_token',
            $jwt,
            time() + 3600,  // Expiration du cookie dans 1 heure
            '/',
            null,  // Domaine (null pour le domaine par défaut)
            true,  // Secure (vérifie que le cookie est envoyé via HTTPS)
            true,  // HttpOnly (empêche l'accès JavaScript au cookie)
            false, // SameSite (ici, on ne met pas SameSite=None, donc c'est Lax par défaut)
            false  // Pas d'encryptage supplémentaire
        );

        // Créer la réponse avec le cookie
        $response = new JsonResponse([
            'message' => 'Login successful',
            'token' => $jwt,
            'roles' => $user->getRoles(),
        ]);

        $response->headers->setCookie($cookie);
        return $response;
    }

    #[Route('/api/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Supprimer le cookie du token JWT
        $cookie = new Cookie('auth_token', '', time() - 3600, '/');
        $response = new JsonResponse(['message' => 'Logout successful']);
        $response->headers->setCookie($cookie);
        return $response;
    }
}
