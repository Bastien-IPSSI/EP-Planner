<?php

namespace App\Entity;

use App\Repository\SpecialiteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SpecialiteRepository::class)]
class Specialite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    /**
     * @var Collection<int, Employe>
     */
    #[ORM\OneToMany(targetEntity: Employe::class, mappedBy: 'specialite')]
    private Collection $employes;

    /**
     * @var Collection<int, BesoinChantier>
     */
    #[ORM\OneToMany(targetEntity: BesoinChantier::class, mappedBy: 'specialite')]
    private Collection $besoin_chantier;

    public function __construct()
    {
        $this->employes = new ArrayCollection();
        $this->besoin_chantier = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Employe>
     */
    public function getEmployes(): Collection
    {
        return $this->employes;
    }

    public function addEmploye(Employe $employe): static
    {
        if (!$this->employes->contains($employe)) {
            $this->employes->add($employe);
            $employe->setSpecialite($this);
        }

        return $this;
    }

    public function removeEmploye(Employe $employe): static
    {
        if ($this->employes->removeElement($employe)) {
            // set the owning side to null (unless already changed)
            if ($employe->getSpecialite() === $this) {
                $employe->setSpecialite(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BesoinChantier>
     */
    public function getBesoinChantier(): Collection
    {
        return $this->besoin_chantier;
    }

    public function addBesoinChantier(BesoinChantier $besoinChantier): static
    {
        if (!$this->besoin_chantier->contains($besoinChantier)) {
            $this->besoin_chantier->add($besoinChantier);
            $besoinChantier->setSpecialite($this);
        }

        return $this;
    }

    public function removeBesoinChantier(BesoinChantier $besoinChantier): static
    {
        if ($this->besoin_chantier->removeElement($besoinChantier)) {
            // set the owning side to null (unless already changed)
            if ($besoinChantier->getSpecialite() === $this) {
                $besoinChantier->setSpecialite(null);
            }
        }

        return $this;
    }
}
