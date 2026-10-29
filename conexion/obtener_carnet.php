<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

$id = intval($_GET['id'] ?? 0);

if ($id <= 0) {

    echo json_encode([
        'success' => false,
        'message' => 'ID inválido.'
    ]);

    exit;
}

$sql = "
    SELECT *
    FROM carnets
    WHERE id = ?
    LIMIT 1
";

$stmt = $conexion->prepare($sql);

$stmt->bind_param(
    "i",
    $id
);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {

    echo json_encode([
        'success' => false,
        'message' => 'Registro no encontrado.'
    ]);

    exit;
}

$carnet = $resultado->fetch_assoc();

echo json_encode([
    'success' => true,
    'carnet' => $carnet
]);

$stmt->close();
$conexion->close();

?>