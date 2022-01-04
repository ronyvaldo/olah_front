import { Igreja } from "../igrejas/igreja";
import { TipoDespesa } from "../tipo-despesa/tipoDespesa";
import { Usuario } from "../usuarios/usuario";

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