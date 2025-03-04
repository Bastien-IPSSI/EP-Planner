<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class LoginFormAuthenticator extends AbstractAuthenticator
{
    private UrlGeneratorInterface $urlGenerator;
    private UserProviderInterface $userProvider;

    public function __construct(UrlGeneratorInterface $urlGenerator, UserProviderInterface $userProvider)
    {
        $this->urlGenerator = $urlGenerator;
        $this->userProvider = $userProvider;
    }

    // Vérifie que la requête est une requête POST pour /login
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login' && $request->isMethod('POST');
    }

    // Authentifie l'utilisateur en vérifiant les identifiants
    public function authenticate(Request $request): Passport
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            throw new AuthenticationException('Email ou mot de passe manquant.');
        }

        return new Passport(
            new UserBadge($email, function ($email) {
                return $this->userProvider->loadUserByIdentifier($email);
            }),
            new PasswordCredentials($password)
        );
    }

    // Si l'authentification réussit, on crée un JWT et on le place dans un cookie
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): JsonResponse
    {
        /** @var UserInterface $user */
        $user = $token->getUser();

        // Générer un token JWT
        $key = 'your-secret-key'; // Remplace par une clé sécurisée
        $payload = [
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Expiration du token dans 1 heure
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');

        // Créer le cookie contenant le token
        $cookie = new Cookie(
            'auth_token',
            $jwt,
            time() + 3600,  // Expiration du cookie dans 1 heure
            '/',  // Domaine
            null,  // Utiliser le domaine par défaut
            true,  // Secure (vérifie si l'HTTPS est utilisé)
            true,  // HttpOnly (le cookie ne peut pas être accédé par JavaScript)
            false, // SameSite (Lax est généralement le plus sûr)
            false  // Pas de cryptage supplémentaire
        );

        // Créer la réponse avec le cookie
        return new JsonResponse(['message' => 'Login successful', 'token' => $jwt], Response::HTTP_OK, [
            'Set-Cookie' => $cookie->__toString()
        ]);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }
}
