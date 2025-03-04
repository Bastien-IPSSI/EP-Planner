<?php

namespace App\Controller;
// App\Controller\SecurityController.php
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
        // Extraction des données JSON de la requête
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['message' => 'Bad JSON format'], Response::HTTP_BAD_REQUEST);
        }

        // Récupération de l'email et du mot de passe
        $mail = $data['mail'] ?? null; 
        $mdp = $data['mdp'] ?? null;

        if (!$mail || !$mdp) {
            return new JsonResponse(['message' => 'Email et mot de passe sont requis'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer l'utilisateur en fonction de l'email
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['mail' => $mail]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $mdp)) {
            return new JsonResponse(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
        }

        // Clé secrète pour signer le JWT (assurez-vous que c'est sécurisé et stocké dans .env)
        $key = $_ENV['JWT_SECRET_KEY'];

        // Générer la charge utile pour le JWT
        $payload = [
            'mail' => $user->getMail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Expire dans 1 heure
        ];

        try {
            $jwt = JWT::encode($payload, $key, 'HS256');
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la génération du token', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Créer le cookie contenant le JWT
        $cookie = new Cookie(
            'auth_token',    // Nom du cookie
            $jwt,            // Contenu du JWT
            time() + 3600,   // Expiration dans 1 heure
            '/',             // Domaine pour lequel le cookie est valide
            null,            // Domaine (null pour utiliser par défaut)
            true,            // Secure : cookie transmis uniquement via HTTPS
            true,            // HttpOnly : empêche l'accès via JavaScript
            false            // SameSite
        );

        // Créer la réponse avec le cookie
        $response = new JsonResponse([
            'message' => 'Login successful',
            'token' => $jwt,  // Retourner aussi le token JWT pour usage futur côté client
            'roles' => $user->getRoles(),
        ]);

        // Ajouter le cookie au header de la réponse
        $response->headers->setCookie($cookie);
        return $response;
    }

    #[Route('/api/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Supprimer le cookie JWT lors de la déconnexion
        $cookie = new Cookie('auth_token', '', time() - 3600, '/');
        $response = new JsonResponse(['message' => 'Logout successful']);
        $response->headers->setCookie($cookie);  // Expirer le cookie
        return $response;
    }
}
