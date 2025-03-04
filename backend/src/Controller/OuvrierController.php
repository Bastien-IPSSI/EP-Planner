<?php

namespace App\Controller;

use App\Entity\Employe;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;


final class OuvrierController extends AbstractController
{
    #[Route('api/admin/ouvriers', name: 'create_ouvrier',  methods: ["POST"])]
    public function createOuvrier(Request $request, EntityManagerInterface $entityManager): Response
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
}
