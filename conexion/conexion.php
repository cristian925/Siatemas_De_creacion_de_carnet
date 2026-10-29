<?php

$host = "localhost";
$usuarioBD = "carnet_user";
$passwordBD = "Carnet2026*";
$baseDatos = "carnet_system";

$conexion = new mysqli(
    $host,
    $usuarioBD,
    $passwordBD,
    $baseDatos
);

if ($conexion->connect_error) {

    die("Error de conexión: " . $conexion->connect_error);

}

$conexion->set_charset("utf8mb4");

?>