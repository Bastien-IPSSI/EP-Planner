<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250303155554 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE affectation (id INT AUTO_INCREMENT NOT NULL, employe_id INT DEFAULT NULL, chantier_id INT DEFAULT NULL, date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', status VARCHAR(255) NOT NULL, INDEX IDX_F4DD61D31B65292 (employe_id), INDEX IDX_F4DD61D3D0C0049D (chantier_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE besoin_chantier (id INT AUTO_INCREMENT NOT NULL, specialite_id INT DEFAULT NULL, chantier_id INT DEFAULT NULL, nombre INT NOT NULL, INDEX IDX_27FC1FA42195E0F0 (specialite_id), INDEX IDX_27FC1FA4D0C0049D (chantier_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE chantier (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, lieu VARCHAR(255) NOT NULL, date_debut DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', date_fin DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', statut VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE employe (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, specialite_id INT DEFAULT NULL, dispo TINYINT(1) NOT NULL, skills LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:array)\', UNIQUE INDEX UNIQ_F804D3B9A76ED395 (user_id), INDEX IDX_F804D3B92195E0F0 (specialite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE specialite (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, employe_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, mail VARCHAR(255) NOT NULL, mdp VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D6491B65292 (employe_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE affectation ADD CONSTRAINT FK_F4DD61D31B65292 FOREIGN KEY (employe_id) REFERENCES employe (id)');
        $this->addSql('ALTER TABLE affectation ADD CONSTRAINT FK_F4DD61D3D0C0049D FOREIGN KEY (chantier_id) REFERENCES chantier (id)');
        $this->addSql('ALTER TABLE besoin_chantier ADD CONSTRAINT FK_27FC1FA42195E0F0 FOREIGN KEY (specialite_id) REFERENCES specialite (id)');
        $this->addSql('ALTER TABLE besoin_chantier ADD CONSTRAINT FK_27FC1FA4D0C0049D FOREIGN KEY (chantier_id) REFERENCES chantier (id)');
        $this->addSql('ALTER TABLE employe ADD CONSTRAINT FK_F804D3B9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE employe ADD CONSTRAINT FK_F804D3B92195E0F0 FOREIGN KEY (specialite_id) REFERENCES specialite (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6491B65292 FOREIGN KEY (employe_id) REFERENCES employe (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE affectation DROP FOREIGN KEY FK_F4DD61D31B65292');
        $this->addSql('ALTER TABLE affectation DROP FOREIGN KEY FK_F4DD61D3D0C0049D');
        $this->addSql('ALTER TABLE besoin_chantier DROP FOREIGN KEY FK_27FC1FA42195E0F0');
        $this->addSql('ALTER TABLE besoin_chantier DROP FOREIGN KEY FK_27FC1FA4D0C0049D');
        $this->addSql('ALTER TABLE employe DROP FOREIGN KEY FK_F804D3B9A76ED395');
        $this->addSql('ALTER TABLE employe DROP FOREIGN KEY FK_F804D3B92195E0F0');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6491B65292');
        $this->addSql('DROP TABLE affectation');
        $this->addSql('DROP TABLE besoin_chantier');
        $this->addSql('DROP TABLE chantier');
        $this->addSql('DROP TABLE employe');
        $this->addSql('DROP TABLE specialite');
        $this->addSql('DROP TABLE user');
    }
}
