<?php

namespace App\Entity;

use App\Repository\EmployeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmployeRepository::class)]
class Employe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $dispo = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]  // Changement de ARRAY à TEXT
    private ?string $skills = null;  // Changement de array à string

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'employes')]
    private ?Specialite $specialite = null;

    /**
     * @var Collection<int, Affectation>
     */
    #[ORM\OneToMany(targetEntity: Affectation::class, mappedBy: 'employe')]
    private Collection $affectation;

    public function __construct()
    {
        $this->affectation = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isDispo(): ?bool
    {
        return $this->dispo;
    }

    public function setDispo(bool $dispo): static
    {
        $this->dispo = $dispo;

        return $this;
    }

    // Modification de la méthode getSkills
    // Désérialisation JSON pour convertir la chaîne en tableau
    public function getSkills(): ?array
    {
        return $this->skills ? json_decode($this->skills, true) : null;  // Désérialisation JSON
    }

    // Modification de la méthode setSkills
    // Sérialisation du tableau en chaîne JSON
    public function setSkills(?array $skills): static
    {
        $this->skills = $skills ? json_encode($skills) : null;  // Sérialisation en JSON
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSpecialite(): ?Specialite
    {
        return $this->specialite;
    }

    public function setSpecialite(?Specialite $specialite): static
    {
        $this->specialite = $specialite;

        return $this;
    }

    /**
     * @return Collection<int, Affectation>
     */
    public function getAffectation(): Collection
    {
        return $this->affectation;
    }

    public function addAffectation(Affectation $affectation): static
    {
        if (!$this->affectation->contains($affectation)) {
            $this->affectation->add($affectation);
            $affectation->setEmploye($this);
        }

        return $this;
    }

    public function removeAffectation(Affectation $affectation): static
    {
        if ($this->affectation->removeElement($affectation)) {
            // set the owning side to null (unless already changed)
            if ($affectation->getEmploye() === $this) {
                $affectation->setEmploye(null);
            }
        }

        return $this;
    }
}
