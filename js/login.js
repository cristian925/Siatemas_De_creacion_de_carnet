// ==========================================
// LOGIN DEL SISTEMA
// ==========================================

/*const USUARIOS = {

    admin: {
        usuario: 'admin',
        clave: 'Admin2026*',
        rol: 'admin',
        nombre: 'Administrador Sistema'
    },

    operador: {
        usuario: 'usuario',
        clave: 'User2026',
        rol: 'operador',
        nombre: 'Operador de Registro'
    }

};*/
// ==========================================
// LOGIN DEL SISTEMA
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    const formulario =
        document.getElementById('login-form');

    if (!formulario) {
        console.error('No se encontró el formulario de login.');
        return;
    }


    formulario.addEventListener('submit', async function (event) {

        event.preventDefault();


        const usuario =
            document.getElementById('login-user')
                .value
                .trim();

        const clave =
            document.getElementById('login-pass')
                .value;


        if (!usuario || !clave) {

            alert('Ingrese usuario y contraseña.');

            return;
        }


        try {

            const respuesta = await fetch('../conexion/login.php', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    usuario: usuario,
                    clave: clave
                })

            });


            if (!respuesta.ok) {
                throw new Error(
                    'Error HTTP: ' + respuesta.status
                );
            }


            const resultado =
                await respuesta.json();


            if (!resultado.success) {

                alert(
                    resultado.message ||
                    'Usuario o contraseña incorrectos.'
                );

                return;
            }


            // ======================================
            // GUARDAR SESIÓN EN EL NAVEGADOR
            // ======================================

            sessionStorage.setItem(
                'sesion_activa',
                'true'
            );

            sessionStorage.setItem(
                'usuario_id',
                resultado.usuario.id
            );

            sessionStorage.setItem(
                'usuario',
                resultado.usuario.usuario
            );

            sessionStorage.setItem(
                'rol',
                resultado.usuario.rol
            );

            sessionStorage.setItem(
                'nombre_usuario',
                resultado.usuario.nombre
            );


            // ======================================
            // ENTRAR AL SISTEMA
            // ======================================

            window.location.href =
                'sistema_de_carnet.html';


        } catch (error) {

            console.error(
                'Error de conexión:',
                error
            );

            alert(
                'No fue posible conectar con el servidor.'
            );
        }

    });

});