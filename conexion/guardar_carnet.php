<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';


$datos = json_decode(
    file_get_contents("php://input"),
    true
);


if (!$datos) {

    echo json_encode([
        'success' => false,
        'message' => 'No se recibieron datos.'
    ]);

    exit;
}


$id = intval($datos['id'] ?? 0);


// ==========================================
// SI EL REGISTRO YA EXISTE → UPDATE
// ==========================================

if ($id > 0) {

    $sql = "
        UPDATE carnets SET

            numero_carnet = ?,
            anio = ?,
            fecha_emision = ?,
            nombres = ?,
            apellidos = ?,
            genero = ?,
            nacionalidad = ?,
            tipo_sangre = ?,
            fecha_nacimiento = ?,
            lugar_nacimiento = ?,
            nombre_padre = ?,
            nombre_madre = ?,
            direccion = ?,
            color_piel = ?,
            color_ojos = ?,
            color_cabello = ?,
            partida_anio = ?,
            partida_libro = ?,
            partida_folio = ?,
            partida_tomo = ?,
            partida_partida = ?,
            tipo_tramite = ?,
            senales_especiales = ?,
            centro_estudio = ?,
            profesion = ?,
            estado_familiar = ?,
            fecha_vencimiento = ?,
            valor_carnet = ?,
            serie_mh = ?,
            usuario_creador = ?

        WHERE id = ?
    ";


    $stmt = $conexion->prepare($sql);


    if (!$stmt) {

        echo json_encode([
            'success' => false,
            'message' => 'Error al preparar UPDATE: ' . $conexion->error
        ]);

        exit;
    }


    $stmt->bind_param(
        "sssssssssssssssssssssssssssdsii",

        $datos['numero_carnet'],
        $datos['anio'],
        $datos['fecha_emision'],
        $datos['nombres'],
        $datos['apellidos'],
        $datos['genero'],
        $datos['nacionalidad'],
        $datos['tipo_sangre'],
        $datos['fecha_nacimiento'],
        $datos['lugar_nacimiento'],
        $datos['nombre_padre'],
        $datos['nombre_madre'],
        $datos['direccion'],
        $datos['color_piel'],
        $datos['color_ojos'],
        $datos['color_cabello'],
        $datos['partida_anio'],
        $datos['partida_libro'],
        $datos['partida_folio'],
        $datos['partida_tomo'],
        $datos['partida_partida'],
        $datos['tipo_tramite'],
        $datos['senales_especiales'],
        $datos['centro_estudio'],
        $datos['profesion'],
        $datos['estado_familiar'],
        $datos['fecha_vencimiento'],
        $datos['valor_carnet'],
        $datos['serie_mh'],
        $datos['usuario_creador'],
        $id
    );


    if (!$stmt->execute()) {

        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar: ' . $stmt->error
        ]);

        exit;
    }


    echo json_encode([
        'success' => true,
        'id' => $id,
        'accion' => 'actualizado',
        'message' => 'Carnet actualizado correctamente.'
    ]);

}


// ==========================================
// SI ES NUEVO → INSERT
// ==========================================

else {

    $sql = "
        INSERT INTO carnets (

            numero_carnet,
            anio,
            fecha_emision,
            nombres,
            apellidos,
            genero,
            nacionalidad,
            tipo_sangre,
            fecha_nacimiento,
            lugar_nacimiento,
            nombre_padre,
            nombre_madre,
            direccion,
            color_piel,
            color_ojos,
            color_cabello,
            partida_anio,
            partida_libro,
            partida_folio,
            partida_tomo,
            partida_partida,
            tipo_tramite,
            senales_especiales,
            centro_estudio,
            profesion,
            estado_familiar,
            fecha_vencimiento,
            valor_carnet,
            serie_mh,
            usuario_creador

        )
        VALUES (
            ?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?,?,?
        )
    ";


    $stmt = $conexion->prepare($sql);


    if (!$stmt) {

        echo json_encode([
            'success' => false,
            'message' => 'Error al preparar INSERT: ' . $conexion->error
        ]);

        exit;
    }


    $stmt->bind_param(
        "sssssssssssssssssssssssssssdsi",

        $datos['numero_carnet'],
        $datos['anio'],
        $datos['fecha_emision'],
        $datos['nombres'],
        $datos['apellidos'],
        $datos['genero'],
        $datos['nacionalidad'],
        $datos['tipo_sangre'],
        $datos['fecha_nacimiento'],
        $datos['lugar_nacimiento'],
        $datos['nombre_padre'],
        $datos['nombre_madre'],
        $datos['direccion'],
        $datos['color_piel'],
        $datos['color_ojos'],
        $datos['color_cabello'],
        $datos['partida_anio'],
        $datos['partida_libro'],
        $datos['partida_folio'],
        $datos['partida_tomo'],
        $datos['partida_partida'],
        $datos['tipo_tramite'],
        $datos['senales_especiales'],
        $datos['centro_estudio'],
        $datos['profesion'],
        $datos['estado_familiar'],
        $datos['fecha_vencimiento'],
        $datos['valor_carnet'],
        $datos['serie_mh'],
        $datos['usuario_creador']
    );


    if (!$stmt->execute()) {

        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar: ' . $stmt->error
        ]);

        exit;
    }


    echo json_encode([
        'success' => true,
        'id' => $stmt->insert_id,
        'accion' => 'creado',
        'message' => 'Carnet guardado correctamente.'
    ]);
}


$stmt->close();

$conexion->close();

?>