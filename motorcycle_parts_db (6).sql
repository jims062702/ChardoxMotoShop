-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2025 at 08:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `motorcycle_parts_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'test@example.com', '$2b$10$6siOfEb8JCSf52hylGV29ONNMIInxPnKcFsshcNkEELCYpWEIIQYS', '2025-03-13 01:08:59'),
(2, 'admin@example.com', '$2a$10$3.Gh7a6cGyrHDqB30tPjJO3OOHT3rAJzajwkHVzpaxMCsCCnXb5OG', '2025-03-13 02:10:26'),
(3, 'unta@gmail.com', '$2a$10$5M81hmskEwhdQE2zONl/guoNjA.ep8sairUkLgZRkXniEaRrZkHFm', '2025-03-13 02:14:24'),
(4, 'gumahin@gmail.com', '$2a$10$0yu.UTQy/6XsXUKRLcdPvOvWHj12RGQK0YTNUXKEpcJg92XBjyYwO', '2025-03-13 03:01:30'),
(5, 'gasang@gmail.com', '$2a$10$jxeB7xL6Y2TAtulkTYj5dewEwYPwNySGMCIKLOezHbEC18W6Rq.Ym', '2025-03-13 03:39:59'),
(6, 'gasang1@gmail.com', '$2a$10$4mgrdsh.kq9BnzJNgxNGn.Z54lXJiudLGTsiuqJOLzgcSAy3cgmDy', '2025-03-13 04:00:04'),
(7, 'loy@gmail.com', '$2a$10$yPo9eB6rblGI2h3wZC/klezjM2pfNMTHKzxZ/3F1h00be.SO/TYWq', '2025-03-13 04:26:57'),
(8, 'loy1@gmail.com', '$2a$10$KC2CV0prevn0oOya3h0Y7uFJEEuAFjZC/9vdO3Y7a8uAaPgoaW/VO', '2025-03-13 04:40:16'),
(9, 'test@gmail.com', '$2a$10$Z1e98x4MYR6xN5i62EbvkeOFlq92yjOGiAMwRTgodtlPKUgGSa3ge', '2025-03-13 16:59:39'),
(10, 'test1@gmail.com', '$2a$10$VM/Kz4T4mMNMAiixQ8y0J.ow6DrRqmAT9RTebyVRDhp4e0Fpr2c8u', '2025-03-13 18:13:02'),
(11, 'tabing@gmail.com', '$2a$10$pTOPKGzIExbGnwW9kgLQ/Od15m8Cod0kgLEQKJM7DS8sXFcm01q7e', '2025-03-14 04:40:15');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `password`) VALUES
(1, 'james', 'james@gmail.com', '$2a$10$6E.PmTmyuWTHYSuCCE9Q5OTp6id/xLw06MLtViVfWYSfWyEsMR90e'),
(2, 'James Gasang', 'test@gmail.com', '$2a$10$/aTkct1.q4Pp5WHjGHrC5OMQutc0PWpI8gAe2ZvuMx31iUnQDqS3e'),
(3, 'Geo', 'geo@gmail.com', '$2a$10$qRa8QUkNzRov8MtTNU4rYe1Nm4Z8OkoiAlF4DxUUAk84uqnkqX..K');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`id`, `name`, `price`, `description`, `image`, `stock`, `category`) VALUES
(46, 'g', 5.00, '2', '1746328627264-1.jpg', 45, 'Body Parts'),
(48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 'Prestone®\r\n\r\nSUPER HEAVY DUTY BRAKE FLUID DOT3', '1744602365789-4.webp', 0, 'Brakes'),
(49, 'Spark Plug', 50.00, 'Spark Plug', '1744602894711-sg-11134201-7rd5c-lx6c0novatpldb.webp', 0, 'Accessories'),
(50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', '1744603074610-ph-11134207-7rasl-m5mm19sa5mdecb.webp', 2, 'Suspension'),
(51, 'Rear Shock', 1.00, 'Rear Shock MIO Sporty/MIO i 125/MIO Soul i/Honda beat/Honda Click', '1744603144114-925a92d46aeb7a027837f24121fdebbc.webp', 0, 'Suspension'),
(52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 'Clutch Cable Tmx155 Takasago Brand', '1744603236918-ph-11134207-7r98s-lws21eop3wuc21.webp', 0, 'Transmission'),
(53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 'Universal 110CM CARBON FIBER CLUTCH CABLE', '1744603309094-ph-11134207-7rasm-m63u28kd1h8i8b.webp', 5, 'Transmission'),
(54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', '1744603408712-7fd83c66840c726bdd3d75232aa79a56.webp', 2, 'Transmission'),
(55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', '1744603617603-sg-11134253-7rd4k-m6srcqpe26n588.webp', 5, 'Cooling System'),
(56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55', '1744603804608-3f25d40faef482cca0fe4fbc094f30bc.webp', 20, 'Electrical'),
(57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55\r\nBosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55', '1745228577381-3f25d40faef482cca0fe4fbc094f30bc.webp', 0, 'Accessories'),
(58, '1', 1.00, '1', '1746322326784-2.webp', 0, 'Body Parts'),
(59, '2', 2.00, '2', '1746323314921-2.webp', 0, 'Body Parts'),
(60, 'example', 1.00, 'example', '1746356747363-4.webp', 143, 'Accessories');

-- --------------------------------------------------------

--
-- Table structure for table `price_history`
--

CREATE TABLE `price_history` (
  `id` int(11) NOT NULL,
  `part_id` int(11) NOT NULL,
  `old_price` decimal(10,2) NOT NULL,
  `new_price` decimal(10,2) NOT NULL,
  `change_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_history`
--

INSERT INTO `price_history` (`id`, `part_id`, `old_price`, `new_price`, `change_date`) VALUES
(19, 46, 1.00, 50.00, '2025-04-14 04:28:38'),
(20, 46, 50.00, 40.00, '2025-04-14 04:37:48'),
(21, 46, 40.00, 50.00, '2025-04-21 09:40:47'),
(22, 46, 50.00, 12.00, '2025-05-02 03:58:03'),
(23, 46, 12.00, 1.00, '2025-05-02 03:59:49'),
(24, 46, 1.00, 2.00, '2025-05-04 01:11:37'),
(25, 58, 123.00, 1.00, '2025-05-04 01:32:11'),
(26, 59, 1.00, 2.00, '2025-05-04 01:48:40'),
(27, 46, 2.00, 1.00, '2025-05-04 03:17:11'),
(29, 60, 123.00, 1.00, '2025-05-04 11:06:59'),
(30, 46, 1.00, 2.00, '2025-05-21 22:16:15'),
(31, 46, 2.00, 50.00, '2025-05-22 11:47:24'),
(32, 49, 1.00, 50.00, '2025-05-22 11:48:15'),
(33, 46, 50.00, 5.00, '2025-05-22 12:29:20');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `customer` varchar(255) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `customer`, `order_id`, `product_id`, `product_name`, `quantity`, `amount`, `sale_date`, `total_amount`, `payment_method`, `status`) VALUES
(8, 'yawa', NULL, NULL, '', 0, 0.00, '2025-03-21 23:18:19', 2.00, 'cash', 'Completed'),
(9, 'example', NULL, NULL, '', 0, 0.00, '2025-03-21 23:28:05', 12.00, 'e-wallet', 'Completed'),
(10, 'gaga', NULL, NULL, '', 0, 0.00, '2025-03-21 23:32:23', 21.00, 'cash', 'Completed'),
(11, 'james gasang', NULL, NULL, '', 0, 0.00, '2025-03-21 23:41:19', 202.00, 'cash', 'Completed'),
(12, 'wawa', NULL, NULL, '', 0, 0.00, '2025-03-21 23:52:14', 21.00, 'cash', 'Completed'),
(13, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-22 00:22:21', 21.00, 'cash', 'Completed'),
(14, '123', NULL, NULL, '', 0, 0.00, '2025-03-22 00:26:19', 21.00, 'cash', 'Completed'),
(15, 'tata', NULL, NULL, '', 0, 0.00, '2025-03-22 00:27:27', 205.00, 'cash', 'Completed'),
(16, 'rara', NULL, NULL, '', 0, 0.00, '2025-03-22 00:29:03', 205.00, 'cash', 'Completed'),
(17, 'jaja', NULL, NULL, '', 0, 0.00, '2025-03-22 00:32:45', 205.00, 'cash', 'Completed'),
(18, 'jims jims', NULL, NULL, '', 0, 0.00, '2025-03-22 01:01:13', 410.00, 'cash', 'Completed'),
(19, 'James', NULL, NULL, '', 0, 0.00, '2025-03-22 18:19:05', 12.00, 'e-wallet', 'Completed'),
(20, 'g', NULL, NULL, '', 0, 0.00, '2025-03-22 18:20:06', 6.00, 'cash', 'Completed'),
(21, 'yaya', NULL, NULL, '', 0, 0.00, '2025-03-22 18:43:27', 20.00, 'cash', 'Completed'),
(22, 'yaya', NULL, NULL, '', 0, 0.00, '2025-03-22 18:43:42', 20.00, 'cash', 'Completed'),
(23, 'fff', NULL, NULL, '', 0, 0.00, '2025-03-22 18:58:30', 10.00, 'cash', 'Completed'),
(24, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-22 19:17:34', 103042.00, 'e-wallet', 'Completed'),
(25, 'ff', NULL, NULL, '', 0, 0.00, '2025-03-24 17:09:30', 10.00, 'cash', 'Completed'),
(26, 'not', NULL, NULL, '', 0, 0.00, '2025-03-24 19:15:52', 18.00, 'cash', 'Completed'),
(27, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-24 19:16:39', 1.00, 'cash', 'Completed'),
(28, 'tara', NULL, NULL, '', 0, 0.00, '2025-03-24 19:42:10', 10.00, 'cash', 'Completed'),
(29, 'tara', NULL, NULL, '', 0, 0.00, '2025-03-24 19:45:36', 10.00, 'cash', 'Completed'),
(30, 'tara', NULL, NULL, '', 0, 0.00, '2025-03-24 19:52:27', 10.00, 'cash', 'Completed'),
(31, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-24 19:53:02', 500.00, 'cash', 'Completed'),
(32, 'raw', NULL, NULL, '', 0, 0.00, '2025-03-24 20:03:35', 4.00, 'cash', 'Completed'),
(33, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-24 20:04:48', 3000.00, 'cash', 'Completed'),
(34, 'dw', NULL, NULL, '', 0, 0.00, '2025-03-24 20:06:45', 500.00, 'cash', 'Completed'),
(35, 'haha', NULL, NULL, '', 0, 0.00, '2025-03-24 20:15:06', 19996.00, 'cash', 'Completed'),
(36, 'hhh', NULL, NULL, '', 0, 0.00, '2025-03-24 20:18:39', 7029.00, 'cash', 'Completed'),
(37, '321', NULL, NULL, '', 0, 0.00, '2025-03-24 20:24:23', 213.00, 'cash', 'Completed'),
(38, 'wala', NULL, NULL, '', 0, 0.00, '2025-03-24 20:37:56', 213.00, 'e-wallet', 'Completed'),
(39, 'gaga', NULL, NULL, '', 0, 0.00, '2025-04-05 22:21:49', 2542.00, 'cash', 'Completed'),
(40, 'haha', NULL, NULL, '', 0, 0.00, '2025-04-05 22:28:08', 839.00, 'cash', 'Completed'),
(41, 'sge', NULL, NULL, '', 0, 0.00, '2025-04-05 22:31:16', 521.00, 'cash', 'Completed'),
(42, 'tatta', NULL, NULL, '', 0, 0.00, '2025-04-05 22:33:48', 5021.00, 'cash', 'Completed'),
(43, 'james', NULL, NULL, '', 0, 0.00, '2025-04-05 22:35:56', 565.00, 'cash', 'Completed'),
(44, 'wa', NULL, NULL, '', 0, 0.00, '2025-04-05 22:43:23', 2563.00, 'cash', 'Completed'),
(45, 'nanan', NULL, NULL, '', 0, 0.00, '2025-04-05 22:47:09', 521.00, 'cash', 'Completed'),
(46, 'ba', NULL, NULL, '', 0, 0.00, '2025-04-05 22:47:46', 2584.00, 'cash', 'Completed'),
(47, 'vav', NULL, NULL, '', 0, 0.00, '2025-04-05 22:48:13', 3313.00, 'cash', 'Completed'),
(48, 'dag', NULL, NULL, '', 0, 0.00, '2025-04-05 22:48:37', 844.00, 'cash', 'Completed'),
(49, 'bb', NULL, NULL, '', 0, 0.00, '2025-04-05 22:52:17', 1500.00, 'cash', 'Completed'),
(50, '2', NULL, NULL, '', 0, 0.00, '2025-04-05 22:57:07', 2347.00, 'cash', 'Completed'),
(51, 'wala', NULL, NULL, '', 0, 0.00, '2025-04-05 23:00:26', 1063.00, 'e-wallet', 'Completed'),
(52, 'haha', NULL, NULL, '', 0, 0.00, '2025-04-11 01:54:46', 105.00, 'cash', 'Completed'),
(53, 'james gasang', NULL, NULL, '', 0, 0.00, '2025-04-11 01:55:29', 2710.00, 'cash', 'Completed'),
(54, 'haha', NULL, NULL, '', 0, 0.00, '2025-04-13 16:23:31', 2000.00, 'cash', 'Completed'),
(55, 'j', NULL, NULL, '', 0, 0.00, '2025-04-13 17:05:03', 321.00, 'cash', 'Completed'),
(56, 'we', NULL, NULL, '', 0, 0.00, '2025-04-13 17:05:19', 105.00, 'cash', 'Completed'),
(57, 'b', NULL, NULL, '', 0, 0.00, '2025-04-13 17:05:40', 501.00, 'cash', 'Completed'),
(58, '5', NULL, NULL, '', 0, 0.00, '2025-04-13 17:24:42', 2505.00, 'cash', 'Completed'),
(59, '2960', NULL, NULL, '', 0, 0.00, '2025-04-13 17:56:11', 2505.00, 'cash', 'Completed'),
(60, 'james', NULL, NULL, '', 0, 0.00, '2025-04-13 20:28:05', 1.00, 'e-wallet', 'Completed'),
(61, 'same', NULL, NULL, '', 0, 0.00, '2025-04-13 20:28:58', 50.00, 'cash', 'Completed'),
(62, 'haha1', NULL, NULL, '', 0, 0.00, '2025-04-14 15:26:16', 1.00, 'cash', 'Completed'),
(63, 'example', NULL, NULL, '', 0, 0.00, '2025-04-21 01:43:42', 250.00, 'cash', 'Completed'),
(64, 'ff', NULL, NULL, '', 0, 0.00, '2025-04-21 01:44:28', 50.00, 'cash', 'Completed'),
(65, '33', NULL, NULL, '', 0, 0.00, '2025-04-21 02:28:04', 50.00, 'cash', 'Completed'),
(66, '33', NULL, NULL, '', 0, 0.00, '2025-04-21 02:29:01', 1.00, 'cash', 'Completed'),
(67, '33', NULL, NULL, '', 0, 0.00, '2025-04-21 02:29:42', 1.00, 'e-wallet', 'Completed'),
(68, 'haha', NULL, NULL, '', 0, 0.00, '2025-04-21 02:49:48', 1.00, 'e-wallet', 'Completed'),
(69, '4', NULL, NULL, '', 0, 0.00, '2025-04-21 02:50:47', 4.00, 'e-wallet', 'Completed'),
(70, '5', NULL, NULL, '', 0, 0.00, '2025-04-21 02:51:40', 5.00, 'e-wallet', 'Completed'),
(71, '9', NULL, NULL, '', 0, 0.00, '2025-04-21 02:52:05', 450.00, 'cash', 'Completed'),
(72, '10', NULL, NULL, '', 0, 0.00, '2025-04-21 02:54:09', 9.00, 'e-wallet', 'Completed'),
(73, 'ss', NULL, NULL, '', 0, 0.00, '2025-04-21 02:54:56', 10.00, 'e-wallet', 'Completed'),
(74, '3', NULL, NULL, '', 0, 0.00, '2025-04-21 02:57:17', 3.00, 'e-wallet', 'Completed'),
(75, '7', NULL, NULL, '', 0, 0.00, '2025-04-21 02:57:43', 7.00, 'e-wallet', 'Completed'),
(76, '100', NULL, NULL, '', 0, 0.00, '2025-04-21 03:06:49', 10.00, 'e-wallet', 'Completed'),
(77, 'kamo man', NULL, NULL, '', 0, 0.00, '2025-04-21 03:12:32', 1.00, 'e-wallet', 'Completed'),
(78, 'baba', NULL, NULL, '', 0, 0.00, '2025-04-21 03:12:59', 9.00, 'e-wallet', 'Completed'),
(79, 'cash', NULL, NULL, '', 0, 0.00, '2025-04-21 03:20:59', 5.00, 'cash', 'Completed'),
(80, 'e-wallet', NULL, NULL, '', 0, 0.00, '2025-04-21 03:21:18', 500.00, 'e-wallet', 'Completed'),
(81, 'cash', NULL, NULL, '', 0, 0.00, '2025-04-21 03:22:32', 5.00, 'cash', 'Completed'),
(82, 'e-wallet', NULL, NULL, '', 0, 0.00, '2025-04-21 03:22:56', 4.00, 'e-wallet', 'Completed'),
(83, 'e-wallet1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:23:32', 5.00, 'e-wallet', 'Completed'),
(84, 'cash1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:23:52', 10.00, 'cash', 'Completed'),
(85, 'cash2', NULL, NULL, '', 0, 0.00, '2025-04-21 03:24:17', 10.00, 'cash', 'Completed'),
(86, 'hahaE', NULL, NULL, '', 0, 0.00, '2025-04-21 03:45:07', 2500.00, 'e-wallet', 'Completed'),
(87, '1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:46:23', 1.00, 'cash', 'Completed'),
(88, '1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:47:30', 1.00, 'cash', 'Completed'),
(89, 'cash', NULL, NULL, '', 0, 0.00, '2025-04-21 03:51:53', 14.00, 'cash', 'Completed'),
(90, 'cash1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:53:00', 14.00, 'cash', 'Completed'),
(91, 'cash2', NULL, NULL, '', 0, 0.00, '2025-04-21 03:53:50', 5.00, 'cash', 'Completed'),
(92, 'E-wallet1', NULL, NULL, '', 0, 0.00, '2025-04-21 03:54:19', 5.00, 'e-wallet', 'Completed'),
(93, 'cash3', NULL, NULL, '', 0, 0.00, '2025-04-21 03:54:47', 30.00, 'cash', 'Completed'),
(94, 'daghan', NULL, NULL, '', 0, 0.00, '2025-04-21 03:56:38', 666.00, 'cash', 'Completed'),
(95, 'walanani', NULL, NULL, '', 0, 0.00, '2025-04-21 03:58:47', 15.00, 'cash', 'Completed'),
(96, '7', NULL, NULL, '', 0, 0.00, '2025-04-21 03:59:33', 392.00, 'e-wallet', 'Completed'),
(97, '3', NULL, NULL, '', 0, 0.00, '2025-05-01 17:54:19', 3.00, 'e-wallet', 'Completed'),
(98, 'yawa', NULL, NULL, '', 0, 0.00, '2025-05-01 19:58:54', 12.00, 'e-wallet', 'Completed'),
(99, 'james gasang', NULL, NULL, '', 0, 0.00, '2025-05-03 17:52:42', 2.00, 'e-wallet', 'Completed'),
(100, 'james', NULL, NULL, '', 0, 0.00, '2025-05-03 17:54:09', 8.00, 'cash', 'Completed'),
(101, '7', NULL, NULL, '', 0, 0.00, '2025-05-03 17:54:50', 25.00, 'cash', 'Completed'),
(102, 'mix', NULL, NULL, '', 0, 0.00, '2025-05-03 17:56:40', 191.00, 'cash', 'Completed'),
(103, 'e', NULL, NULL, '', 0, 0.00, '2025-05-03 18:11:13', 3.00, 'e-wallet', 'Completed'),
(104, '2', NULL, NULL, '', 0, 0.00, '2025-05-03 18:41:28', 4.00, 'cash', 'Completed'),
(105, 'wala na', NULL, NULL, '', 0, 0.00, '2025-05-04 00:14:30', 1.00, 'cash', 'Completed'),
(106, 'cash', NULL, NULL, '', 0, 0.00, '2025-05-04 00:26:25', 1.00, 'cash', 'Completed'),
(107, 'cash1', NULL, NULL, '', 0, 0.00, '2025-05-04 00:26:46', 5.00, 'cash', 'Completed'),
(108, 'try', NULL, NULL, '', 0, 0.00, '2025-05-04 00:32:26', 2.00, 'e-wallet', 'Returned'),
(109, '6', NULL, NULL, '', 0, 0.00, '2025-05-04 00:36:03', 413.00, 'cash', 'Returned'),
(110, 'haha', NULL, NULL, '', 0, 0.00, '2025-05-04 01:03:03', 5.00, 'e-wallet', 'Completed'),
(111, '33', NULL, NULL, '', 0, 0.00, '2025-05-04 02:05:21', 1.00, 'e-wallet', 'Completed'),
(112, '4', NULL, NULL, '', 0, 0.00, '2025-05-04 02:10:57', 4.00, 'cash', 'Completed'),
(113, '125', NULL, NULL, '', 0, 0.00, '2025-05-04 02:23:47', 9.00, 'cash', 'Completed'),
(114, '2002', NULL, NULL, '', 0, 0.00, '2025-05-04 02:25:06', 1.00, 'e-wallet', 'Completed'),
(115, 'duha', NULL, NULL, '', 0, 0.00, '2025-05-04 02:28:18', 2.00, 'e-wallet', 'Completed'),
(116, 'Unom ni part', NULL, NULL, '', 0, 0.00, '2025-05-04 02:28:50', 6.00, 'cash', 'Completed'),
(117, 'walo ni part', NULL, NULL, '', 0, 0.00, '2025-05-04 02:29:16', 8.00, 'e-wallet', 'Completed'),
(118, 'example customer', NULL, NULL, '', 0, 0.00, '2025-05-04 03:08:03', 1.00, 'e-wallet', 'Completed'),
(119, '13', NULL, NULL, '', 0, 0.00, '2025-05-04 03:10:02', 13.00, 'cash', 'Completed'),
(120, '1', NULL, NULL, '', 0, 0.00, '2025-05-21 14:14:17', 8.00, 'cash', 'Completed'),
(121, '49', NULL, NULL, '', 0, 0.00, '2025-05-21 14:15:44', 49.00, 'cash', 'Completed'),
(122, 'james gasang', NULL, NULL, '', 0, 0.00, '2025-05-22 01:51:23', 12.00, 'cash', 'Completed'),
(123, '2', NULL, NULL, '', 0, 0.00, '2025-05-22 02:16:44', 4.00, 'cash', 'Completed'),
(124, 'mix', NULL, NULL, '', 0, 0.00, '2025-05-22 02:32:59', 63.00, 'cash', 'Returned'),
(125, 'haha', NULL, NULL, '', 0, 0.00, '2025-05-22 04:31:25', 25.00, 'cash', 'Completed'),
(126, 'ff', NULL, NULL, '', 0, 0.00, '2025-05-22 05:14:48', 30.00, 'cash', 'Completed'),
(127, 'ano g?', NULL, NULL, '', 0, 0.00, '2025-05-26 14:58:31', 41.00, 'cash', 'Completed'),
(128, 'mix', NULL, NULL, '', 0, 0.00, '2025-05-29 21:23:27', 43.00, 'cash', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `item_id`, `item_name`, `price`, `quantity`) VALUES
(1, 8, 43, '123', 2.00, 1),
(2, 9, 43, '123', 2.00, 6),
(3, 10, 35, 'dwa', 21.00, 1),
(4, 11, 34, '321', 200.00, 1),
(5, 11, 43, '123', 2.00, 1),
(6, 12, 35, 'dwa', 21.00, 1),
(7, 13, 35, 'dwa', 21.00, 1),
(8, 14, 35, 'dwa', 21.00, 1),
(9, 15, 34, '321', 205.00, 1),
(10, 16, 34, '321', 205.00, 1),
(11, 17, 34, '321', 205.00, 1),
(12, 18, 34, '321', 205.00, 2),
(13, 19, 43, '123', 2.00, 6),
(14, 20, 43, '123', 2.00, 3),
(15, 21, 43, '123', 2.00, 10),
(16, 22, 43, '123', 2.00, 10),
(17, 23, 43, '123', 2.00, 5),
(18, 24, 39, '3123213', 321.00, 321),
(19, 24, 38, '321312', 1.00, 1),
(20, 25, 43, '123', 2.00, 5),
(21, 26, 43, '123', 2.00, 9),
(22, 27, 37, '312312', 1.00, 1),
(23, 28, 43, '123', 2.00, 5),
(24, 29, 43, '123', 2.00, 5),
(25, 30, 43, '123', 2.00, 5),
(26, 31, 34, '3211', 500.00, 1),
(27, 32, 43, '123', 2.00, 2),
(28, 33, 43, '123', 200.00, 15),
(29, 34, 34, '3211', 500.00, 1),
(30, 35, 43, '123', 200.00, 2),
(31, 35, 44, 'haha', 213.00, 92),
(32, 36, 44, 'haha', 213.00, 33),
(33, 37, 44, 'haha', 213.00, 1),
(34, 38, 44, 'haha', 213.00, 1),
(35, 39, 34, '3211', 500.00, 5),
(36, 39, 35, 'dwa', 21.00, 2),
(37, 40, 43, '123', 200.00, 1),
(38, 40, 44, 'haha', 213.00, 3),
(39, 41, 34, '3211', 500.00, 1),
(40, 41, 35, 'dwa', 21.00, 1),
(41, 42, 34, '3211', 500.00, 10),
(42, 42, 35, 'dwa', 21.00, 1),
(43, 43, 43, '123', 200.00, 2),
(44, 43, 40, '321', 33.00, 5),
(45, 44, 34, '3211', 500.00, 5),
(46, 44, 35, 'dwa', 21.00, 3),
(47, 45, 34, '3211', 500.00, 1),
(48, 45, 35, 'dwa', 21.00, 1),
(49, 46, 34, '3211', 500.00, 5),
(50, 46, 35, 'dwa', 21.00, 4),
(51, 47, 41, '32131', 1.00, 1),
(52, 47, 42, '3123', 3312.00, 1),
(53, 48, 34, '3211', 500.00, 1),
(54, 48, 35, 'dwa', 21.00, 1),
(55, 48, 36, 'dwada', 321.00, 1),
(56, 48, 37, '312312', 1.00, 1),
(57, 48, 38, '321312', 1.00, 1),
(58, 49, 34, '3211', 500.00, 3),
(59, 50, 34, '3211', 500.00, 2),
(60, 50, 35, 'dwa', 21.00, 3),
(61, 50, 36, 'dwada', 321.00, 4),
(62, 51, 34, '3211', 500.00, 2),
(63, 51, 35, 'dwa', 21.00, 3),
(64, 52, 35, 'dwa', 21.00, 5),
(65, 53, 35, 'dwa', 21.00, 10),
(66, 53, 34, '3211', 500.00, 5),
(67, 54, 34, '3211', 500.00, 4),
(68, 55, 36, 'dwada', 321.00, 1),
(69, 56, 35, 'dwa', 21.00, 5),
(70, 57, 34, '3212', 501.00, 1),
(71, 58, 34, '3212', 501.00, 5),
(72, 59, 34, '3212', 501.00, 5),
(73, 60, 46, 'Side Mirror', 1.00, 1),
(74, 61, 46, 'Side Mirror', 50.00, 1),
(75, 62, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 1),
(76, 63, 57, 'example product', 50.00, 5),
(77, 64, 57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 1),
(78, 65, 46, 'Side Mirrors', 50.00, 1),
(79, 66, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 1),
(80, 67, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 1),
(81, 68, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(82, 69, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 4),
(83, 70, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(84, 71, 46, 'Side Mirrors', 50.00, 9),
(85, 72, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 9),
(86, 73, 49, 'Spark Plug', 1.00, 10),
(87, 74, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 3),
(88, 75, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 7),
(89, 76, 51, 'Rear Shock', 1.00, 10),
(90, 77, 51, 'Rear Shock', 1.00, 1),
(91, 78, 51, 'Rear Shock', 1.00, 9),
(92, 79, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(93, 80, 46, 'Side Mirrors', 50.00, 10),
(94, 81, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 5),
(95, 82, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 4),
(96, 83, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 5),
(97, 84, 49, 'Spark Plug', 1.00, 10),
(98, 85, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 10),
(99, 86, 46, 'Side Mirrors', 50.00, 50),
(100, 87, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(101, 88, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(102, 89, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 3),
(103, 89, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 5),
(104, 89, 49, 'Spark Plug', 1.00, 6),
(105, 90, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(106, 90, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 5),
(107, 90, 49, 'Spark Plug', 1.00, 4),
(108, 91, 49, 'Spark Plug', 1.00, 5),
(109, 92, 49, 'Spark Plug', 1.00, 5),
(110, 93, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 10),
(111, 93, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 10),
(112, 93, 49, 'Spark Plug', 1.00, 10),
(113, 94, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 3),
(114, 94, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 3),
(115, 94, 49, 'Spark Plug', 1.00, 4),
(116, 94, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 5),
(117, 94, 51, 'Rear Shock', 1.00, 6),
(118, 94, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 7),
(119, 94, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 8),
(120, 94, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 9),
(121, 94, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 10),
(122, 94, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 11),
(123, 94, 57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 12),
(124, 95, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 5),
(125, 95, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 5),
(126, 95, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 5),
(127, 96, 57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 7),
(128, 96, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 7),
(129, 96, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 7),
(130, 96, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 7),
(131, 96, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 7),
(132, 96, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 7),
(133, 96, 51, 'Rear Shock', 1.00, 7),
(134, 97, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 3),
(135, 98, 46, 'tuba', 12.00, 1),
(136, 99, 46, 'tubas', 2.00, 1),
(137, 100, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 3),
(138, 100, 46, 'tubas', 2.00, 2),
(139, 100, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(140, 101, 46, 'tubas', 2.00, 7),
(141, 101, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(142, 101, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 6),
(143, 102, 46, 'tubas', 2.00, 3),
(144, 102, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 3),
(145, 102, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 3),
(146, 102, 49, 'Spark Plug', 1.00, 3),
(147, 102, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 3),
(148, 102, 51, 'Rear Shock', 1.00, 3),
(149, 102, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 3),
(150, 102, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 3),
(151, 102, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 3),
(152, 102, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 3),
(153, 102, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 3),
(154, 102, 57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 3),
(155, 102, 59, '2', 2.00, 2),
(156, 102, 58, '1', 1.00, 1),
(157, 103, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 3),
(158, 104, 46, 'tubas', 2.00, 2),
(159, 105, 46, '1', 1.00, 1),
(160, 106, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(161, 107, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(162, 108, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 2),
(163, 109, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 6),
(164, 109, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 7),
(165, 109, 57, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Bosch Halogen Bulb', 50.00, 8),
(166, 110, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 5),
(167, 111, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 1),
(168, 112, 47, 'NEW LIHA SEAT COVER FOR ALL MOTORCYCLE MODELS- STYLISH, DURABLE, AND CUSTOM FIT', 1.00, 4),
(169, 113, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 6),
(170, 113, 56, 'Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard P43t Auto Headlight 60 / 55 Head Lamp 0986AL1513', 1.00, 2),
(171, 113, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 1),
(172, 114, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 1),
(173, 115, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 2),
(174, 116, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 6),
(175, 117, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 8),
(176, 118, 46, '1', 1.00, 1),
(177, 119, 49, 'Spark Plug', 1.00, 13),
(178, 120, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 8),
(179, 121, 46, '1', 1.00, 49),
(180, 122, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 1),
(181, 122, 51, 'Rear Shock', 1.00, 1),
(182, 122, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 10),
(183, 123, 46, '2', 2.00, 2),
(184, 124, 50, 'MISHIBA FRONT FORK XRM 125 LH/RH 1 SET', 1.00, 39),
(185, 124, 51, 'Rear Shock', 1.00, 14),
(186, 124, 52, 'Clutch Cable Tmx155 Takasago Brand', 1.00, 10),
(187, 125, 46, 'g', 5.00, 5),
(188, 126, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 5),
(189, 126, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 10),
(190, 126, 55, 'Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L', 1.00, 15),
(191, 127, 46, 'g', 5.00, 4),
(192, 127, 48, 'Super Heavy Duty brake fluid dot 3 900ml for Brake and Cluth System Superior Braking Action', 1.00, 2),
(193, 127, 51, 'Rear Shock', 1.00, 19),
(194, 128, 46, 'g', 5.00, 5),
(195, 128, 53, 'Universal 110CM CARBON FIBER CLUTCH CABLE', 1.00, 10),
(196, 128, 54, 'CHAIN SPROCKET SET for XRM/WAVE/SMASH', 1.00, 8);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`) VALUES
(1, 'admin@example.com', '$2b$10$u2QHU/K1FlgA0Mqbew59ROBKcJ4/Jdfi9e9z.5U7k0lPhPmucaK7S', 'admin'),
(2, 'client@example.com', '$2b$10$yLmH1Ca7wf0sOZgj5.XWve0spQLYm3AM4mJ/XOqczgo7LI7KUoUli', 'client'),
(5, 'admin1@example.com', '$2a$10$I9UgFKdtyHrFNCDadONlbesfcAtdO6O6m9qvTnU.h4QV3lH4AQ2fK', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `price_history`
--
ALTER TABLE `price_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `part_id` (`part_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `price_history`
--
ALTER TABLE `price_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `parts` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `parts` (`id`);

--
-- Constraints for table `price_history`
--
ALTER TABLE `price_history`
  ADD CONSTRAINT `price_history_ibfk_1` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `parts` (`id`);

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
