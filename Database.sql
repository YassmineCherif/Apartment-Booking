-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 21, 2025 at 11:39 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fegaac`
--

-- --------------------------------------------------------

--
-- Table structure for table `appartement`
--

DROP TABLE IF EXISTS `appartement`;
CREATE TABLE IF NOT EXISTS `appartement` (
  `id_app` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `id_bloc` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_app`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appartement`
--

INSERT INTO `appartement` (`id_app`, `description`, `id_bloc`, `image`, `titre`) VALUES
(8, '3 éme etage', 2, 'images/app1.png\n', 'D34'),
(9, '2éme etage', 2, 'images/app2.png\n', 'A22'),
(10, '1 ére etage', 3, 'images/app3.png\n', 'C10'),
(11, '3éme etage\n', 3, 'images/app4.png\n', 'C35'),
(12, '1 ére etage', 4, 'images/app5.png\n', 'B15'),
(13, '2 éme etage', 4, 'images/app6.png\n', 'A23'),
(14, '4 éme etage\n ', 4, 'images/app1.png\n', 'A41'),
(15, '1ére etage', 5, 'images/app7.jpg\n', 'E112'),
(16, '4éme etage', 6, 'images/app8.jpg\n', 'F45'),
(17, '5éme etage', 2, 'images/app9.jpg\n', 'A58'),
(19, 'zaza', 2, 'images/app10.jpg', 'zaza'),
(20, 'popo', 4, 'images/app11.jpg', 'popo');

-- --------------------------------------------------------

--
-- Table structure for table `bloc`
--

DROP TABLE IF EXISTS `bloc`;
CREATE TABLE IF NOT EXISTS `bloc` (
  `id_bloc` bigint NOT NULL AUTO_INCREMENT,
  `id_residence` bigint DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `nombre_etages` int NOT NULL,
  PRIMARY KEY (`id_bloc`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bloc`
--

INSERT INTO `bloc` (`id_bloc`, `id_residence`, `nom`, `nombre_etages`) VALUES
(2, 1, 'A', 2),
(3, 1, 'B', 3),
(4, 2, 'C', 6),
(5, 3, 'D', 1),
(6, 4, 'E', 4),
(7, 5, 'F', 5),
(9, 2, 'G', 4);

-- --------------------------------------------------------

--
-- Table structure for table `bloc_appartement`
--

