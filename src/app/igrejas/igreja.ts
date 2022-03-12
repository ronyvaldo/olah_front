import { GrupoCongregacional } from "../grupos-congregacionais/grupoCongregacional";
import { Usuario } from "../usuarios/usuario";

export class Igreja {

    id: number;
    nome: string;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    grupoCongregacional: GrupoCongregacional;
}