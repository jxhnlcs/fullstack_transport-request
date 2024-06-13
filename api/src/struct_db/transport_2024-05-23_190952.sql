
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_access` tinyint(1) DEFAULT '0',
  `role` varchar(100) DEFAULT 'Maqueiro',
  `perms` varchar(255) DEFAULT 'User',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4



DROP TABLE IF EXISTS `TransportRequests`;
CREATE TABLE `TransportRequests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Aguardando transporte','Em transporte','Chegou ao destino') COLLATE utf8mb4_unicode_ci DEFAULT 'Aguardando transporte',
  `priority` enum('Baixa','Média','Alta') COLLATE utf8mb4_unicode_ci DEFAULT 'Baixa',
  `data` date DEFAULT NULL,
  `initial_point` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_point` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `maqueiro_id` int(11) DEFAULT NULL,
  `request_status` enum('Pendente','Aceito','Negado') COLLATE utf8mb4_unicode_ci DEFAULT 'Pendente',
  `rejected_by` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `maqueiro_id` (`maqueiro_id`),
  CONSTRAINT `TransportRequests_ibfk_1` FOREIGN KEY (`maqueiro_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci



DELIMITER //
CREATE TRIGGER set_default_date
BEFORE INSERT ON TransportRequests
FOR EACH ROW
BEGIN
  IF NEW.data IS NULL THEN
    SET NEW.data = CURDATE();
  END IF;
END;
//
DELIMITER ;



DROP TABLE IF EXISTS `TransportHistoric`;
CREATE TABLE `TransportHistoric` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `solicitacaoId` int(11) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `solicitacaoId` (`solicitacaoId`),
  CONSTRAINT `TransportHistoric_ibfk_1` FOREIGN KEY (`solicitacaoId`) REFERENCES `TransportRequests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `Incident`;
CREATE TABLE `Incident` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `solicitacaoId` int(11) NOT NULL,
  `descricao` text NOT NULL,
  `dataHora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `solicitacaoId` (`solicitacaoId`),
  CONSTRAINT `Incident_ibfk_1` FOREIGN KEY (`solicitacaoId`) REFERENCES `TransportRequests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;