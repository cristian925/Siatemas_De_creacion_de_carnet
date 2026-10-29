/* =========================================
   CONTROLADOR PRINCIPAL DEL SISTEMA DE CARNETIZACIÓN
   ========================================= */

const app = {

    state: {
        role: null,
        carnetIdActual: null,
        images: {
            foto: null,
            firma: null,
            huella: null
        }
    },

          /* =========================================
       BUSCAR PERSONAS EN BASE DE DATOS
       ========================================= */

    buscarPersonas: async function() {

        const input =
            document.getElementById('buscar-persona');

        const selector =
            document.getElementById('selector-personas');

        const estado =
            document.getElementById('estado-busqueda');


        if (!input || !selector) {
            return;
        }


        const texto =
            input.value.trim();


        selector.innerHTML = `
            <option value="">
                -- Seleccione una persona --
            </option>
        `;


        if (texto.length < 2) {

            if (estado) {
                estado.innerText =
                    'Escriba al menos 2 caracteres.';
            }

            return;
        }


        try {

            const respuesta =
                await fetch(
                    '../conexion/buscar_carnets.php?q=' +
                    encodeURIComponent(texto)
                );


            const resultado =
                await respuesta.json();


            if (!resultado.success) {

                throw new Error(
                    'No fue posible realizar la búsqueda.'
                );
            }


            if (resultado.datos.length === 0) {

                if (estado) {
                    estado.innerText =
                        'No se encontraron personas.';
                }

                return;
            }


            resultado.datos.forEach(persona => {

                const option =
                    document.createElement('option');


                option.value =
                    persona.id;


                option.textContent =
                    `#${persona.numero_carnet} - ${persona.nombres} ${persona.apellidos}`;


                selector.appendChild(option);

            });


            if (estado) {

                estado.innerText =
                    `${resultado.datos.length} registro(s) encontrado(s).`;
            }


        } catch (error) {

            console.error(
                'Error buscando personas:',
                error
            );


            if (estado) {

                estado.innerText =
                    'Error al consultar la base de datos.';
            }
        }
    },


    /* =========================================
       CARGAR PERSONA EXISTENTE
       ========================================= */

    cargarPersonaExistente: async function(id) {

        if (!id) {
            return;
        }


        try {

            const respuesta =
                await fetch(
                    '../conexion/obtener_carnet.php?id=' +
                    encodeURIComponent(id)
                );


            const resultado =
                await respuesta.json();


            if (!resultado.success) {

                alert(
                    resultado.message ||
                    'No fue posible cargar el registro.'
                );

                return;
            }


            const c = resultado.carnet;
            this.state.carnetIdActual = c.id;


            const setVal = (idCampo, valor) => {

                const elemento =
                    document.getElementById(idCampo);

                if (elemento) {
                    elemento.value =
                        valor ?? '';
                }
            };


            // DATOS DEL FRENTE

            setVal('f_carnet_num', c.numero_carnet);
            setVal('f_anio', c.anio);
            setVal('f_fecha_emision', c.fecha_emision);

            setVal('f_nombres', c.nombres);
            setVal('f_apellidos', c.apellidos);

            setVal('f_genero', c.genero);
            setVal('f_nacionalidad', c.nacionalidad);
            setVal('f_sangre', c.tipo_sangre);

            setVal('f_fecha_nac', c.fecha_nacimiento);
            setVal('f_lugar_nac', c.lugar_nacimiento);

            setVal('f_padre', c.nombre_padre);
            setVal('f_madre', c.nombre_madre);


            // DATOS DEL VUELTO

            setVal('f_direccion', c.direccion);

            setVal('f_color_piel', c.color_piel);
            setVal('f_color_ojos', c.color_ojos);
            setVal('f_color_cabello', c.color_cabello);

            setVal('f_p_anio', c.partida_anio);
            setVal('f_p_libro', c.partida_libro);
            setVal('f_p_folio', c.partida_folio);
            setVal('f_p_tomo', c.partida_tomo);
            setVal('f_p_partida', c.partida_partida);

            setVal('f_tramite', c.tipo_tramite);

            setVal('f_senales', c.senales_especiales);
            setVal('f_centro_estudio', c.centro_estudio);

            setVal('f_profesion', c.profesion);
            setVal('f_estado_fam', c.estado_familiar);

            setVal('f_fecha_venc', c.fecha_vencimiento);
            setVal('f_valor', c.valor_carnet);
            setVal('f_serie_mh', c.serie_mh);


            // FOTO

          /*  if (c.foto) {

                this.state.images.foto =
                    c.foto;

                const foto =
                    document.getElementById(
                        'preview_img_foto'
                    );

                const iconFoto =
                    document.getElementById(
                        'icon_foto'
                    );

                if (foto) {
                    foto.src = c.foto;
                    foto.classList.remove('hidden');
                }

                if (iconFoto) {
                    iconFoto.classList.add('hidden');
                }
            }*/


            // FIRMA

         /*   if (c.firma) {

                this.state.images.firma =
                    c.firma;

                const firma =
                    document.getElementById(
                        'preview_img_firma'
                    );

                const iconFirma =
                    document.getElementById(
                        'icon_firma'
                    );

                if (firma) {
                    firma.src = c.firma;
                    firma.classList.remove('hidden');
                }

                if (iconFirma) {
                    iconFirma.classList.add('hidden');
                }
            }


            // HUELLA

            if (c.huella) {

                this.state.images.huella =
                    c.huella;

                const huella =
                    document.getElementById(
                        'preview_img_huella'
                    );

                const iconHuella =
                    document.getElementById(
                        'icon_huella'
                    );

                if (huella) {
                    huella.src = c.huella;
                    huella.classList.remove('hidden');
                }

                if (iconHuella) {
                    iconHuella.classList.add('hidden');
                }
            }*/


            const estado =
                document.getElementById(
                    'estado-busqueda'
                );


            if (estado) {

                estado.innerText =
                    `Registro cargado: ${c.numero_carnet} - ${c.nombres} ${c.apellidos}`;
            }


        } catch (error) {

            console.error(
                'Error cargando persona:',
                error
            );

            alert(
                'Error al consultar el registro.'
            );
        }
    },


     /* =========================================
       SELECTOR BUSCABLE DE PERSONAS
       ========================================= */

        inicializarBuscadorPersonas: function() {

        const selector =
            document.getElementById('selector-personas');

        if (!selector) {
            return;
        }

        new TomSelect('#selector-personas', {

            valueField: 'id',

            labelField: 'texto',

            searchField: [
                'numero_carnet',
                'nombres',
                'apellidos'
            ],

            placeholder:
                'Buscar por Nº carnet, nombre o apellido...',

            maxOptions: 20,

            loadThrottle: 300,

            load: async function(query, callback) {

                if (!query || query.length < 2) {
                    callback();
                    return;
                }

                try {

                    const respuesta =
                        await fetch(
                            '../conexion/buscar_carnets.php?q=' +
                            encodeURIComponent(query)
                        );

                    const resultado =
                        await respuesta.json();

                    if (!resultado.success) {
                        callback();
                        return;
                    }

                    const datos =
                        resultado.datos.map(persona => ({

                            id: persona.id,

                            numero_carnet: persona.numero_carnet,

                            nombres: persona.nombres,

                            apellidos: persona.apellidos,

                            texto: `${persona.numero_carnet} - ${persona.nombres} ${persona.apellidos}`

                        }));

                    callback(datos);

                } catch (error) {

                    console.error(
                        'Error buscando personas:',
                        error
                    );

                    callback();
                }
            },

            onChange: function(id) {

                if (id) {
                    app.cargarPersonaExistente(id);
                }
            }

        });

    },


    /* =========================================
       INICIALIZACIÓN
       ========================================= */

    init: function() {

        this.verificarSesion();

        this.loadSystemImages();

        this.setDefaultDates();

        this.cargarUsuario();

        this.inicializarBuscadorPersonas();
    },


    /* =========================================
       SESIÓN
       ========================================= */

    verificarSesion: function() {

        const sesion =
            sessionStorage.getItem('sesion_activa');

        if (sesion !== 'true') {

            window.location.href = 'login.html';

            return false;
        }

        return true;
    },


    cargarUsuario: function() {

        const nombre =
            sessionStorage.getItem('nombre_usuario');

        const rol =
            sessionStorage.getItem('rol');


        this.state.role = rol;


        const userDisplay =
            document.getElementById('user-display');

        if (userDisplay) {

            userDisplay.innerText =
                nombre || 'Usuario';
        }


        const btnSettings =
            document.getElementById('btn-settings');

        if (btnSettings) {

            if (rol === 'admin') {

                btnSettings.classList.remove('hidden');

            } else {

                btnSettings.classList.add('hidden');
            }
        }
    },


    logout: function() {

        sessionStorage.removeItem('sesion_activa');

        sessionStorage.removeItem('usuario');

        sessionStorage.removeItem('rol');

        sessionStorage.removeItem('nombre_usuario');


        window.location.href =
            'login.html';
    },


    /* =========================================
       FECHAS POR DEFECTO
       ========================================= */

    setDefaultDates: function() {

        const today =
            new Date();

        const nextYear =
            new Date();

        nextYear.setFullYear(
            today.getFullYear() + 1
        );


        const fechaEmision =
            document.getElementById('f_fecha_emision');

        const fechaVenc =
            document.getElementById('f_fecha_venc');


        if (fechaEmision) {

            fechaEmision.valueAsDate =
                today;
        }


        if (fechaVenc) {

            fechaVenc.valueAsDate =
                nextYear;
        }
    },


    /* =========================================
       NAVEGACIÓN ENTRE MÓDULOS
       ========================================= */

    changeView: function(panelId) {

        document
            .querySelectorAll('aside button')
            .forEach(btn => {

                btn.classList.remove(
                    'bg-blue-100',
                    'text-institucional',
                    'border-blue-200'
                );

                btn.classList.add(
                    'text-gray-600',
                    'border-transparent'
                );
            });


        const panelForm =
            document.getElementById('panel-form');

        const panelPreview =
            document.getElementById('panel-preview-carnet');

        const panelCarta =
            document.getElementById('panel-preview-carta');

        const panelSettings =
            document.getElementById('panel-settings');


        if (panelForm) {
            panelForm.classList.add('hidden-view');
        }

        if (panelPreview) {
            panelPreview.classList.add('hidden-view');
        }

        if (panelCarta) {
            panelCarta.classList.add('hidden-view');
        }

        if (panelSettings) {
            panelSettings.classList.add('hidden-view');
        }


        document.body.className =
            'text-gray-800';


        if (panelId === 'form') {

            if (panelForm) {
                panelForm.classList.remove('hidden-view');
            }

            const nav =
                document.getElementById('nav-form');

            if (nav) {

                nav.classList.add(
                    'bg-blue-100',
                    'text-institucional',
                    'border-blue-200'
                );

                nav.classList.remove(
                    'text-gray-600',
                    'border-transparent'
                );
            }


        } else if (panelId === 'preview-carnet') {

            if (panelPreview) {
                panelPreview.classList.remove('hidden-view');
            }

            const nav =
                document.getElementById('nav-preview');

            if (nav) {

                nav.classList.add(
                    'bg-blue-100',
                    'text-institucional',
                    'border-blue-200'
                );

                nav.classList.remove(
                    'text-gray-600',
                    'border-transparent'
                );
            }


            document.body.classList.add(
                'printing-carnet'
            );


        } else if (panelId === 'preview-carta') {

            if (panelCarta) {
                panelCarta.classList.remove('hidden-view');
            }

            const nav =
                document.getElementById('nav-letter');

            if (nav) {

                nav.classList.add(
                    'bg-blue-100',
                    'text-institucional',
                    'border-blue-200'
                );

                nav.classList.remove(
                    'text-gray-600',
                    'border-transparent'
                );
            }


            document.body.classList.add(
                'printing-carta'
            );


        } else if (panelId === 'settings') {

            const rol =
                sessionStorage.getItem('rol');

            if (rol !== 'admin') {

                alert(
                    'Esta sección está disponible únicamente para el administrador.'
                );

                this.changeView('form');

                return;
            }


            if (panelSettings) {
                panelSettings.classList.remove('hidden-view');
            }
        }
    },


    /* =========================================
       CARGA DE FOTO, FIRMA Y HUELLA
       ========================================= */

    handleImageUpload: function(inputElement, type) {

        if (
            !inputElement.files ||
            !inputElement.files[0]
        ) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(e) {

            const imagen =
                e.target.result;


            app.state.images[type] =
                imagen;


            /* PREVIEW DEL FORMULARIO */

            const previewImg =
                document.getElementById(
                    `preview_img_${type}`
                );

            const icon =
                document.getElementById(
                    `icon_${type}`
                );


            if (previewImg) {

                previewImg.src =
                    imagen;

                previewImg.classList.remove(
                    'hidden'
                );
            }


            if (icon) {

                icon.classList.add(
                    'hidden'
                );
            }


            /* FOTO */

            if (type === 'foto') {

                const fotoFrente =
                    document.getElementById(
                        'render_foto'
                    );

                const fotoVuelto =
                    document.getElementById(
                        'render_foto_v'
                    );


                if (fotoFrente) {

                    fotoFrente.src =
                        imagen;
                }


                if (fotoVuelto) {

                    fotoVuelto.src =
                        imagen;
                }
            }


            /* FIRMA */

            else if (type === 'firma') {

                const firma =
                    document.getElementById(
                        'render_firma_menor_v'
                    );


                if (firma) {

                    firma.src =
                        imagen;

                    firma.classList.remove(
                        'hidden'
                    );
                }
            }


            /* HUELLA */

            else if (type === 'huella') {

                const huella =
                    document.getElementById(
                        'render_huella_v'
                    );


                if (huella) {

                    huella.src =
                        imagen;

                    huella.classList.remove(
                        'hidden'
                    );
                }
            }
        };


        reader.readAsDataURL(
            inputElement.files[0]
        );
    },


    /* =========================================
       IMÁGENES INSTITUCIONALES
       ========================================= */

    saveSystemImage: function(inputElement, key) {

        if (
            !inputElement.files ||
            !inputElement.files[0]
        ) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(e) {

            const base64Data =
                e.target.result;


            try {

                localStorage.setItem(
                    key,
                    base64Data
                );


                app.applySystemImage(
                    key,
                    base64Data
                );


            } catch (error) {

                alert(
                    'Error al guardar imagen en navegador. El archivo puede ser demasiado pesado.'
                );
            }
        };


        reader.readAsDataURL(
            inputElement.files[0]
        );
    },


    applySystemImage: function(key, data) {

        const preview =
            document.getElementById(
                `preview_${key}`
            );


        if (preview) {

            preview.src =
                data;

            preview.classList.remove(
                'hidden'
            );
        }


        const map = {

            sys_logo_izq: [
                'render_logo_izq',
                'c_logo_alcaldia'
            ],

            sys_logo_der: [
                'render_logo_der',
                'c_escudo'
            ],

            sys_escudo_agua: [
                'render_escudo_agua'
            ],

            sys_firma_alcalde: [
                'render_firma_alcalde'
            ],

            sys_sello_alcalde: [
                'render_sello_alcalde'
            ],

            sys_firma_jefe: [
                'render_firma_jefe'
            ],

            sys_sello_jefe: [
                'render_sello_jefe'
            ]
        };


        if (map[key]) {

            map[key].forEach(
                elementId => {

                    const el =
                        document.getElementById(
                            elementId
                        );


                    if (el) {

                        el.src =
                            data;

                        el.classList.remove(
                            'hidden',
                            'opacity-0'
                        );
                    }
                }
            );
        }
    },


    loadSystemImages: function() {

        const keys = [

            'sys_logo_izq',

            'sys_logo_der',

            'sys_escudo_agua',

            'sys_firma_alcalde',

            'sys_sello_alcalde',

            'sys_firma_jefe',

            'sys_sello_jefe'
        ];


        keys.forEach(key => {

            const data =
                localStorage.getItem(key);


            if (data) {

                this.applySystemImage(
                    key,
                    data
                );
            }
        });
    },


        /* =========================================
       GUARDAR CARNET EN BASE DE DATOS
       ========================================= */

    guardarCarnet: async function() {

        const getVal = (id) => {

            const el =
                document.getElementById(id);

            return el
                ? el.value.trim()
                : '';
        };


        const datos = {


            id: this.state.carnetIdActual,

            numero_carnet:getVal('f_carnet_num'),

            anio:getVal('f_anio'),

            fecha_emision:getVal('f_fecha_emision'),

            nombres:getVal('f_nombres').toUpperCase(),

            apellidos:
                getVal('f_apellidos').toUpperCase(),

            genero:
                getVal('f_genero'),

            nacionalidad:
                getVal('f_nacionalidad').toUpperCase(),

            tipo_sangre:
                getVal('f_sangre').toUpperCase(),

            fecha_nacimiento:
                getVal('f_fecha_nac'),

            lugar_nacimiento:
                getVal('f_lugar_nac').toUpperCase(),

            nombre_padre:
                getVal('f_padre').toUpperCase(),

            nombre_madre:
                getVal('f_madre').toUpperCase(),

            direccion:
                getVal('f_direccion').toUpperCase(),

            color_piel:
                getVal('f_color_piel').toUpperCase(),

            color_ojos:
                getVal('f_color_ojos').toUpperCase(),

            color_cabello:
                getVal('f_color_cabello').toUpperCase(),

            partida_anio:
                getVal('f_p_anio'),

            partida_libro:
                getVal('f_p_libro'),

            partida_folio:
                getVal('f_p_folio'),

            partida_tomo:
                getVal('f_p_tomo'),

                partida:
                getVal('f_p_partida'),

            tipo_tramite:
                getVal('f_tramite'),

            senales_especiales:
                getVal('f_senales').toUpperCase(),

            centro_estudio:
                getVal('f_centro_estudio').toUpperCase(),

            profesion:
                getVal('f_profesion').toUpperCase(),

            estado_familiar:
                getVal('f_estado_fam'),

            fecha_vencimiento:
                getVal('f_fecha_venc'),

            valor_carnet:
                parseFloat(
                    getVal('f_valor') || '0'
                ),

            serie_mh:
                getVal('f_serie_mh').toUpperCase(),

            usuario_creador:
                parseInt(
                    sessionStorage.getItem('usuario_id')
                ) || null
        };


        if (
            !datos.numero_carnet ||
            !datos.nombres ||
            !datos.apellidos
        ) {

            alert(
                'Complete Nº Carnet, Nombres y Apellidos.'
            );

            return;
        }


        try {

            const respuesta =
                await fetch(
                    '../conexion/guardar_carnet.php',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(datos)
                    }
                );


            const resultado =
                await respuesta.json();


            if (!resultado.success) {

                alert(
                    resultado.message ||
                    'No fue posible guardar el carnet.'
                );

                return;
            }


            alert(
                'Carnet guardado correctamente.'
            );


            this.saveDataAndPreview();


        } catch (error) {

            console.error(
                'Error guardando carnet:',
                error
            );

            alert(
                'Error al conectar con el servidor.'
            );
        }

    },

    /* =========================================
       GUARDAR DATOS Y PREVISUALIZAR
       ========================================= */

    saveDataAndPreview: function(vistaDestino = 'preview-carnet') {


        const getVal = (id) => {

            const elemento =
                document.getElementById(id);


            if (!elemento) {

                console.warn(
                    'No existe el campo:',
                    id
                );

                return '---';
            }


            return (
                elemento.value.trim() ||
                '---'
            );
        };


        const setText = (id, valor) => {

            const elemento =
                document.getElementById(id);


            if (elemento) {

                elemento.innerText =
                    valor;

            } else {

                console.warn(
                    'No existe el elemento de salida:',
                    id
                );
            }
        };


        const formatDate = (id) => {

            const elemento =
                document.getElementById(id);


            if (
                !elemento ||
                !elemento.value
            ) {

                return '---';
            }


            const partes =
                elemento.value.split('-');


            if (partes.length === 3) {

                return (
                    `${partes[2]}/${partes[1]}/${partes[0]}`
                );
            }


            return elemento.value;
        };


        /* =========================================
           FRENTE
           ========================================= */

        setText(
            'r_carnet',
            getVal('f_carnet_num')
        );


        setText(
            'r_nombres',
            getVal('f_nombres')
                .toUpperCase()
        );


        setText(
            'r_apellidos',
            getVal('f_apellidos')
                .toUpperCase()
        );


        setText(
            'r_genero',
            getVal('f_genero')
                .toUpperCase()
        );


        setText(
            'r_nacionalidad',
            getVal('f_nacionalidad')
                .toUpperCase()
        );


        setText(
            'r_fecha_nac',
            formatDate('f_fecha_nac')
        );


        setText('r_lugar_nac',getVal('f_lugar_nac').toUpperCase());


        /* =========================================
           VUELTO
           ========================================= */

        setText(
            'r_direccion',
            getVal('f_direccion')
                .toUpperCase()
        );


        setText(
            'r_tramite',
            getVal('f_tramite')
                .toUpperCase()
        );


        setText(
            'r_madre_v',
            getVal('f_madre')
                .toUpperCase()
        );


        setText(
            'r_padre_v',
            getVal('f_padre')
                .toUpperCase()
        );


        setText(
            'r_color_ojos',
            getVal('f_color_ojos')
                .toUpperCase()
        );


        setText(
            'r_color_cabello',
            getVal('f_color_cabello')
                .toUpperCase()
        );


        setText(
            'r_color_piel',
            getVal('f_color_piel')
                .toUpperCase()
        );


        setText(
            'r_senales',
            getVal('f_senales')
                .toUpperCase()
        );


        setText(
            'r_centro_estudio',
            getVal('f_centro_estudio')
                .toUpperCase()
        );


        /* =========================================
           FECHAS Y SERIE MH
           ========================================= */

        setText(
            'r_fecha_venc_v',
            formatDate('f_fecha_venc')
        );


        setText(
            'r_fecha_emision_v',
            formatDate('f_fecha_emision')
        );


        setText(
            'r_serie_mh_v',
            getVal('f_serie_mh')
                .toUpperCase()
        );

/* =========================================
   REGISTRO IMPRESO TAMAÑO CARTA
   ========================================= */

const nombreCompletoCarta =
    `${getVal('f_nombres')} ${getVal('f_apellidos')}`.toUpperCase();

const lugarFechaNacimientoCarta =
    `${getVal('f_lugar_nac')}, ${formatDate('f_fecha_nac')}`.toUpperCase();

const fechaExpedicionCarta =
    formatDate('f_fecha_emision');

setText(
    'carta_reg_numero',
    getVal('f_carnet_num')
);

setText(
    'carta_reg_mh',
    getVal('f_serie_mh')
);

setText(
    'carta_reg_vencimiento',
    formatDate('f_fecha_venc')
);

setText(
    'carta_reg_nombre',
    nombreCompletoCarta
);

setText(
    'carta_reg_genero',
    getVal('f_genero').toUpperCase()
);

setText(
    'carta_reg_tramite',
    getVal('f_tramite').toUpperCase()
);

setText(
    'carta_reg_padre',
    getVal('f_padre').toUpperCase()
);

setText(
    'carta_reg_madre',
    getVal('f_madre').toUpperCase()
);

setText(
    'carta_reg_nacimiento',
    lugarFechaNacimientoCarta
);

setText(
    'carta_reg_direccion',
    getVal('f_direccion').toUpperCase()
);

setText(
    'carta_reg_piel',
    getVal('f_color_piel').toUpperCase()
);

setText(
    'carta_reg_ojos',
    getVal('f_color_ojos').toUpperCase()
);

setText(
    'carta_reg_pelo',
    getVal('f_color_cabello').toUpperCase()
);

setText(
    'carta_reg_senales',
    getVal('f_senales').toUpperCase()
);

setText(
    'carta_reg_centro',
    getVal('f_centro_estudio').toUpperCase()
);

setText(
    'carta_reg_sangre',
    getVal('f_sangre').toUpperCase()
);

setText(
    'carta_reg_estado',
    getVal('f_estado_fam')
);

setText(
    'carta_reg_profesion',
    getVal('f_profesion').toUpperCase()
);

setText(
    'carta_reg_madre2',
    getVal('f_madre').toUpperCase()
);

setText(
    'carta_reg_padre2',
    getVal('f_padre').toUpperCase()
);

setText(
    'carta_reg_p_anio',
    getVal('f_p_anio')
);

setText(
    'carta_reg_p_libro',
    getVal('f_p_libro')
);

setText(
    'carta_reg_p_tomo',
    getVal('f_p_tomo')
);

setText(
    'carta_reg_p_partida',
    getVal('f_p_partida')
);

setText(
    'carta_reg_p_folio',
    getVal('f_p_folio')
);

setText(
    'carta_reg_responsable',
    getVal('f_madre').toUpperCase()
);

/* =========================================
   FECHA Y LUGAR DE EXPEDICIÓN
   (solo si existe ese id en tu HTML)
   ========================================= */

setText(
    'carta_reg_expedicion',
    `ALCALDÍA MUNICIPAL DE SONSONATE ESTE, DISTRITO DE ARMENIA, ${fechaExpedicionCarta}`.toUpperCase()
);


/* =========================================
   CONSERVAR IMÁGENES
   ========================================= */

/* ---------- FOTO ---------- */
if (this.state.images.foto) {

    const fotoFrente =
        document.getElementById('render_foto');

    const fotoVuelto =
        document.getElementById('render_foto_v');

    const fotoCarta =
        document.getElementById('carta_foto');

    if (fotoFrente) {
        fotoFrente.src = this.state.images.foto;
    }

    if (fotoVuelto) {
        fotoVuelto.src = this.state.images.foto;
    }

    if (fotoCarta) {
        fotoCarta.src = this.state.images.foto;
    }
}


/* ---------- FIRMA MENOR ---------- */
if (this.state.images.firma) {

    const firmaVuelto =
        document.getElementById('render_firma_menor_v');

    const firmaMenorCarta =
        document.getElementById('carta_firma_menor');

    if (firmaVuelto) {
        firmaVuelto.src = this.state.images.firma;
        firmaVuelto.classList.remove('hidden');
    }

    if (firmaMenorCarta) {
        firmaMenorCarta.src = this.state.images.firma;
        firmaMenorCarta.classList.remove('hidden');
    }
}


/* ---------- HUELLA ---------- */
if (this.state.images.huella) {

    const huellaVuelto =
        document.getElementById('render_huella_v');

    const huellaCarta =
        document.getElementById('carta_huella');

    if (huellaVuelto) {
        huellaVuelto.src = this.state.images.huella;
        huellaVuelto.classList.remove('hidden');
    }

    if (huellaCarta) {
        huellaCarta.src = this.state.images.huella;
        huellaCarta.classList.remove('hidden');
    }
}

        /* =========================================
           MOSTRAR PREVISUALIZACIÓN
           ========================================= */

        this.changeView(vistaDestino);
    },


    /* =========================================
       LIMPIAR FORMULARIO
       ========================================= */

    clearForm: function() {

        const confirmar =
            confirm(
                '¿Está seguro de borrar todo el formulario?'
            );


        if (!confirmar) {

            return;
        }


        const formulario =
            document.getElementById(
                'main-form'
            );


        if (formulario) {

            formulario.reset();
        }


        this.setDefaultDates();


        this.state.images.foto = null;

        this.state.images.firma =
            null;

        this.state.images.huella =
            null;


        ['foto', 'firma', 'huella']
            .forEach(type => {


                const preview =
                    document.getElementById(
                        `preview_img_${type}`
                    );


                const icon =
                    document.getElementById(
                        `icon_${type}`
                    );


                if (preview) {

                    preview.src =
                        '';

                    preview.classList.add(
                        'hidden'
                    );
                }


                if (icon) {

                    icon.classList.remove(
                        'hidden'
                    );
                }
            });


        /* FOTO */

        const fotoFrente =
            document.getElementById(
                'render_foto'
            );

        const fotoVuelto =
            document.getElementById(
                'render_foto_v'
            );


        const fotoDefault =
            'https://placehold.co/100x130/e2e8f0/94a3b8?text=FOTO';


        if (fotoFrente) {

            fotoFrente.src =
                fotoDefault;
        }


        if (fotoVuelto) {

            fotoVuelto.src =
                fotoDefault;
        }


        /* FIRMA */

        const firma =
            document.getElementById(
                'render_firma_menor_v'
            );


        if (firma) {

            firma.src =
                '';

            firma.classList.add(
                'hidden'
            );
        }


        /* HUELLA */

        const huella =
            document.getElementById(
                'render_huella_v'
            );


        if (huella) {

            huella.src =
                '';
        }
    }

};


/* =========================================
   INICIAR SISTEMA
   ========================================= */

window.onload = function() {

    app.init();

};