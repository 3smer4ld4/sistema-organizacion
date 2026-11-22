
import { TareaService } from "./services/TareaService";
import type { Prioridad, Tarea } from "./models/Tarea";
import "./styles/style.css";

// Crear el servicio de tareas
const servicio = new TareaService();

// Obtener el contenedor principal
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("No se encontró el contenedor principal.");
}

// Escapar caracteres especiales antes de insertar texto en HTML
function escaparHTML(texto: string): string {
    return texto.replace(/[&<>"']/g, caracter => {
        const caracteres: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caracter];
    });
}

// Construir la interfaz principal
app.innerHTML = `
    <main class="contenedor">

        <header class="encabezado">
            <div>
                <h1>Mi organizador</h1>
                <p>Organiza tus actividades y alcanza tus objetivos.</p>
            </div>
        </header>

        <section class="estadisticas">

            <article class="tarjeta-estadistica">
                <p>Total de tareas</p>
                <h2 id="total-tareas">0</h2>
            </article>

            <article class="tarjeta-estadistica">
                <p>Pendientes</p>
                <h2 id="tareas-pendientes">0</h2>
            </article>

            <article class="tarjeta-estadistica">
                <p>Completadas</p>
                <h2 id="tareas-completadas">0</h2>
            </article>

        </section>

        <section class="panel">

            <h2>Agregar nueva tarea</h2>

            <form id="formulario-tarea" class="formulario">

                <div class="campo campo-completo">
                    <label for="titulo">Título de la tarea</label>

                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        placeholder="Ej. Estudiar TypeScript"
                        maxlength="100"
                        required
                    />
                </div>

                <div class="campo campo-completo">
                    <label for="descripcion">Descripción</label>

                    <textarea
                        id="descripcion"
                        name="descripcion"
                        placeholder="Describe tu actividad..."
                        maxlength="500"
                    ></textarea>
                </div>

                <div class="campo">
                    <label for="categoria">Categoría</label>

                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        placeholder="Ej. Estudio"
                        maxlength="50"
                        required
                    />
                </div>

                <div class="campo">
                    <label for="prioridad">Prioridad</label>

                    <select id="prioridad" name="prioridad" required>
                        <option value="baja">Baja</option>
                        <option value="media" selected>Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>

                <div class="campo campo-completo">
                    <button type="submit" class="btn btn-principal">
                        + Agregar tarea
                    </button>
                </div>

            </form>

        </section>


<section class="seccion-tareas">

    <h2>Mis tareas</h2>

    <!-- Herramientas de búsqueda y filtrado -->
    <div class="filtros-tareas">

        <div class="campo">
            <label for="buscar-tarea">Buscar tarea</label>
            <input
                type="search"
                id="buscar-tarea"
                placeholder="Escribe el título..."
            />
        </div>

        <div class="campo">
            <label for="filtro-estado">Filtrar por estado</label>
            <select id="filtro-estado">
                <option value="todas">Todas</option>
                <option value="pendientes">Pendientes</option>
                <option value="completadas">Completadas</option>
            </select>
        </div>

        <div class="campo">
            <label for="filtro-prioridad">Filtrar por prioridad</label>
            <select id="filtro-prioridad">
                <option value="todas">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
            </select>
        </div>

    </div>

    <div id="lista-tareas" class="lista-tareas"></div>

</section>

        </section>

    </main>
`;

