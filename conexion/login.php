<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


$usuario = trim(
    $datos['usuario'] ?? ''
);

$clave =
    $datos['clave'] ?? '';


if ($usuario === '' || $clave === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Usuario y contraseña son obligatorios.'
    ]);

    exit;
}


// ==========================================
// BUSCAR USUARIO
// ==========================================

$sql = "
    SELECT
        id,
        usuario,
        clave,
        rol,
        nombre,
        activo

    FROM usuarios

    WHERE usuario = ?

    LIMIT 1
";


$stmt =
    $conexion->prepare($sql);


$stmt->bind_param(
    "s",
    $usuario
);


$stmt->execute();


$resultado =
    $stmt->get_result();


if ($resultado->num_rows === 0) {

    echo json_encode([
        'success' => false,
        'message' => 'Usuario o contraseña incorrectos.'
    ]);

    exit;
}


$cuenta =
    $resultado->fetch_assoc();


// ==========================================
// VERIFICAR SI ESTÁ ACTIVO
// ==========================================

if ((int)$cuenta['activo'] !== 1) {

    echo json_encode([
        'success' => false,
        'message' => 'Este usuario se encuentra desactivado.'
    ]);

    exit;
}


// ==========================================
// VERIFICAR CONTRASEÑA
// ==========================================

// Por ahora tu BD tiene las claves en texto.
// Después las convertiremos a password_hash().

if ($clave !== $cuenta['clave']) {

    echo json_encode([
        'success' => false,
        'message' => 'Usuario o contraseña incorrectos.'
    ]);

    exit;
}


// ==========================================
// LOGIN CORRECTO
// ==========================================

echo json_encode([

    'success' => true,

    'usuario' => [

        'id' =>
            (int)$cuenta['id'],

        'usuario' =>
            $cuenta['usuario'],

        'rol' =>
            $cuenta['rol'],

        'nombre' =>
            $cuenta['nombre']
    ]

]);


$stmt->close();

$conexion->close();

?>