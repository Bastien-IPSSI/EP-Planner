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
        
        
        if (!$data) {
            return new JsonResponse(['message' => 'Bad JSON format'], Response::HTTP_BAD_REQUEST);
        }

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['message' => 'Email et mot de passe sont requis'], Response::HTTP_BAD_REQUEST);
        }

        // Récupération de l'utilisateur dans la base de données
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
        }


        $key = $_ENV['JWT_SECRET_KEY']; 

        // Créer la charge utile pour le JWT
        $payload = [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Expire dans 1 heure
        ];

        try {
          
            $jwt = JWT::encode($payload, $key, 'HS256');
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la génération du token', 'error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

 
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
