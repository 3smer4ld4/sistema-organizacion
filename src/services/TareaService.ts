
import type { Tarea, Prioridad } from "../models/Tarea";
import { LocalStorageService } from "../storage/LocalStorage";

export class TareaService {

    private tareas: Tarea[] = [];
    private almacenamiento: LocalStorageService;

    constructor() {
        this.almacenamiento = new LocalStorageService();

        // Recuperar tareas guardadas al iniciar
        this.tareas = this.almacenamiento.cargar();
    }

    // Guardar los cambios realizados
    private guardarCambios(): void {
        this.almacenamiento.guardar(this.tareas);
    }

    // Obtener todas las tareas
    obtenerTodas(): Tarea[] {
        return [...this.tareas];
    }

    // Buscar una tarea por su ID
    buscarPorId(id: string): Tarea | undefined {
        return this.tareas.find(tarea => tarea.id === id);
    }

    // Agregar una nueva tarea
    agregar(
        titulo: string,
        descripcion: string,
        categoria: string,
        prioridad: Prioridad
    ): Tarea {

        const nuevaTarea: Tarea = {
            id: crypto.randomUUID(),
            titulo,
            descripcion,
            categoria,
            prioridad,
            completada: false,
            fechaCreacion: new Date().toISOString()
        };

        this.tareas.push(nuevaTarea);

        this.guardarCambios();

        return nuevaTarea;
    }

    // Editar una tarea existente
    editar(
        id: string,
        datos: Partial<Omit<Tarea, "id" | "fechaCreacion">>
    ): boolean {

        const tarea = this.buscarPorId(id);

        if (!tarea) {
            return false;
        }

        Object.assign(tarea, datos);

        this.guardarCambios();

        return true;
    }

    // Eliminar una tarea
    eliminar(id: string): boolean {

        const posicion = this.tareas.findIndex(
            tarea => tarea.id === id
        );

        if (posicion === -1) {
            return false;
        }

        this.tareas.splice(posicion, 1);

        this.guardarCambios();

        return true;
    }

    // Cambiar el estado de una tarea
    cambiarEstado(id: string): boolean {

        const tarea = this.buscarPorId(id);

        if (!tarea) {
            return false;
        }

        tarea.completada = !tarea.completada;

        this.guardarCambios();

        return true;
    }
}
