import type { ILoginResponse } from "@/interfaces/ILoginResponse";
import { defineStore } from "pinia";
import { ref } from "vue";

type UserType = ILoginResponse | undefined;

export const usuarioStore = defineStore("usuario", () => {
  const usuario = ref(undefined as UserType);

  const setUsuario = (new_usuario: UserType) => {
    usuario.value = new_usuario;
  };

  return { usuario, setUsuario };
});
