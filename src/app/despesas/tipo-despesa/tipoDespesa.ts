import { GrupoCongregacional } from "src/app/grupos-congregacionais/grupoCongregacional";
import { Igreja } from "src/app/igrejas/igreja";
import { Usuario } from "src/app/usuarios/usuario";

export class TipoDespesa {

    id: number;
    nome: string;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    grupoCongregacional: GrupoCongregacional;
    igreja: Igreja;

}