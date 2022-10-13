-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2022 at 01:12 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mpvwallet`
--

-- --------------------------------------------------------

--
-- Table structure for table `mpvaccount`
--

CREATE TABLE `mpvaccount` (
  `user_id` bigint(20) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `date_registered` timestamp DEFAULT current_timestamp,
  `password` varchar(500) NOT NULL DEFAULT '12345'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mpvaccount`
--

INSERT INTO `mpvaccount` (`user_id`, `firstname`, `lastname`, `middlename`, `email`, `phone`, `date_registered`, `password`) VALUES
(3, 'Tope', 'Hammed', '', 'tope11@gmail.com', '0985188', '2022-10-07', '$2b$10$e19BIy7NQLIa0Q5XSc6Ov.2ZpSp8tqQYkiWF5ey43jotav9BkTSxu'),
(5, 'Jibola', 'Amope', 'Sola', 'ajib@gmail.com', '08830985188', '2022-10-08', '$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u'),
(8, 'Jibola', 'Amope', 'Sola', 'ajib2@gmail.com', '088309851884', '2022-10-08', '$2b$10$XtEhJToUSy9/kYccxmF.lel/KEMGKVjmu.8wViWFaut6cadVC36qW');

-- --------------------------------------------------------

--
-- Table structure for table `mpvwallet`
--

