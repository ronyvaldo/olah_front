import { GrupoCongregacional } from "../grupos-congregacionais/grupoCongregacional";
import { Igreja } from "../igrejas/igreja";
import { Usuario } from "../usuarios/usuario";

export class TipoDespesa {

    id: number;
    nome: string;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    grupoCongregacional: GrupoCongregacional;
    igreja: Igreja;

}