// Actualizar las tareas y las estadísticas
function mostrarTareas(): void {

    const tareas: Tarea[] = servicio.obtenerTodas();

    const total = tareas.length;

    const completadas = tareas.filter(
        tarea => tarea.completada
    ).length;

    const pendientes = total - completadas;

    // Actualizar estadísticas
    document.querySelector("#total-tareas")!.textContent =
        String(total);

    document.querySelector("#tareas-pendientes")!.textContent =
        String(pendientes);

    document.querySelector("#tareas-completadas")!.textContent =
        String(completadas);

    const lista = document.querySelector<HTMLDivElement>(
        "#lista-tareas"
    )!;

    // Mostrar mensaje cuando no existen tareas
    if (tareas.length === 0) {

        lista.innerHTML = `
            <div class="mensaje-vacio">
                <p>No tienes tareas registradas todavía.</p>
                <p>¡Agrega tu primera actividad!</p>
            </div>
        `;

        return;
    }
// Obtener los valores de los filtros
const busqueda = document.querySelector<HTMLInputElement>(
    "#buscar-tarea"
)!.value.trim().toLowerCase();

const filtroEstado = document.querySelector<HTMLSelectElement>(
    "#filtro-estado"
)!.value;

const filtroPrioridad = document.querySelector<HTMLSelectElement>(
    "#filtro-prioridad"
)!.value;

// Aplicar los filtros a las tareas
const tareasFiltradas = tareas.filter(tarea => {

    // Comprobar si el título coincide con la búsqueda
    const coincideBusqueda = tarea.titulo
        .toLowerCase()
        .includes(busqueda);

    // Comprobar el estado
    const coincideEstado =
        filtroEstado === "todas" ||
        (filtroEstado === "pendientes" && !tarea.completada) ||
        (filtroEstado === "completadas" && tarea.completada);

    // Comprobar la prioridad
    const coincidePrioridad =
        filtroPrioridad === "todas" ||
        tarea.prioridad === filtroPrioridad;

    // La tarea debe cumplir todos los filtros
    return coincideBusqueda && coincideEstado && coincidePrioridad;

});
    // Construir las tarjetas de tareas
    lista.innerHTML = tareasFiltradas.map(tarea => {

        const titulo = escaparHTML(tarea.titulo);
        const descripcion = escaparHTML(tarea.descripcion);
        const categoria = escaparHTML(tarea.categoria);

        return `
            <article class="tarjeta-tarea ${tarea.completada ? "tarea-completada" : ""}">

                <div class="informacion-tarea">

                    <h3>${titulo}</h3>

                    <p>${descripcion || "Sin descripción"}</p>

                    <div class="detalles-tarea">

                        <span class="etiqueta">${categoria}</span>

                        <span class="etiqueta prioridad-${tarea.prioridad}">
                            Prioridad ${tarea.prioridad}
                        </span>

                        <span class="etiqueta ${
                            tarea.completada
                                ? "estado-completada"
                                : "estado-pendiente"
                        }">
                            ${
                                tarea.completada
                                    ? "Completada"
                                    : "Pendiente"
                            }
                        </span>

                    </div>

                </div>

                <div class="acciones-tarea">

                    <button
                        class="btn-accion btn-completar"
                        data-accion="estado"
                        data-id="${tarea.id}">
                        ${tarea.completada ? "Reabrir" : "Completar"}
                    </button>

                    <button
                        class="btn-accion btn-editar"
                        data-accion="editar"
                        data-id="${tarea.id}">
                        Editar
                    </button>

                    <button
                        class="btn-accion btn-eliminar"
                        data-accion="eliminar"
                        data-id="${tarea.id}">
                        Eliminar
                    </button>

                </div>

            </article>
        `;

    }).join("");
}

// Controlar las acciones de los botones de cada tarea
const listaTareas = document.querySelector<HTMLDivElement>(
    "#lista-tareas"
)!;

