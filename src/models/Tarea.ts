export type Prioridad = "baja" | "media" | "alta";
export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    prioridad: Prioridad;
    completada: boolean;
    fechaCreacion: string;
}