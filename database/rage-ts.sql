-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2023 at 11:59 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rage-ts`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `ID` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(61) NOT NULL,
  `email` varchar(128) NOT NULL,
  `socialClub` varchar(48) NOT NULL,
  `socialClubId` int(11) NOT NULL,
  `lastActive` int(11) NOT NULL,
  `admin` int(11) NOT NULL,
  `helper` int(11) NOT NULL,
  `respect` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `money` int(11) NOT NULL,
  `bank` int(11) NOT NULL,
  `warns` int(11) NOT NULL,
  `mute` int(11) NOT NULL,
  `hours` int(11) NOT NULL,
  `skin` varchar(64) NOT NULL DEFAULT 'mp_m_freemode_01',
  `seconds` int(11) NOT NULL,
  `job` int(11) NOT NULL,
  `fishrod` tinyint(1) NOT NULL,
  `momeala` int(11) NOT NULL,
  `gender` int(11) NOT NULL,
  `hair` int(11) NOT NULL,
  `pants` int(11) NOT NULL,
  `shoes` int(11) NOT NULL,
  `shirt` int(11) NOT NULL,
  `skill` varchar(24) NOT NULL DEFAULT '0|0',
  `times` varchar(24) NOT NULL DEFAULT '0|0',
  `driving_license_active` int(11) NOT NULL,
  `driving_license_suspended` int(11) NOT NULL,
  `weapon_license_active` int(11) NOT NULL,
  `weapon_license_suspended` int(11) NOT NULL,
  `fly_license_active` int(11) NOT NULL,
  `fly_license_suspended` int(11) NOT NULL,
  `boat_license_active` int(11) NOT NULL,
  `boat_license_suspended` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

CREATE TABLE `business` (
  `ID` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `balance` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `icon` int(11) NOT NULL,
  `icon_color` int(11) NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `z` float NOT NULL,
  `description` varchar(128) NOT NULL,
  `owner` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `owned` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `ID` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `icon` int(11) NOT NULL,
  `icon_color` int(11) NOT NULL,
  `have_work` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `owned` tinyint(1) NOT NULL,
  `balance` int(11) NOT NULL,
  `max_money_skill1` int(11) NOT NULL,
  `max_money_skill2` int(11) NOT NULL,
  `max_money_skill3` int(11) NOT NULL,
  `max_money_skill4` int(11) NOT NULL,
  `max_money_skill5` int(11) NOT NULL,
  `min_money_skill1` int(11) NOT NULL,
  `min_money_skill2` int(11) NOT NULL,
  `min_money_skill3` int(11) NOT NULL,
  `min_money_skill4` int(11) NOT NULL,
  `min_money_skill5` int(11) NOT NULL,
  `work_name` varchar(128) NOT NULL,
  `work_pos_x` float NOT NULL,
  `work_pos_y` float NOT NULL,
  `work_pos_z` float NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `z` float NOT NULL,
  `name` varchar(64) NOT NULL,
  `owner` varchar(32) NOT NULL,
  `description` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sanctions`
--

CREATE TABLE `sanctions` (
  `ID` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `socialClubId` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  `permanent` tinyint(1) NOT NULL,
  `days` int(11) NOT NULL,
  `reason` varchar(128) NOT NULL,
  `adminName` varchar(32) NOT NULL,
  `time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `sanctions`
--
ALTER TABLE `sanctions`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business`
--
ALTER TABLE `business`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sanctions`
--
ALTER TABLE `sanctions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