CREATE TABLE `mpvwallet` (
  `walletid` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `walletbalance` decimal(18,2) DEFAULT 0.00,
  `date_opened` timestamp DEFAULT current_timestamp
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mpvwallet`
--

INSERT INTO `mpvwallet` (`walletid`, `user_id`, `walletbalance`, `date_opened`) VALUES
(2, 5, '558110.00', '2022-10-08'),
(3, 8, '110.00', '2022-10-08');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `token` varchar(100) NOT NULL,
  `data` varchar(1000) DEFAULT NULL,
  `ip` varchar(30) DEFAULT NULL,
  `time` bigint(20) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`token`, `data`, `ip`, `time`) VALUES
('0a867b20-f77d-4e48-8deb-675e51efd104', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665262602),
('0c41a9ce-231c-44e1-8f44-15c2bd08cc19', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665615630),
('0f80ccf3-bcf4-4806-852b-3930f173e3fb', '{\"user_id\":3,\"firstname\":\"Lawan\",\"lastname\":\"Hammed\",\"middlename\":\"\",\"email\":\"lawan1@gmail.com\",\"phone\":\"0985188\",\"date_registered\":\"2022-10-06T23:00:00.000Z\",\"password\":\"$2b$10$e19BIy7NQLIa0Q5XSc6Ov.2ZpSp8tqQYkiWF5ey43jotav9BkTSxu\"}', '12.0.0.1', 1665216948),
('234147c1-fd30-43e8-8512-d3e21a0bde31', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665218832),
('32329e19-71a0-426c-adc1-e98039ef9fa9', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665614940),
('4dd8c7f6-97c5-4845-95f3-d4c9a259b725', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665220060),
('6ac91b01-e9ef-4257-83ce-d228f5d7ddf9', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665343508),
('9db7c23f-b5bb-4f43-b490-238ada6d5f55', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665265257),
('b17ad78b-52c9-447f-a4cc-50b5ce5eeb5a', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665614257),
('fbbea085-e49c-4832-96c3-a840f1ca308a', '{\"user_id\":5,\"firstname\":\"Jibola\",\"lastname\":\"Amope\",\"middlename\":\"Sola\",\"email\":\"ajib@gmail.com\",\"phone\":\"08830985188\",\"date_registered\":\"2022-10-07T23:00:00.000Z\",\"password\":\"$2b$10$upFcY9ZoEMvSItS3AJrU5eFdHFBlcNQ.iaex2Fyrvz0n.WS3Aqi4u\"}', '12.0.0.1', 1665263520);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transactionid` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `amount` decimal(18,2) DEFAULT 0.00,
  `walletbalance` decimal(18,2) DEFAULT 0.00,
  `type` varchar(10) NOT NULL,
  `source` varchar(500) NOT NULL,
  `date_created` timestamp DEFAULT current_timestamp(),
  `destination` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transactionid`, `user_id`, `amount`, `walletbalance`, `type`, `source`, `date_created`, `destination`) VALUES
(1, 5, '50.00', '50.00', 'fund', 'card', '2022-10-07 23:00:00', NULL),
(2, 5, '10.00', '60.00', 'fund', 'card', '2022-10-07 23:00:00', NULL),
(3, 5, '15.00', '90.00', 'fund', 'card', '2022-10-07 23:00:00', NULL),
(4, 5, '20.00', '70.00', 'transfer', '', '2022-10-07 23:00:00', '8'),
(5, 8, '20.00', '70.00', 'receive', '5', '2022-10-07 23:00:00', NULL),
(6, 5, '10.00', '60.00', 'transfer', '', '2022-10-08 21:40:35', '8'),
(7, 8, '10.00', '60.00', 'receive', '5', '2022-10-08 21:40:35', NULL),
(8, 5, '10.00', '50.00', 'transfer', '', '2022-10-08 21:40:57', '8'),
(9, 8, '10.00', '50.00', 'receive', '5', '2022-10-08 21:40:57', NULL),
(10, 5, '5.00', '45.00', 'transfer', '', '2022-10-09 19:08:01', '8'),
(11, 8, '5.00', '45.00', 'receive', '5', '2022-10-09 19:08:01', NULL),
(12, 5, '5.00', '40.00', 'transfer', '', '2022-10-09 19:08:30', '8'),
(13, 8, '5.00', '40.00', 'receive', '5', '2022-10-09 19:08:30', NULL),
(14, 5, '5.00', '35.00', 'transfer', '', '2022-10-09 19:10:14', '8'),
(15, 8, '5.00', '35.00', 'receive', '5', '2022-10-09 19:10:14', NULL),
(16, 5, '5.00', '30.00', 'transfer', '', '2022-10-09 19:12:36', '8'),
(17, 8, '5.00', '60.00', 'receive', '5', '2022-10-09 19:12:36', NULL),
(18, 5, '35.00', '65.00', 'fund', 'card', '2022-10-09 19:17:09', NULL),
(19, 5, '150.00', '-85.00', 'transfer', '', '2022-10-09 19:20:20', '8'),
(20, 8, '150.00', '210.00', 'receive', '5', '2022-10-09 19:20:20', NULL),
(21, 5, '85.00', '0.00', 'fund', 'card', '2022-10-09 19:24:48', NULL),
(22, 8, '50.00', '160.00', 'transfer', '', '2022-10-09 19:25:08', '5'),
(23, 5, '50.00', '50.00', 'receive', '8', '2022-10-09 19:25:08', NULL),
(24, 5, '85.00', '8550.00', 'fund', 'card', '2022-10-12 22:35:03', NULL),
(25, 5, '5.00', '58550.00', 'fund', 'card', '2022-10-12 22:35:21', NULL),
(26, 5, '5.00', '558550.00', 'fund', 'card', '2022-10-12 22:36:30', NULL),
(27, 5, '5.00', '558555.00', 'fund', 'card', '2022-10-12 22:37:34', NULL),
(28, 5, '5.00', '558560.00', 'fund', 'card', '2022-10-12 22:37:38', NULL),
(29, 8, '50.00', '110.00', 'transfer', '', '2022-10-12 22:49:00', '5'),
(30, 5, '50.00', '558610.00', 'receive', '8', '2022-10-12 22:49:00', NULL),
(31, 5, '500.00', '558110.00', 'withdraw', '', '2022-10-12 23:00:30', 'bank');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mpvaccount`
--
ALTER TABLE `mpvaccount`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `mpvwallet`
--
ALTER TABLE `mpvwallet`
  ADD PRIMARY KEY (`walletid`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`token`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transactionid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mpvaccount`
--
ALTER TABLE `mpvaccount`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mpvwallet`
--
ALTER TABLE `mpvwallet`
  MODIFY `walletid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transactionid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
