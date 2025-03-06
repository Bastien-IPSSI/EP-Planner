<?php

namespace App\DataFixtures;

use App\Entity\Employe;
use App\Entity\Specialite;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new User();
        $admin->setNom('Admin')
              ->setPrenom('Super')
              ->setMail('admin@exemple.com')
              ->setRole('ROLE_ADMIN');
        
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'azerty');
        $admin->setPassword($hashedPassword);

        $manager->persist($admin);


        $specialiteMaconnerie = $manager
        ->getRepository(Specialite::class)
        ->findOneBy(['nom' => 'Maçonnerie']);

        $user1 = new User();
        $user1->setNom('Dupont')
              ->setPrenom('Jean')
              ->setMail('jean.dupont@exemple.com')
              ->setRole('ROLE_USER');

        $hashedPassword1 = $this->passwordHasher->hashPassword($user1, 'azerty');
        $user1->setPassword($hashedPassword1);
        
        $employe1 = new Employe();
        $employe1->setDispo(true);
        $employe1->setSkills(['Cablage électrique', 'Sécurité électrique' ]);
        $employe1->setSpecialite($specialiteMaconnerie);
        
        $employe1->setUser($user1);
        $user1->setEmploye($employe1);
        
        $manager->persist($user1);
        $manager->persist($employe1);


        $specialitePlomberie = $manager
        ->getRepository(Specialite::class)
        ->findOneBy(['nom' => 'Plomberie']);

        $user2 = new User();
        $user2->setNom('Martin')
              ->setPrenom('Sophie')
              ->setMail('sophie.martin@exemple.com')
              ->setRole('ROLE_USER');

        $hashedPassword2 = $this->passwordHasher->hashPassword($user2, 'azerty');
        $user2->setPassword($hashedPassword2);

        $employe2 = new Employe();
        $employe2->setDispo(true);
        $employe2->setSkills(['Coffrage béton', 'Pose de briques']);
        $employe2->setSpecialite($specialitePlomberie);

        
        $employe2->setUser($user2);
        $user2->setEmploye($employe2);

        $manager->persist($user2);
        $manager->persist($employe2);

        $manager->flush();
    }
}
