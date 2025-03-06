<?php

namespace App\DataFixtures;

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

        $user1 = new User();
        $user1->setNom('Dupont')
              ->setPrenom('Jean')
              ->setMail('jean.dupont@exemple.com')
              ->setRole('ROLE_USER');

        $hashedPassword1 = $this->passwordHasher->hashPassword($user1, 'azerty');
        $user1->setPassword($hashedPassword1);

        $manager->persist($user1);

        $user2 = new User();
        $user2->setNom('Martin')
              ->setPrenom('Sophie')
              ->setMail('sophie.martin@exemple.com')
              ->setRole('ROLE_USER');

        $hashedPassword2 = $this->passwordHasher->hashPassword($user2, 'azerty');
        $user2->setPassword($hashedPassword2);

        $manager->persist($user2);

        $manager->flush();
    }
}
