class Evaluacion {
    constructor(id, cartel, juez, ingles) {
        this.id = id;
        this.cartel = cartel;
        this.juez = juez;
        this.enIngles = ingles;
    }

    setResultados(rf, rc, rp, sup){
        this.resForma = rf;
        this.resContenido = rc;
        this.resPertinencia = rp;
        this.calidadSupervicion = sup;
    }
}