listaTareas.addEventListener("click", (evento: MouseEvent) => {

    // Identificar el botón que recibió el clic
    if (!(evento.target instanceof Element)) return;

    const boton = evento.target.closest<HTMLButtonElement>(
        "button[data-accion]"
    );

    if (!boton) return;

    const accion = boton.dataset.accion;
    const id = boton.dataset.id;

    if (!id) return;

    // Completar o reabrir una tarea
    if (accion === "estado") {

        servicio.cambiarEstado(id);
        mostrarTareas();

    }

    // Eliminar una tarea
    if (accion === "eliminar") {

        const confirmar = window.confirm(
            "¿Estás segura de que deseas eliminar esta tarea?"
        );

        if (confirmar) {
            servicio.eliminar(id);
            mostrarTareas();
        }

    }

    // Editar una tarea
    if (accion === "editar") {

        const tarea = servicio.buscarPorId(id);

        if (!tarea) return;

        const nuevoTitulo = window.prompt(
            "Nuevo título:",
            tarea.titulo
        );

        if (nuevoTitulo === null) return;

        const nuevaDescripcion = window.prompt(
            "Nueva descripción:",
            tarea.descripcion
        );

        if (nuevaDescripcion === null) return;

        const nuevaCategoria = window.prompt(
            "Nueva categoría:",
            tarea.categoria
        );

        if (nuevaCategoria === null) return;

        const nuevaPrioridad = window.prompt(
            "Nueva prioridad (baja, media o alta):",
            tarea.prioridad
        );

        if (nuevaPrioridad === null) return;

        const prioridadNormalizada = nuevaPrioridad.trim().toLowerCase();

        // Validar los datos
        if (!nuevoTitulo.trim() || !nuevaCategoria.trim()) {

            alert("El título y la categoría son obligatorios.");
            return;

        }

        if (
            prioridadNormalizada !== "baja" &&
            prioridadNormalizada !== "media" &&
            prioridadNormalizada !== "alta"
        ) {

            alert("La prioridad debe ser baja, media o alta.");
            return;

        }

        // Guardar los cambios
        servicio.editar(id, {
            titulo: nuevoTitulo.trim(),
            descripcion: nuevaDescripcion.trim(),
            categoria: nuevaCategoria.trim(),
            prioridad: prioridadNormalizada as Prioridad
        });

        mostrarTareas();

    }

});
// Obtener los controles de búsqueda y filtrado
const buscador = document.querySelector<HTMLInputElement>(
    "#buscar-tarea"
)!;

const filtroEstado = document.querySelector<HTMLSelectElement>(
    "#filtro-estado"
)!;

const filtroPrioridad = document.querySelector<HTMLSelectElement>(
    "#filtro-prioridad"
)!;

// Actualizar la lista cuando se escriba en el buscador
buscador.addEventListener("input", () => {
    mostrarTareas();
});

// Actualizar la lista cuando cambie el estado
filtroEstado.addEventListener("change", () => {
    mostrarTareas();
});

// Actualizar la lista cuando cambie la prioridad
filtroPrioridad.addEventListener("change", () => {
    mostrarTareas();
});
// Registrar nuevas tareas
const formulario = document.querySelector<HTMLFormElement>(
    "#formulario-tarea"
)!;

formulario.addEventListener("submit", (evento: SubmitEvent) => {

    evento.preventDefault();

    const datos = new FormData(formulario);

    const titulo = String(datos.get("titulo") ?? "").trim();
    const descripcion = String(datos.get("descripcion") ?? "").trim();
    const categoria = String(datos.get("categoria") ?? "").trim();
    const prioridad = String(datos.get("prioridad") ?? "") as Prioridad;

// Validar título
if (!titulo) {
    alert("El título de la tarea es obligatorio.");
    return;
}

if (titulo.length < 3) {
    alert("El título debe tener al menos 3 caracteres.");
    return;
}

// Validar categoría
if (!categoria) {
    alert("La categoría es obligatoria.");
    return;
}

if (categoria.length < 3) {
    alert("La categoría debe tener al menos 3 caracteres.");
    return;
}

// Validar prioridad
if (
    prioridad !== "baja" &&
    prioridad !== "media" &&
    prioridad !== "alta"
) {
    alert("Selecciona una prioridad válida.");
    return;
}

    servicio.agregar(
        titulo,
        descripcion,
        categoria,
        prioridad
    );

    formulario.reset();

    // Restaurar prioridad predeterminada
    formulario.querySelector<HTMLSelectElement>(
        "#prioridad"
    )!.value = "media";

    mostrarTareas();

});

// Mostrar las tareas guardadas al iniciar
mostrarTareas();
