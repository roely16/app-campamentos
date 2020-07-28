<template>
    <div>
        <v-dialog
            v-model="show_dialog"
            max-width="400"
            @click:outside="closeDialog()"
        >
            <v-card>
                <v-card-title class="headline mb-4">Asignar Médico</v-card-title>

                <v-card-text>
                    <v-form ref="form_cambio_estado" v-model="valid_form">
                        <v-row>
                            <v-col cols="12">
                                <small>Paciente: </small>
                                <h2>{{ nombre_paciente }}</h2>
                                
                            </v-col>
                            <v-col>
                                <v-combobox :rules="[v => !!v || 'Campo obligatorio!']" v-model="estado" outlined label="Médico" :items="estados" item-text="nombre" item-value="id"></v-combobox>
                            </v-col>
                        </v-row>
                        
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="closeDialog()"
                    >
                        Cancelar
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="cambiar_estado()"
                    >
                        Aceptar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    // eslint-disable-next-line no-unused-vars
    import Swal from 'sweetalert2'

    export default {
        props: {
            show_dialog: {
				type: Boolean,
				default: false
            },
            estado_paciente: null,
            id_paciente: null,
            nombre_paciente: null,
        },
        data(){
            return{
                estados: [],
                estado: null,
                valid_form: true,
            }
        },
        methods: {

            closeDialog(){
                
                this.$refs.form_cambio_estado.reset()
                this.estado = null
                this.$emit('closeDialog')

            },
            cambiar_estado(){

                this.$refs.form_cambio_estado.validate()

                if (this.valid_form) {
                    
                    //let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                    let data = {
                        id_medico: this.estado.id,
                        id_paciente: this.id_paciente,
                    }

                    this.axios.post(process.env.VUE_APP_API_URL + 'asignar_medico_paciente.php', data)
                    .then((response) => {
                                                
                        if (response.data) {
                        
                            Swal.fire(
                                'Excelente!',
                                'Se ha actualizado el estado del paciente.',
                                'success'
                            ).then(() => {

                                this.$emit('actualizarTabla')
                                this.closeDialog()

                                // if (data.id_estado == 3) {
                                    
                                //     this.$emit('borrarBusqueda')

                                // }
    
                            })

                        }

                    })

                }

            }

        },
        watch: {

            show_dialog(val){
                
                if (val) {
                    
                    let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                    let data = {
                        id_usuario: usuario.id
                    }

                    this.axios.post(process.env.VUE_APP_API_URL + 'obtener_medicos_privado.php', data)
                    .then((response) => {
                        console.log(response.data);
                        this.estados = response.data                   
                    })

                }
                
                
            }
        
        }
    }
</script>