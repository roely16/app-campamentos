<template>
    <div>
        <v-row>
            <v-dialog v-model="dialog" width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    small
                    v-bind="attrs"
                    v-on="on"
                    text
                    >
                    Acepto los Términos y Condiciones
                    </v-btn>
                </template>
                <v-card style="text-align:justify">
                    <v-card-title>
                    <span class="subtitle-2 text-center">
                        TÉRMINOS Y CONDICIONES DE USO DEL SOFTWARE “APP CAMPAMENTOS” 
                    </span>
                    </v-card-title>
                    <v-card-text>
                        Al registrarse o utilizar el software “app campamentos” acepta, reconoce y manifiesta automáticamente su conformidad con los siguientes términos y condiciones: 
                    </v-card-text>
                    <v-card-text class="subtitle-2 text-center">
                        TÉRMINOS Y CONDICIONES
                    </v-card-text>
                    <v-card-text>
                        <ol style="text-align:justify">
                            <li>
                                El software “app campamentos” requerirá previamente de un proceso de registro para crear su usuario y rol asignado dentro de un Campamento “Centro de Bienestar Respiratorio”, en cualquiera de sus modalidades, el cual será necesario validar. Usted acepta que en todo momento es el único responsable de mantener en resguardo su  información de acceso al software “app campamentos”. 
                            </li>
                            <li>
                                La información que se muestra en el software “app campamentos”, así como los accesos a los distintos menús, dependerán del usuario que tenga registrado dentro del mismo.  
                            </li>
                            <li>
                                Usted acepta que en cualquier momento se le podrá restringir los accesos al software “app campamentos” o dar de baja su usuario. 
                            </li>
                            <li>
                                La Municipalidad de Guatemala no será responsable, si las personas que hacen uso del software “app campamentos”, lo realizan con fines distintos para el cual fue diseñado o contrario a las disposiciones legales vigentes. Para lo cual la Municipalidad de Guatemala, se reserva el derecho de tomar las acciones legales que correspondan.
                            </li>
                            <li>
                                Usted acepta mantener indefinidamente la CONFIDENCIALIDAD de la información a que tenga acceso dentro del software “app campamentos” en virtud del rol que realiza o haya realizado dentro de un Campamento “Centro de Bienestar Respiratorio”, en cualquiera de sus modalidades. La Municipalidad de Guatemala, se reserva el derecho de tomar las acciones legales que correspondan por el incumplimiento de esta disposición.  
                            </li>
                            <li>
                                La Municipalidad de Guatemala en cualquier momento podrá modificar los presentes términos y condiciones. 
                            </li>
                        </ol>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="aceptar_terminos()">Aceptar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                dialog: false
            }
        },
        methods: {

            aceptar_terminos(){

                this.$emit('aceptarTerminos')
                this.dialog = false

            }
        }
    }
</script>