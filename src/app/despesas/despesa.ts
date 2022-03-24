import { Igreja } from "../igrejas/igreja";
import { Usuario } from "../usuarios/usuario";
import { TipoDespesa } from "./tipo-despesa/tipoDespesa";

export class Despesa {

    id: number;
    tipoDespesa: TipoDespesa;
    dataDespesa: string;
    valor: number;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    igreja: Igreja;
    dataInativacao: string;
    usuarioInativacao: Usuario;
    observacao: string;

}