<?php

namespace App\DataFixtures;

use App\Entity\Specialite;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SpecialiteFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $specialites = [
            'Maçonnerie',
            'Charpente',
            'Plomberie',
            'Électricité',
            'Couverture',
            'Menuiserie',
            'Peinture',
            'Carrelage',
            'Gros œuvre',
            'Étanchéité',
        ];

        foreach ($specialites as $nom) {
            $specialite = new Specialite();
            $specialite->setNom($nom);
            $manager->persist($specialite);
        }

        $manager->flush();
    }
}
