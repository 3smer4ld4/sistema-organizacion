
import type { Tarea } from "../models/Tarea";

export class LocalStorageService {

    // Nombre con el que identificaremos nuestros datos
    private readonly CLAVE = "sistema-organizacion-tareas";

    // Guardar tareas en el navegador
    guardar(tareas: Tarea[]): void {

        const datos = JSON.stringify(tareas);

        localStorage.setItem(this.CLAVE, datos);
    }

    // Recuperar tareas del navegador
    cargar(): Tarea[] {

        const datos = localStorage.getItem(this.CLAVE);

        if (!datos) {
            return [];
        }

        try {
            return JSON.parse(datos) as Tarea[];
        } catch (error) {
            console.error("Error al recuperar las tareas:", error);
            return [];
        }
    }

    // Eliminar los datos almacenados
    limpiar(): void {

        localStorage.removeItem(this.CLAVE);
    }
}
