CREATE DATABASE QuanLyHocSinhDB
GO

CREATE LOGIN admin
WITH PASSWORD = 'admin';
GO

USE QuanLyHocSinhDB
GO

CREATE USER admin
FOR LOGIN admin;
GO

EXEC sp_addrolemember 'db_owner', 'admin';