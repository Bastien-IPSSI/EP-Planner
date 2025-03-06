<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Routing\RouterInterface;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthControllerTest extends WebTestCase
{
    public function testLoginSuccess()
    {
        $client = static::createClient();

        // Mock user repository and password hasher
        $userRepository = $this->createMock(UserRepository::class);
        $passwordHasher = $this->createMock(UserPasswordHasherInterface::class);

        $user = $this->createMock(\App\Entity\User::class);
        $user->method('getId')->willReturn(1);
        $user->method('getMail')->willReturn('test@example.com');
        $user->method('getNom')->willReturn('Test');
        $user->method('getPrenom')->willReturn('User');
        $user->method('getRole')->willReturn('ROLE_USER');

        $userRepository->method('findOneBy')->willReturn($user);
        $passwordHasher->method('isPasswordValid')->willReturn(true);

        // Simulate the POST request with valid data
        $client->request('POST', '/api/login', [], [], [], json_encode([
            'email' => 'test@example.com',
            'password' => 'validPassword'
        ]));

        // Check for successful response
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains(['user' => ['mail' => 'test@example.com']]);
    }

    public function testLoginFailureInvalidCredentials()
    {
        $client = static::createClient();

        // Mock user repository and password hasher
        $userRepository = $this->createMock(UserRepository::class);
        $passwordHasher = $this->createMock(UserPasswordHasherInterface::class);

        $userRepository->method('findOneBy')->willReturn(null);

        // Simulate the POST request with invalid data
        $client->request('POST', '/api/login', [], [], [], json_encode([
            'email' => 'invalid@example.com',
            'password' => 'wrongPassword'
        ]));

        // Check for error response
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains(['message' => 'Identifiants incorrects']);
    }

    public function testLogout()
    {
        $client = static::createClient();

        // Simulate login by setting a session user ID
        $client->getContainer()->get('session')->set('user_id', 1);

        // Simulate the POST request to logout
        $client->request('POST', '/api/logout');

        // Check for success response
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains(['message' => 'Déconnexion réussie']);
    }

    public function testMeSuccess()
    {
        $client = static::createClient();

        // Mock user repository
        $userRepository = $this->createMock(UserRepository::class);
        $user = $this->createMock(\App\Entity\User::class);
        $user->method('getId')->willReturn(1);
        $user->method('getMail')->willReturn('test@example.com');
        $user->method('getNom')->willReturn('Test');
        $user->method('getPrenom')->willReturn('User');
        $user->method('getRole')->willReturn('ROLE_USER');

        $userRepository->method('find')->willReturn($user);

        // Simulate the session user ID and GET request to /api/me
        $client->getContainer()->get('session')->set('user_id', 1);
        $client->request('GET', '/api/me');

        // Check for success response
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains(['user' => ['mail' => 'test@example.com']]);
    }

    public function testMeFailureUnauthorized()
    {
        $client = static::createClient();

        // Simulate the absence of a session user ID
        $client->getContainer()->get('session')->remove('user_id');

        // Simulate the GET request to /api/me
        $client->request('GET', '/api/me');

        // Check for unauthorized response
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        $this->assertJsonContains([null]);
    }
}
