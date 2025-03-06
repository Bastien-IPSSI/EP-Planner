<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    private ?string $mail = null;

    #[ORM\Column(length: 255)]
    private ?string $mdp = null; // Cette propriété sera utilisée pour le mot de passe

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    #[ORM\OneToOne(mappedBy: "user", cascade: ['persist', 'remove'], orphanRemoval: true)]
    private ?Employe $employe = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(string $mail): static
    {
        $this->mail = $mail;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->mdp; // Renvoie le mot de passe
    }

    public function setPassword(string $mdp): static
    {
        $this->mdp = $mdp;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getEmploye(): ?Employe
    {
        return $this->employe;
    }

    public function setEmploye(?Employe $employe): static
    {
        $this->employe = $employe;

        return $this;
    }

    // Implémentation des méthodes de UserInterface
    public function getRoles(): array
    {
        // Ajoute ici les rôles comme par exemple ['ROLE_USER', 'ROLE_ADMIN'] 
        // selon la structure de ton application
        return [$this->role ?? 'ROLE_USER']; // Par défaut, retourne "ROLE_USER"
    }

    public function eraseCredentials(): void
    {
        // Si tu stockes des informations sensibles, tu peux les effacer ici
    }

    public function getUserIdentifier(): string
    {
        return $this->mail; // Utilise le mail comme identifiant unique
    }
}
