import { Igreja } from "../igrejas/igreja";
import { Usuario } from "../usuarios/usuario";

export class Evento {
    id: number;
    nome: string;
    dataInicio: string;
    dataTermino: string;
    horarioInicio: string;
    horarioTermino: string;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    idadeMinima: number;
    idadeMaxima: number;
    igreja: Igreja;
}