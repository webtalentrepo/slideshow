-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2015 at 06:06 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `fl_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `table_users`
--

CREATE TABLE IF NOT EXISTS `table_users` (
  `priKey` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(40) NOT NULL,
  `location` varchar(255) NOT NULL,
  `birthday` varchar(40) NOT NULL,
  `sex` varchar(40) NOT NULL,
  `phonenumber` varchar(40) NOT NULL,
  `latitude` varchar(40) NOT NULL,
  `longitude` varchar(40) NOT NULL,
  `changedate` varchar(40) NOT NULL,
  PRIMARY KEY (`priKey`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `table_users`
--

INSERT INTO `table_users` (`priKey`, `username`, `password`, `email`, `location`, `birthday`, `sex`, `phonenumber`, `latitude`, `longitude`, `changedate`) VALUES
(2, 'a@a.com', '202cb962ac59075b964b07152d234b70', 'a@a.com', 'null', '2014-04-30', 'male', '123', '51.06901500000001', '9.667968333333333', '1423587939312'),
(3, 'sdf@sdf.com', '0cc175b9c0f1b6a831c399e269772661', 'asdf', '', '', '', '', '', '', ''),
(4, 'sdf', 'd9729feb74992cc3482b350163a1a010', 'sdf@s.com', 'null', '2014-04-30', 'male', 'sdf', '', '', '0');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
