<?php

namespace App\Entity;

use App\Repository\ChantierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ChantierRepository::class)]
class Chantier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $date_debut = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $date_fin = null;

    #[ORM\Column(length: 255)]
    private ?string $statut = null;

    /**
     * @var Collection<int, Affectation>
     */
    #[ORM\OneToMany(targetEntity: Affectation::class, mappedBy: 'chantier')]
    private Collection $affectations;

    /**
     * @var Collection<int, BesoinChantier>
     */
    #[ORM\OneToMany(targetEntity: BesoinChantier::class, mappedBy: 'chantier')]
    private Collection $besoin_chantier;

    public function __construct()
    {
        $this->affectations = new ArrayCollection();
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

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getDateDebut(): ?\DateTimeImmutable
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTimeImmutable $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeImmutable
    {
        return $this->date_fin;
    }

    public function setDateFin(\DateTimeImmutable $date_fin): static
    {
        $this->date_fin = $date_fin;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    /**
     * @return Collection<int, Affectation>
     */
    public function getAffectations(): Collection
    {
        return $this->affectations;
    }

    public function addAffectation(Affectation $affectation): static
    {
        if (!$this->affectations->contains($affectation)) {
            $this->affectations->add($affectation);
            $affectation->setChantier($this);
        }

        return $this;
    }

    public function removeAffectation(Affectation $affectation): static
    {
        if ($this->affectations->removeElement($affectation)) {
            // set the owning side to null (unless already changed)
            if ($affectation->getChantier() === $this) {
                $affectation->setChantier(null);
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
            $besoinChantier->setChantier($this);
        }

        return $this;
    }

    public function removeBesoinChantier(BesoinChantier $besoinChantier): static
    {
        if ($this->besoin_chantier->removeElement($besoinChantier)) {
            // set the owning side to null (unless already changed)
            if ($besoinChantier->getChantier() === $this) {
                $besoinChantier->setChantier(null);
            }
        }

        return $this;
    }
}