DROP TABLE IF EXISTS `bloc_appartement`;
CREATE TABLE IF NOT EXISTS `bloc_appartement` (
  `bloc_id_bloc` bigint NOT NULL,
  `appartement_id_app` bigint NOT NULL,
  PRIMARY KEY (`bloc_id_bloc`,`appartement_id_app`),
  UNIQUE KEY `UKovgshj9t5l3faei06b83qb5ym` (`appartement_id_app`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE IF NOT EXISTS `conversation` (
  `id_conversation` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id_conversation`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`id_conversation`, `created_at`, `last_message_at`) VALUES
(1, '2025-11-10 09:00:00.000000', '2025-11-10 10:30:00.000000'),
(2, '2025-11-11 14:00:00.000000', '2025-11-11 14:45:00.000000'),
(3, '2025-11-12 16:20:00.000000', '2025-11-16 22:06:33.950875'),
(4, '2025-11-14 22:51:29.074038', '2025-11-21 11:36:05.561653'),
(5, '2025-11-14 22:51:29.644108', '2025-11-16 22:44:33.368175'),
(6, '2025-11-16 23:55:29.901307', '2025-11-21 11:35:55.162261'),
(7, '2025-11-18 11:24:27.711343', '2025-11-18 13:23:31.112357'),
(8, '2025-11-21 11:34:27.998958', '2025-11-21 11:34:27.998958');

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participant`
--

DROP TABLE IF EXISTS `conversation_participant`;
CREATE TABLE IF NOT EXISTS `conversation_participant` (
  `id_conversation` bigint NOT NULL,
  `id_user` bigint NOT NULL,
  PRIMARY KEY (`id_conversation`,`id_user`),
  KEY `FK1fvo45w1xxiyrbwr368uivjvk` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `conversation_participant`
--

INSERT INTO `conversation_participant` (`id_conversation`, `id_user`) VALUES
(4, 1),
(6, 1),
(8, 1),
(7, 5),
(4, 6),
(5, 6),
(7, 6),
(5, 11),
(6, 11),
(8, 12);

-- --------------------------------------------------------

--
-- Table structure for table `fichier`
--

DROP TABLE IF EXISTS `fichier`;
CREATE TABLE IF NOT EXISTS `fichier` (
  `id_fichier` bigint NOT NULL AUTO_INCREMENT,
  `date_creation` datetime(6) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `type_fichier` enum('DOCUMENT','FACTURE','IMAGE') DEFAULT NULL,
  `id_message` bigint DEFAULT NULL,
  `chemin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_fichier`),
  KEY `FK5nwn6fwiif4v10ov4o9e2o5ii` (`id_message`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fichier`
--

INSERT INTO `fichier` (`id_fichier`, `date_creation`, `titre`, `type_fichier`, `id_message`, `chemin`) VALUES
(9, '2025-11-16 22:44:33.348164', '1.webp', 'IMAGE', 16, '58d60b86-5eb3-4a81-a0d0-537c8fd817bb.webp'),
(10, '2025-11-16 23:08:32.070771', 'spilnezlfm0c1.jpg', 'IMAGE', 18, '589d97ec-fe6e-4671-8654-76329da5c569.jpg'),
(11, '2025-11-17 19:06:29.423109', 'istockphoto-1154071970-612x612.jpg', 'IMAGE', 25, 'c5165c39-90de-4586-a39d-7d873bc4ea90.jpg'),
(12, '2025-11-21 11:36:05.544935', 'RH.pdf', 'FACTURE', 49, 'ddd9c4b9-9149-4a3b-a1aa-5c6a043dfde0.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id_message` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `date_creation` datetime(6) DEFAULT NULL,
  `id_conversation` bigint DEFAULT NULL,
  `id_sender` bigint DEFAULT NULL,
  PRIMARY KEY (`id_message`),
  KEY `FKjn8nq3ps4yco0jg19ln0fx47n` (`id_conversation`),
  KEY `FK249t1hnaxlacjng5xtud18fi` (`id_sender`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id_message`, `content`, `date_creation`, `id_conversation`, `id_sender`) VALUES
(1, 'Hello Yassmine, have you seen the latest project update?', '2025-11-10 09:05:00.000000', 1, 5),
(2, 'Yes Khalil, I reviewed it. Looks good!', '2025-11-10 09:15:00.000000', 1, 1),
(3, 'Can we schedule a call tomorrow?', '2025-11-11 14:10:00.000000', 2, 6),
(4, 'Sure, how about 10 AM?', '2025-11-11 14:20:00.000000', 2, 5),
(5, 'I need help with the building access system.', '2025-11-12 16:25:00.000000', 3, 1),
(6, 'I will check it and get back to you shortly.', '2025-11-12 16:45:00.000000', 3, 6),
(15, 'Bonjour Mme Limem, votre facture est prête, je l\'ai mise dans la boîte aux lettres.', '2025-11-16 22:44:29.550394', 5, 6),
(16, NULL, '2025-11-16 22:44:33.354165', 5, 6),
(17, 'Bonjour madame yassmine ', '2025-11-16 23:03:24.330214', 4, 6),
(18, 'J\'ai trouvé cette peluche par terre dans l\'appartement. Est-ce qu\'elle est à vous ?', '2025-11-16 23:08:32.077343', 4, 6),
(19, 'Bonjour ', '2025-11-16 23:54:42.245635', 4, 1),
(20, 'non ', '2025-11-16 23:54:44.126019', 4, 1),
(21, 'Merci pour votre aide.', '2025-11-16 23:55:29.955891', 6, 1),
(22, 'Bonjour', '2025-11-17 17:33:46.335898', 4, 1),
(23, 'Bonsoir madame yassmine ', '2025-11-17 18:08:46.289501', 4, 6),
(24, 'Qui a mis ces ordures ici ? Ça sent tellement mauvais !', '2025-11-17 19:05:34.106105', 4, 1),
(25, NULL, '2025-11-17 19:06:29.429103', 4, 1),
(26, 'Excusez-moi madame, je voudrais vérifier auprès des autres résidents demain matin.', '2025-11-17 19:06:55.722752', 4, 6),
(27, 'Bonjour Mohsen', '2025-11-18 11:24:39.848800', 7, 5),
(28, 'L\'appartement A1 a un problème avec la caméra, veuillez aller vérifier.', '2025-11-18 11:25:38.377840', 7, 5),
(29, 'tout de suite monsieur', '2025-11-18 11:26:16.721818', 7, 6),
(43, 'ok', '2025-11-18 13:19:27.303744', 7, 5),
(45, 'c\'est bon monsieur, c\'est fixé', '2025-11-18 13:23:09.252897', 7, 6),
(46, 'Merci', '2025-11-18 13:23:31.108364', 7, 5),
(47, 'o', '2025-11-21 11:35:55.156756', 6, 1),
(48, 'o', '2025-11-21 11:36:01.652166', 4, 1),
(49, NULL, '2025-11-21 11:36:05.547937', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `pays`
--

DROP TABLE IF EXISTS `pays`;
CREATE TABLE IF NOT EXISTS `pays` (
  `id_country` bigint NOT NULL AUTO_INCREMENT,
  `adress` varchar(255) DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_country`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pays`
--

INSERT INTO `pays` (`id_country`, `adress`, `localisation`, `pays`, `ville`) VALUES
(1, 'Rue Gafsa - ZI M\'GHIRA 3 BEN AROUS', 'a', 'Tunisie', 'Fouchana'),
(2, '9313 39th St,', 'b', 'Etats-Unis', 'Wichita'),
(3, '7, Hala 10 107086 com. Brazi, jud. Prahova,', 'c', 'Roumanie', 'Prahova'),
(4, 'Aéropôle de l’aéroport Mohamed V ', 'd', 'Maroc', 'Nouasseur'),
(6, '1 Rue Touria Chaoui 63510 Aulnat France', 'f', 'France', 'Aéroport de Clermont-Ferrand');

-- --------------------------------------------------------

--
-- Table structure for table `pays_residences`
--

DROP TABLE IF EXISTS `pays_residences`;
CREATE TABLE IF NOT EXISTS `pays_residences` (
  `pays_id_country` bigint NOT NULL,
  `residences_id_residence` bigint NOT NULL,
  PRIMARY KEY (`pays_id_country`,`residences_id_residence`),
  UNIQUE KEY `UKeopjc2w5rkonu7jl2ktuguq73` (`residences_id_residence`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reclamation`
--

DROP TABLE IF EXISTS `reclamation`;
CREATE TABLE IF NOT EXISTS `reclamation` (
  `id_reclamation` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `etat_reclamation` enum('APPROUVE','EN_ATTENTE','REJETE') DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id_reclamation`),
  KEY `FKiod4880pxfa5hl47euap9jta7` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reclamation`
--

INSERT INTO `reclamation` (`id_reclamation`, `date`, `description`, `etat_reclamation`, `localisation`, `titre`, `user_id`) VALUES
(1, '2025-11-18', 'L\'eau chaude ne fonctionne plus dans mon appartement depuis ce matin.', 'EN_ATTENTE', 'Bloc B – Appartement 23', 'Panne d\'eau chaude', 1),
(2, '2025-11-18', 'Nuisances sonores répétitives tard le soir provenant de l\'appartement voisin.', 'REJETE', 'Bloc A – 3e étage', 'Nuisances Sonores', 1),
(5, '2025-11-18', 'L\'ascenseur ne fonctionne plus depuis hier soir.', 'APPROUVE', 'Bloc C – Hall principal', 'Ascenseur en panne', 1),
(6, '2025-11-18', 'Les arbres du jardin nécessitent une taille urgente.', 'EN_ATTENTE', 'Jardin central', 'Entretien des arbres', 1),
(8, '2025-11-18', 'Une ampoule du couloir du 2e étage est grillée.', 'EN_ATTENTE', 'Bloc A – Couloir 2e étage', 'Ampoule grillée', 6),
(9, '2025-11-18', 'Fuite d\'eau détectée près du compteur général.', 'REJETE', 'Local technique – Sous-sol', 'Fuite d\'eau', 6);

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id_reservation` bigint NOT NULL AUTO_INCREMENT,
  `approved` int NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `appartements_id_app` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `FKjclt3gmi0xkh7jbb5s0oxf0nn` (`appartements_id_app`),
  KEY `FKm4oimk0l1757o9pwavorj6ljg` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id_reservation`, `approved`, `date_debut`, `date_fin`, `appartements_id_app`, `user_id`) VALUES
(10, 1, '2025-08-22', '2025-08-26', 14, 1),
(12, 0, '2025-09-01', '2025-09-02', 17, 1),
(16, 1, '2025-09-01', '2025-09-04', 16, 1),
(17, 2, '2025-09-16', '2025-09-18', 13, 1),
(18, 2, '2025-11-11', '2025-11-13', 12, 1),
(19, 2, '2025-11-27', '2025-12-05', 20, 1);

-- --------------------------------------------------------

--
-- Table structure for table `residence`
--

DROP TABLE IF EXISTS `residence`;
CREATE TABLE IF NOT EXISTS `residence` (
  `id_residence` bigint NOT NULL AUTO_INCREMENT,
  `id_pays` bigint DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `nombrebloc` int NOT NULL,
  PRIMARY KEY (`id_residence`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `residence`
--

INSERT INTO `residence` (`id_residence`, `id_pays`, `nom`, `nombrebloc`) VALUES
(1, 2, 'Maxula', 3),
(2, 1, 'Al anwar', 3),
(3, 3, 'Les flamants roses', 4),
(4, 4, 'Folla', 1),
(5, 1, 'Yassmine', 7),
(6, 6, 'Narjess', 4),
(9, 1, 'Fleurs', 6);

-- --------------------------------------------------------

--
-- Table structure for table `residence_blocs`
--

DROP TABLE IF EXISTS `residence_blocs`;
CREATE TABLE IF NOT EXISTS `residence_blocs` (
  `residence_id_residence` bigint NOT NULL,
  `blocs_id_bloc` bigint NOT NULL,
  PRIMARY KEY (`residence_id_residence`,`blocs_id_bloc`),
  UNIQUE KEY `UKf9slnj9nnwr7x9clgpdsvd9i6` (`blocs_id_bloc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` bigint NOT NULL AUTO_INCREMENT,
  `actif` bit(1) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `approved` int NOT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `derniercnx` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `numerotelephone` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `user_role` enum('ADMIN','CLIENT','CONCIERGE') DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `actif`, `adresse`, `approved`, `cin`, `derniercnx`, `email`, `login`, `mdp`, `nom`, `numerotelephone`, `prenom`, `user_role`) VALUES
(1, b'0', 'Kerkennah', 1, '09641418', '08/22/2025', 'cherifyasmeen@gmail.com', 'yasoulanda', 'yas123', 'Yassmine', '24141608', 'Cherif', 'CLIENT'),
(5, b'1', 'kharroub', 1, '', '', 'khalilochri99@gmail.com', 'darknessaid', 'KHALIL123', 'hichri', '50306543', 'khalil', 'ADMIN'),
(6, b'1', 'ariana', 1, '', '', 'indila205@gmail.com', 'mohsen125', 'mohsen125', 'mohsen', '20541896', 'samsar', 'CONCIERGE'),
(11, b'1', 'Sfax', 2, '', '', 'cherif.yasmine2000@gmail.com', 'asma120', 'asma123', 'limem', '50201458', 'asma', 'CLIENT'),
(12, b'1', 'tunis', 1, '', '', 'samia@gmail.com', 'samia123', 'samia123', 'samia', '20202020', 'gadhrib', 'CLIENT');

-- --------------------------------------------------------

--
-- Table structure for table `user_pays`
--

DROP TABLE IF EXISTS `user_pays`;
CREATE TABLE IF NOT EXISTS `user_pays` (
  `user_id_user` bigint NOT NULL,
  `pays_id_country` bigint NOT NULL,
  PRIMARY KEY (`user_id_user`,`pays_id_country`),
  UNIQUE KEY `UKafdnqbktvvk660ywsekmomc9o` (`pays_id_country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_reclamations`
--

DROP TABLE IF EXISTS `user_reclamations`;
CREATE TABLE IF NOT EXISTS `user_reclamations` (
  `user_id_user` bigint NOT NULL,
  `reclamations_id_reclamation` bigint NOT NULL,
  PRIMARY KEY (`user_id_user`,`reclamations_id_reclamation`),
  UNIQUE KEY `UK2f9epf0vxyfewkswc2mj7ksn5` (`reclamations_id_reclamation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_reservations`
--

DROP TABLE IF EXISTS `user_reservations`;
CREATE TABLE IF NOT EXISTS `user_reservations` (
  `user_id_user` bigint NOT NULL,
  `reservations_id_reservation` bigint NOT NULL,
  PRIMARY KEY (`user_id_user`,`reservations_id_reservation`),
  UNIQUE KEY `UKakftrge3ju8lr6s3vq2gala9s` (`reservations_id_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bloc_appartement`
--
ALTER TABLE `bloc_appartement`
  ADD CONSTRAINT `FK106hmr994287hm5k5ls5muepr` FOREIGN KEY (`appartement_id_app`) REFERENCES `appartement` (`id_app`),
  ADD CONSTRAINT `FK710pn6p0qmhpoekwx0amj0d47` FOREIGN KEY (`bloc_id_bloc`) REFERENCES `bloc` (`id_bloc`);

--
-- Constraints for table `conversation_participant`
--
ALTER TABLE `conversation_participant`
  ADD CONSTRAINT `FK1fvo45w1xxiyrbwr368uivjvk` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `FKa96i3tlw77lkgdu3njapsf5tu` FOREIGN KEY (`id_conversation`) REFERENCES `conversation` (`id_conversation`);

--
-- Constraints for table `fichier`
--
ALTER TABLE `fichier`
  ADD CONSTRAINT `FK5nwn6fwiif4v10ov4o9e2o5ii` FOREIGN KEY (`id_message`) REFERENCES `message` (`id_message`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK249t1hnaxlacjng5xtud18fi` FOREIGN KEY (`id_sender`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `FKjn8nq3ps4yco0jg19ln0fx47n` FOREIGN KEY (`id_conversation`) REFERENCES `conversation` (`id_conversation`);

--
-- Constraints for table `pays_residences`
--
ALTER TABLE `pays_residences`
  ADD CONSTRAINT `FK3bd2h0obatw11thtukxlg89aa` FOREIGN KEY (`residences_id_residence`) REFERENCES `residence` (`id_residence`),
  ADD CONSTRAINT `FKcen2btycyg7r731lmww1ok31b` FOREIGN KEY (`pays_id_country`) REFERENCES `pays` (`id_country`);

--
-- Constraints for table `reclamation`
--
ALTER TABLE `reclamation`
  ADD CONSTRAINT `FKiod4880pxfa5hl47euap9jta7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `FKjclt3gmi0xkh7jbb5s0oxf0nn` FOREIGN KEY (`appartements_id_app`) REFERENCES `appartement` (`id_app`),
  ADD CONSTRAINT `FKm4oimk0l1757o9pwavorj6ljg` FOREIGN KEY (`user_id`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `residence_blocs`
--
ALTER TABLE `residence_blocs`
  ADD CONSTRAINT `FKi6y54y35gdmcwsqsj421xeoo7` FOREIGN KEY (`blocs_id_bloc`) REFERENCES `bloc` (`id_bloc`),
  ADD CONSTRAINT `FKp9ospgghs1i9pqf4fdxsu9ni` FOREIGN KEY (`residence_id_residence`) REFERENCES `residence` (`id_residence`);

--
-- Constraints for table `user_pays`
--
ALTER TABLE `user_pays`
  ADD CONSTRAINT `FKj4jecmaxvjxl2xdsm543p1jv4` FOREIGN KEY (`pays_id_country`) REFERENCES `pays` (`id_country`),
  ADD CONSTRAINT `FKqh13a0p771xhm2ixw8p8vdtpm` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`);

--
-- Constraints for table `user_reclamations`
--
ALTER TABLE `user_reclamations`
  ADD CONSTRAINT `FKktl6ljgrp1ujxh9tixsm6hi3n` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `FKqdnh1chnh67nrk88iyoso0xc4` FOREIGN KEY (`reclamations_id_reclamation`) REFERENCES `reclamation` (`id_reclamation`);

--
-- Constraints for table `user_reservations`
--
ALTER TABLE `user_reservations`
  ADD CONSTRAINT `FK99jv80l27c1eqlas84gstht2d` FOREIGN KEY (`reservations_id_reservation`) REFERENCES `reservation` (`id_reservation`),
  ADD CONSTRAINT `FKliv9q1fucqhxuhm1rf5vu3ubw` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
