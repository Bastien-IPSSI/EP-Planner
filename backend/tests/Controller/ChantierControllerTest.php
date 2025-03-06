<?php

namespace App\Tests\Controller;

use App\Controller\ChantierController;
use App\Entity\Employe;
use App\Entity\Specialite;
use App\Entity\BesoinChantier;
use App\Entity\Affectation;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ChantierControllerTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private EntityRepository $specialiteRepo;
    private EntityRepository $employeRepo;
    private EntityRepository $besoinChantierRepo;
    private EntityRepository $affectationRepo;
    private ChantierController $controller;

    protected function setUp(): void
    {
        // Mock de l'EntityManager et des repositories
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->specialiteRepo = $this->createMock(EntityRepository::class);
        $this->employeRepo = $this->createMock(EntityRepository::class);
        $this->besoinChantierRepo = $this->createMock(EntityRepository::class);
        $this->affectationRepo = $this->createMock(EntityRepository::class);

        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [Specialite::class, $this->specialiteRepo],
                [Employe::class, $this->employeRepo],
                [BesoinChantier::class, $this->besoinChantierRepo],
                [Affectation::class, $this->affectationRepo]
            ]);

        $this->controller = new ChantierController();
    }

    /**
     * @covers \App\Controller\ChantierController::submitChantier
     */
    public function testSubmitChantierSuccess()
    {
        $connection = $this->createMock(\Doctrine\DBAL\Connection::class);
        $this->entityManager->method('getConnection')->willReturn($connection);
        $connection->expects($this->once())->method('beginTransaction');
        $connection->expects($this->once())->method('commit');

        $specialite = new Specialite();
        $employe = new Employe();

        $this->specialiteRepo->method('findOneBy')->willReturn($specialite);
        $this->employeRepo->method('find')->willReturn($employe);

        // JSON de requête simulé
        $requestData = [
            'nom' => 'Chantier Test',
            'lieu' => 'Paris',
            'dateDebut' => '2025-03-10',
            'dateFin' => '2025-06-10',
            'statut' => 'En cours',
            'besoinChantier' => [
                ['specialite' => 'Maçon', 'nombre' => 3]
            ],
            'affectations' => [
                ['id' => 1]
            ]
        ];

        $request = new Request([], [], [], [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestData));

        $response = $this->controller->submitChantier($this->entityManager, $request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString("Chantier et donnees associes sauvegardes avec succes", $response->getContent());
    }

    /**
     * @covers \App\Controller\ChantierController::submitChantier
     */
    public function testSubmitChantierDatabaseException()
    {
        $connection = $this->createMock(\Doctrine\DBAL\Connection::class);
        $this->entityManager->method('getConnection')->willReturn($connection);
        $connection->method('beginTransaction');
        $connection->expects($this->once())->method('rollBack');

        // Simuler une exception lors du flush()
        $this->entityManager->method('flush')->willThrowException(new \Exception("Database error"));

        $requestData = [
            'nom' => 'Chantier Test',
            'lieu' => 'Paris',
            'dateDebut' => '2025-03-10',
            'dateFin' => '2025-06-10',
            'statut' => 'En cours',
            'besoinChantier' => [],
            'affectations' => []
        ];

        $request = new Request([], [], [], [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestData));

        $response = $this->controller->submitChantier($this->entityManager, $request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertStringContainsString("Une erreur est survenue", $response->getContent());
    }

    /**
     * @covers \App\Controller\ChantierController::getBesoins
     */
    public function testGetBesoinsReturnsJsonResponse()
    {
        // ID du chantier fictif
        $chantierId = 1;

        // Mock des besoins du chantier
        $specialite = $this->createMock(Specialite::class);
        $specialite->method('getNom')->willReturn('Maçon');

        $besoin = $this->createMock(BesoinChantier::class);
        $besoin->method('getId')->willReturn(10);
        $besoin->method('getSpecialite')->willReturn($specialite);
        $besoin->method('getNombre')->willReturn(3);

        $this->besoinChantierRepo->method('findBy')->willReturn([$besoin]);
        $this->affectationRepo->method('findBy')->willReturn([]);

        $request = new Request([], [], ['id' => $chantierId]);

        $response = $this->controller->getBesoins($this->entityManager, $request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $responseData = json_decode($response->getContent(), true);

        $this->assertCount(1, $responseData);
        $this->assertEquals(10, $responseData[0]['id']);
        $this->assertEquals('Maçon', $responseData[0]['specialite']);
        $this->assertEquals(3, $responseData[0]['nombre']); // Aucun employé n'est affecté donc il reste 3 besoins
    }
}
