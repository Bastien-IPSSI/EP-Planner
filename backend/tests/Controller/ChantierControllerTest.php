<?php

namespace App\Tests\Controller;

use App\Controller\ChantierController;
use App\Entity\Employe;
use App\Entity\Specialite;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ChantierControllerTest extends TestCase
{
    /**
     * @covers \App\Controller\ChantierController::submitChantier
     */
    public function testSubmitChantierSuccess()
    {
        // Mock de l'EntityManager
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $connection = $this->createMock(\Doctrine\DBAL\Connection::class);

        $entityManager->method('getConnection')->willReturn($connection);
        $connection->expects($this->once())->method('beginTransaction');
        $connection->expects($this->once())->method('commit');

        // Mock des repositories
        $specialiteRepo = $this->createMock(EntityRepository::class);
        $employeRepo = $this->createMock(EntityRepository::class);

        $entityManager->method('getRepository')
            ->willReturnMap([
                [Specialite::class, $specialiteRepo],
                [Employe::class, $employeRepo]
            ]);

        // Création des entités mockées
        $specialite = new Specialite();
        $specialiteRepo->method('findOneBy')->willReturn($specialite);

        $employe = new Employe();
        $employeRepo->method('find')->willReturn($employe);

        // JSON de requête simulé
        $requestData = [
            'nom' => 'Chantier Test',
            'lieu' => 'Paris',
            'dateDebut' => '2025-03-10',
            'dateFin' => '2025-06-10',
            'statut' => 'En cours',
            'besoinChantier' => [
                ['speciality' => 'Charpente', 'number' => 3]
            ],
            'affectations' => [
                ['id' => 1]
            ]
        ];

        $request = new Request([], [], [], [], [], [], json_encode($requestData));

        // Exécution du contrôleur
        $controller = new ChantierController();
        $response = $controller->submitChantier($entityManager, $request);

        // Vérification de la réponse
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString("Chantier et donnees associes sauvegardes avec succes", $response->getContent());
    }

    /**
     * @covers \App\Controller\ChantierController::submitChantier
     */
    public function testSubmitChantierInvalidJson()
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $request = new Request([], [], [], [], [], [], 'INVALID JSON');

        $controller = new ChantierController();
        $response = $controller->submitChantier($entityManager, $request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertStringContainsString("Invalid JSON data", $response->getContent());
    }

    /**
     * @covers \App\Controller\ChantierController::submitChantier
     */
    public function testSubmitChantierDatabaseException()
    {
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $connection = $this->createMock(\Doctrine\DBAL\Connection::class);

        $entityManager->method('getConnection')->willReturn($connection);
        $connection->method('beginTransaction');
        $connection->expects($this->once())->method('rollBack');

        $entityManager->method('flush')->willThrowException(new \Exception("Database error"));

        $requestData = [
            'nom' => 'Chantier Test',
            'lieu' => 'Paris',
            'dateDebut' => '2025-03-10',
            'dateFin' => '2025-06-10',
            'statut' => 'En cours',
            'besoinChantier' => [],
            'affectations' => []
        ];

        $request = new Request([], [], [], [], [], [], json_encode($requestData));

        $controller = new ChantierController();
        $response = $controller->submitChantier($entityManager, $request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertStringContainsString("Une erreur est survenue", $response->getContent());
    }

}
