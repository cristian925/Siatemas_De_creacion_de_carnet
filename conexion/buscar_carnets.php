<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

$q = trim($_GET['q'] ?? '');

if ($q === '') {

    echo json_encode([
        'success' => true,
        'datos' => []
    ]);

    exit;
}

$buscar = '%' . $q . '%';

$sql = "
    SELECT
        id,
        numero_carnet,
        nombres,
        apellidos,
        fecha_nacimiento

    FROM carnets

    WHERE
        numero_carnet LIKE ?
        OR nombres LIKE ?
        OR apellidos LIKE ?
        OR CONCAT(nombres, ' ', apellidos) LIKE ?

    ORDER BY nombres ASC

    LIMIT 20
";

$stmt = $conexion->prepare($sql);

if (!$stmt) {

    echo json_encode([
        'success' => false,
        'message' => 'Error al preparar la búsqueda: ' . $conexion->error
    ]);

    exit;
}

$stmt->bind_param(
    "ssss",
    $buscar,
    $buscar,
    $buscar,
    $buscar
);

$stmt->execute();

$resultado = $stmt->get_result();

$datos = [];

while ($fila = $resultado->fetch_assoc()) {

    $datos[] = $fila;
}

echo json_encode([
    'success' => true,
    'datos' => $datos
]);

$stmt->close();
$conexion->close();

?>