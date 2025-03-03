<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TestController extends AbstractController
{
    #[Route('/api/controller-name', name: 'api_controller_name', methods: ['GET'])]
    public function getControllerName(): JsonResponse
    {
        return new JsonResponse(
            ['controller_name' => 'TestController'],
            200,
            ['Content-Type' => 'application/json']
        );
        
    }
}
