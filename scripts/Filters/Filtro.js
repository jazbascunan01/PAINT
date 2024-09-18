// Clase base para filtros
class Filtro {
    apply(data) {
        throw new Error("Método 'apply()' debe ser implementado.");
    }

    clamp(value) {
        return Math.max(0, Math.min(255, value));
    }
}