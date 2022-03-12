import { Igreja } from "../igrejas/igreja";
import { TipoContribuicao } from "./tipo-contribuicao/tipoContribuicao";
import { Usuario } from "../usuarios/usuario";

export class Contribuicao {

    id: number;
    tipoContribuicao: TipoContribuicao;
    dataContribuicao: string;
    membro : Usuario;
    valor: number;
    dataCadastro: string;
    usuarioCadastro: Usuario;
    igreja: Igreja;
    dataInativacao: string;
    usuarioInativacao: Usuario;

}